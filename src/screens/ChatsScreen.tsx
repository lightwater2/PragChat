import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  createConversation,
  selectConversation,
  togglePinConversation,
  deleteConversation,
  toggleMuteConversation,
  markAllMessagesAsRead
} from '../state/slices/chatSlice';
import { SwipeableItem } from '../components/common/SwipeableItem';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { MainStackParamList } from '../navigation/types';

/**
 * 대화 목록 항목 컴포넌트 Props
 */
interface ChatListItemProps {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: number;
  unreadCount: number;
  onPress: () => void;
}

/**
 * 대화 목록 항목 컴포넌트
 */
const ChatListItem: React.FC<ChatListItemProps> = ({
  id,
  title,
  lastMessage,
  timestamp,
  unreadCount,
  onPress,
}) => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const formattedDate = new Date(timestamp).toLocaleDateString();
  
  // 대화 고정 처리
  const handlePin = () => {
    dispatch(togglePinConversation(id));
  };
  
  // 읽음 표시 처리
  const handleMarkAsRead = () => {
    if (unreadCount > 0) {
      dispatch(markAllMessagesAsRead(id));
    }
  };
  
  // 대화 삭제 처리
  const handleDelete = () => {
    Alert.alert(
      '대화 삭제',
      '이 대화를 삭제하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => dispatch(deleteConversation(id)),
        },
      ],
      { cancelable: true }
    );
  };
  
  // 알림 설정 처리
  const handleMute = () => {
    dispatch(toggleMuteConversation(id));
  };
  
  // 스와이프 액션 정의
  const leftActions = [
    {
      text: '고정',
      icon: 'pin',
      color: '#4CAF50',
      onPress: handlePin,
    },
    {
      text: '읽음',
      icon: 'checkmark-circle',
      color: '#2196F3',
      onPress: handleMarkAsRead,
    },
  ];
  
  const rightActions = [
    {
      text: '알림',
      icon: 'notifications-off',
      color: '#FF9800',
      onPress: handleMute,
    },
    {
      text: '삭제',
      icon: 'trash',
      color: '#F44336',
      onPress: handleDelete,
    },
  ];
  
  // 채팅 항목 내용
  const chatItemContent = (
    <View
      style={[
        styles.chatItem,
        isDarkMode ? styles.chatItemDark : {},
      ]}
    >
      <View style={styles.chatAvatar}>
        <Text style={styles.chatAvatarText}>
          {title.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.chatItemContent}>
        <Text
          style={[
            styles.chatItemTitle,
            isDarkMode ? styles.textDark : {},
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.chatItemMessage,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
          numberOfLines={2}
        >
          {lastMessage || '새 대화'}
        </Text>
      </View>
      <View style={styles.chatItemMeta}>
        <Text
          style={[
            styles.chatItemDate,
            isDarkMode ? styles.textSecondaryDark : {},
          ]}
        >
          {formattedDate}
        </Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  );
  
  return (
    <SwipeableItem
      leftActions={leftActions}
      rightActions={rightActions}
      onPress={onPress}
    >
      {chatItemContent}
    </SwipeableItem>
  );
};

/**
 * 대화 목록 화면 컴포넌트
 */
export const ChatsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  
  // 상태 가져오기
  const { chatPreviews, currentConversationId } = useAppSelector((state) => state.chat);
  
  // 대화 선택 처리
  const handleSelectChat = (chatId: string) => {
    dispatch(selectConversation(chatId));
    navigation.navigate('Chat', { conversationId: chatId });
  };
  
  // 새 대화 시작 - 비활성화
  const handleNewChat = () => {
    // 비활성화
    // navigation.navigate('ModelSelection');
    console.log('새 대화 시작 기능이 비활성화되었습니다.');
  };
  
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
    >
      {chatPreviews.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text
            style={[
              styles.emptyText,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            대화 내역이 없습니다.
          </Text>
          <Text
            style={[
              styles.emptySubText,
              isDarkMode ? styles.textSecondaryDark : {},
            ]}
          >
            새 대화를 시작해보세요.
          </Text>
          <Text
            style={[
              styles.emptySubText,
              isDarkMode ? styles.textSecondaryDark : {},
            ]}
          >
            친구 탭에서 연락처를 선택하여 대화를 시작하세요.
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={chatPreviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatListItem
                id={item.id}
                title={item.title}
                lastMessage={item.lastMessage}
                timestamp={item.timestamp}
                unreadCount={item.unreadCount}
                onPress={() => handleSelectChat(item.id)}
              />
            )}
            contentContainerStyle={styles.listContent}
          />
          {/* FAB 버튼 제거 */}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatAvatarText: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.background,
  },
  listContent: {
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightTheme.border,
    alignItems: 'center',
    backgroundColor: Colors.lightTheme.background,
    // iOS 스타일 스와이프를 위한 스타일 추가
    marginHorizontal: 0,
    marginVertical: 0,
  },
  chatItemDark: {
    borderBottomColor: Colors.darkTheme.border,
    backgroundColor: Colors.darkTheme.background,
  },
  chatItemContent: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  chatItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  chatItemMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  chatItemMeta: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingVertical: 2,
    minWidth: 60,
  },
  chatItemDate: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  unreadBadge: {
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  unreadBadgeText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  emptySubText: {
    fontSize: 16,
    marginBottom: 24,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  newChatButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  newChatButtonText: {
    color: Colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabDark: {
    backgroundColor: Colors.primary,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
});