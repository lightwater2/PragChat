import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { MainStackParamList, RootStackParamList } from '../navigation/types';
import { Colors } from '../constants/colors';
import { deleteContact, setContactOnlineStatus } from '../state/slices/contactsSlice';
import { REQUESTY_MODELS } from '../constants/llmModels';
import { SystemMessage } from '../types/contact';

/**
 * 시스템 프롬프트 내용을 문자열로 변환
 */
const getSystemPromptContent = (systemPrompt: string | SystemMessage | SystemMessage[]): string => {
  if (typeof systemPrompt === 'string') {
    return systemPrompt;
  } else if (Array.isArray(systemPrompt)) {
    return systemPrompt.map(msg => msg.content).join('\n\n');
  } else {
    return systemPrompt.content;
  }
};

/**
 * 연락처 상세 화면
 */
export const ContactDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'ContactDetail'>>();
  const { contactId } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  
  // 연락처 정보 가져오기
  const contact = useAppSelector((state) =>
    state.contacts.contacts.find((c) => c.id === contactId)
  );
  
  // 모델 정보 가져오기
  const getModelName = (modelId: string): string => {
    const modelEntries = Object.entries(REQUESTY_MODELS);
    const modelEntry = modelEntries.find(([_, value]) => value === modelId);
    
    if (modelEntry) {
      const [key] = modelEntry;
      // 모델 키를 사람이 읽기 쉬운 형태로 변환
      return key
        .replace(/_/g, ' ')
        .replace(/LATEST/g, '')
        .replace(/([A-Z])/g, ' $1')
        .trim();
    }
    
    return modelId;
  };
  
  // 연락처가 없는 경우 처리
  if (!contact) {
    useEffect(() => {
      Alert.alert('오류', '연락처를 찾을 수 없습니다.');
      navigation.goBack();
    }, [navigation]);
    
    return null;
  }
  
  // 헤더 설정
  useEffect(() => {
    navigation.setOptions({
      title: contact.name,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            // 편집 화면으로 이동
            navigation.navigate('ContactEdit', { contactId });
          }}
          style={{ marginRight: 16 }}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={isDarkMode ? Colors.textLight : Colors.textPrimary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, contact.name, isDarkMode]);
  
  /**
   * 연락처 삭제 처리
   */
  const handleDeleteContact = () => {
    Alert.alert(
      '연락처 삭제',
      `${contact.name} 연락처를 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteContact(contactId));
            navigation.goBack();
          },
        },
      ]
    );
  };
  
  /**
   * 온라인 상태 토글
   */
  const toggleOnlineStatus = () => {
    dispatch(
      setContactOnlineStatus({
        contactId,
        isOnline: !contact.isOnline,
      })
    );
  };
  
  return (
    <ScrollView
      style={[
        styles.container,
        isDarkMode && styles.containerDark,
      ]}
    >
      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        {/* 프로필 이미지 */}
        <View style={styles.avatarContainer}>
          {contact.avatar ? (
            <Image source={{ uri: contact.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary }]}>
              <Text style={styles.avatarText}>
                {contact.name.substring(0, 2)}
              </Text>
            </View>
          )}
          
          {/* 온라인 상태 표시 */}
          <View
            style={[
              styles.statusIndicator,
              contact.isOnline ? styles.statusOnline : styles.statusOffline,
            ]}
          />
        </View>
        
        {/* 이름 */}
        <Text
          style={[
            styles.name,
            isDarkMode && styles.textDark,
          ]}
        >
          {contact.name}
        </Text>
        
        {/* 모델 정보 */}
        <Text
          style={[
            styles.modelInfo,
            isDarkMode && styles.textSecondaryDark,
          ]}
        >
          {getModelName(contact.modelId)}
        </Text>
        
        {/* 마지막 활동 시간 */}
        <Text
          style={[
            styles.lastActive,
            isDarkMode && styles.textSecondaryDark,
          ]}
        >
          {contact.isOnline
            ? '온라인'
            : `마지막 활동: ${new Date(contact.lastActive).toLocaleString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}`}
        </Text>
      </View>
      
      {/* 액션 버튼 섹션 */}
      <View style={styles.actionSection}>
        {/* 채팅 버튼 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            // 채팅 화면으로 이동
            navigation.navigate('Chat', { conversationId: contactId, contactName: contact.name });
          }}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons name="chatbubble" size={24} color={Colors.textLight} />
          </View>
          <Text
            style={[
              styles.actionText,
              isDarkMode && styles.textDark,
            ]}
          >
            채팅
          </Text>
        </TouchableOpacity>
        
        {/* 온라인 상태 토글 버튼 */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={toggleOnlineStatus}
        >
          <View style={styles.actionIconContainer}>
            <Ionicons
              name={contact.isOnline ? 'radio' : 'radio-outline'}
              size={24}
              color={Colors.textLight}
            />
          </View>
          <Text
            style={[
              styles.actionText,
              isDarkMode && styles.textDark,
            ]}
          >
            {contact.isOnline ? '오프라인으로 전환' : '온라인으로 전환'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 페르소나 정보 섹션 */}
      <View style={styles.infoSection}>
        <Text
          style={[
            styles.sectionTitle,
            isDarkMode && styles.textDark,
          ]}
        >
          페르소나 정보
        </Text>
        
        <View
          style={[
            styles.infoCard,
            isDarkMode && styles.infoCardDark,
          ]}
        >
          <Text
            style={[
              styles.infoTitle,
              isDarkMode && styles.textDark,
            ]}
          >
            설명
          </Text>
          <Text
            style={[
              styles.infoContent,
              isDarkMode && styles.textSecondaryDark,
            ]}
          >
            {contact.persona.description}
          </Text>
          
          <Text
            style={[
              styles.infoTitle,
              isDarkMode && styles.textDark,
              { marginTop: 16 },
            ]}
          >
            시스템 프롬프트
          </Text>
          <Text
            style={[
              styles.infoContent,
              isDarkMode && styles.textSecondaryDark,
            ]}
          >
            {getSystemPromptContent(contact.persona.systemPrompt)}
          </Text>
          
          {contact.persona.advancedSettings && (
            <>
              <Text
                style={[
                  styles.infoTitle,
                  isDarkMode && styles.textDark,
                  { marginTop: 16 },
                ]}
              >
                고급 설정
              </Text>
              <Text
                style={[
                  styles.infoContent,
                  isDarkMode && styles.textSecondaryDark,
                ]}
              >
                Temperature: {contact.persona.advancedSettings.temperature}
                {contact.persona.advancedSettings.topK && 
                  `, Top K: ${contact.persona.advancedSettings.topK}`}
                {contact.persona.advancedSettings.topP && 
                  `, Top P: ${contact.persona.advancedSettings.topP}`}
              </Text>
            </>
          )}
        </View>
      </View>
      
      {/* 삭제 버튼 */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteContact}
      >
        <Text style={styles.deleteButtonText}>연락처 삭제</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.background,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTheme.border,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: Colors.lightTheme.background,
  },
  statusOnline: {
    backgroundColor: Colors.success,
  },
  statusOffline: {
    backgroundColor: Colors.textSecondary,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  modelInfo: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  lastActive: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTheme.border,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  infoSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: Colors.lightTheme.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCardDark: {
    backgroundColor: Colors.darkTheme.card,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  infoContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  deleteButton: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.textLight,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
});

export default ContactDetailScreen;