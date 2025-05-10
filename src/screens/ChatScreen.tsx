import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert, ImageBackground, TouchableOpacity, AppState, KeyboardAvoidingView, Platform } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  createConversation,
  selectConversation,
  markAllMessagesAsRead,
  sendMessageAndGetResponse,
  updateConversationTitle,
  clearCurrentConversation
} from '../state/slices/chatSlice';
import { store } from '../state/store';
import { ChatBubble } from '../components/chat/ChatBubble';
import { MessageInput } from '../components/chat/MessageInput';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { useTheme } from '../context/ThemeContext';
import { Message, MessageRole } from '../types/chat';
import { Colors } from '../constants/colors';
import { generateAiResponse } from '../api/chatService';
import { MainStackParamList, RootStackParamList } from '../navigation/types';
import { getBackgroundById, getDefaultBackground } from '../constants/backgrounds';

/**
 * 채팅 화면 컴포넌트
 */
export const ChatScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'Chat'>>();
  const { conversationId, contactName, contactId, modelId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const flatListRef = useRef<FlatList>(null);
  
  // 앱 상태 관리
  const appState = useRef(AppState.currentState);
  
  // 상태 가져오기
  const { conversations, currentConversationId, isLoading, selectedModelId } = useAppSelector(
    (state) => state.chat
  );
  const { settings } = useAppSelector((state) => state.settings);
  
  // 현재 대화 찾기
  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );
  
  // 타이핑 효과를 위한 상태
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  
  // 메시지 읽음 상태 업데이트
  const updateReadStatus = useCallback(() => {
    if (conversationId && conversationId !== 'new') {
      dispatch(markAllMessagesAsRead(conversationId));
    }
  }, [conversationId, dispatch]);
  
  // 컴포넌트 마운트 시 대화 선택 또는 새 대화 준비
  useEffect(() => {
    if (conversationId === 'new') {
      // 새 대화는 첫 메시지 전송 시 생성됨
      // 현재 대화 ID 초기화 (이전 대화와 분리하기 위해)
      dispatch(clearCurrentConversation());
    } else {
      // 기존 대화 선택
      dispatch(selectConversation(conversationId));
      
      // 메시지 읽음 상태 업데이트
      updateReadStatus();
    }
  }, [dispatch, conversationId, updateReadStatus]);
  
  // 헤더 제목 및 버튼 설정
  useEffect(() => {
    if (contactName) {
      navigation.setOptions({
        title: contactName,
        headerRight: () => (
          <TouchableOpacity
            onPress={handleOpenBackgroundSettings}
            style={{ marginRight: 16 }}
          >
            <Ionicons
              name="image-outline"
              size={24}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        ),
      });
    } else if (currentConversation?.title) {
      navigation.setOptions({
        title: currentConversation.title,
        headerRight: () => (
          <TouchableOpacity
            onPress={handleOpenBackgroundSettings}
            style={{ marginRight: 16 }}
          >
            <Ionicons
              name="image-outline"
              size={24}
              color={Colors.textLight}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, contactName, currentConversation?.title]);
  
  /**
   * 배경 설정 화면 열기
   */
  const handleOpenBackgroundSettings = () => {
    navigation.navigate('Main', {
      screen: 'SettingsDetail',
      params: { screen: '채팅 배경' }
    });
  };
  
  // 메시지 목록이 변경되면 스크롤 아래로 이동
  useEffect(() => {
    if (currentConversation?.messages) {
      setDisplayedMessages(currentConversation.messages);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
      // 현재 대화에 있는 상태에서 실시간 메시지 업데이트 시 읽음 상태 처리
      if (conversationId && conversationId !== 'new') {
        updateReadStatus();
      }
    }
  }, [currentConversation?.messages, conversationId, updateReadStatus]);
  
  // 앱 상태 변경 감지 (포그라운드로 돌아올 때 읽음 상태 업데이트)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        conversationId &&
        conversationId !== 'new'
      ) {
        updateReadStatus();
      }
      
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
    };
  }, [conversationId, updateReadStatus]);
  
  /**
   * 사용자 메시지 전송 처리
   */
  const handleSendMessage = async (content: string) => {
    let targetConversationId = currentConversationId;
    
    // 새 대화인 경우 대화 인스턴스 생성
    if (conversationId === 'new') {
      // 친구 탭에서 전달받은 contactId와 modelId 사용
      const useModelId = modelId || selectedModelId;
      
      // contactId가 없으면 처리할 수 없음
      if (!contactId) {
        console.error('Contact ID is missing for new conversation');
        Alert.alert('오류', '대화 상대 정보가 누락되었습니다. 다시 시도해주세요.');
        return;
      }
      
      // 새 대화 생성
      dispatch(createConversation({
        modelId: useModelId,
        contactId: contactId
      }));
      
      // Redux 상태 업데이트를 기다림
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 업데이트된 상태 가져오기
      const state = store.getState();
      targetConversationId = state.chat.currentConversationId;
      
      // 대화 제목 설정 (연락처 이름)
      if (targetConversationId && contactName) {
        dispatch(updateConversationTitle({
          conversationId: targetConversationId,
          title: contactName
        }));
      }
      
      // 네비게이션 히스토리 업데이트
      if (targetConversationId) {
        navigation.setParams({
          conversationId: targetConversationId,
          contactId: undefined,  // 이미 사용했으므로 제거
          modelId: undefined     // 이미 사용했으므로 제거
        });
      }
    }
    
    if (!targetConversationId) return;
    
    // 타이핑 효과 시작
    setIsTyping(true);
    
    try {
      // 비동기 액션 생성자를 사용하여 메시지 전송 및 응답 처리
      await dispatch(
        sendMessageAndGetResponse({
          content,
          conversationId: targetConversationId,
        })
      ).unwrap();
      
      setIsTyping(false);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // 오류 메시지 추출
      let errorMessage = '응답을 생성하는 중에 오류가 발생했습니다.';
      
      if (error instanceof Error) {
        // 오류 객체에서 메시지 추출
        errorMessage = error.message;
        
        // 인증 오류인 경우 더 구체적인 메시지 제공
        if (errorMessage.includes('403') || errorMessage.includes('401') ||
            errorMessage.includes('Invalid authorization token') ||
            errorMessage.includes('인증 오류')) {
          errorMessage = '인증 오류: API 키가 유효하지 않거나 만료되었습니다.\n\n' +
                         '환경 설정을 확인하고 API 키를 업데이트해주세요.';
        }
      }
      
      Alert.alert(
        '오류 발생',
        errorMessage,
        [{ text: '확인' }]
      );
      
      setIsTyping(false);
    }
  };
  
  // 배경 색상 가져오기
  const getBackgroundColor = () => {
    // 대화별 배경 이미지 설정
    if (currentConversation?.backgroundImage) {
      const background = getBackgroundById(currentConversation.backgroundImage);
      if (background) {
        return background.color;
      }
    }
    
    // 전역 설정의 기본 배경 사용
    if (settings.chat.defaultBackground) {
      const background = getBackgroundById(settings.chat.defaultBackground);
      if (background) {
        return background.color;
      }
    }
    
    // 기본 배경 색상 사용
    return getDefaultBackground().color;
  };
  
  // 배경 투명도 가져오기
  const getBackgroundOpacity = () => {
    return settings.chat.backgroundOpacity !== undefined ? settings.chat.backgroundOpacity : 0.5;
  };
  
  // 배경 흐림 효과 사용 여부
  const useBackgroundBlur = () => {
    return !!settings.chat.backgroundBlur;
  };
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
      contentContainerStyle={{ flex: 1 }}
      enabled={Platform.OS === 'ios'}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: getBackgroundColor() }
        ]}
      >
        <View
          style={[
            styles.overlay,
            {
              backgroundColor: useBackgroundBlur()
                ? `rgba(${isDarkMode ? '0, 0, 0' : '255, 255, 255'}, ${getBackgroundOpacity() * 0.9})`
                : `rgba(${isDarkMode ? '0, 0, 0' : '255, 255, 255'}, ${getBackgroundOpacity()})`,
            },
          ]}
        >
          <FlatList
            ref={flatListRef}
            style={styles.messageList}
            data={displayedMessages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={styles.messageListContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets={true}
            automaticallyAdjustsScrollIndicatorInsets={true}
          />
          
          {isTyping && <TypingIndicator isVisible={isTyping} />}
          
          <MessageInput onSend={handleSendMessage} disabled={isLoading} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between', // 컨텐츠 사이 공간 균등 분배
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
});