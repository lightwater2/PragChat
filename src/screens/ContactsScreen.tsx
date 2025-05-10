import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import { selectContact } from '../state/slices/contactsSlice';
import { SwipeableItem } from '../components/common/SwipeableItem';
import { createConversation, selectConversation, updateConversationTitle, clearCurrentConversation } from '../state/slices/chatSlice';
import { store } from '../state/store';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { MainStackParamList } from '../navigation/types';
import { Contact } from '../types/contact';

/**
 * 연락처 화면 컴포넌트
 */
export const ContactsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  
  // 상태 가져오기
  const { contacts, isLoading } = useAppSelector((state) => state.contacts);
  
  /**
   * 연락처 항목 렌더링
   */
  const renderContactItem = ({ item }: { item: Contact }) => {
    // 채팅 시작 처리
    const handleChat = () => {
      handleContactPress(item.id);
    };
    
    // 연락처 편집 처리
    const handleEdit = () => {
      handleContactLongPress(item.id);
    };
    
    // 연락처 삭제 처리
    const handleDelete = () => {
      Alert.alert(
        '연락처 삭제',
        `${item.name} 연락처를 삭제하시겠습니까?`,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '삭제',
            style: 'destructive',
            onPress: () => {
              // 연락처 삭제 로직 구현 필요
              console.log(`연락처 삭제: ${item.id}`);
            },
          },
        ],
        { cancelable: true }
      );
    };
    
    // 연락처 차단 처리
    const handleBlock = () => {
      Alert.alert(
        '연락처 차단',
        `${item.name} 연락처를 차단하시겠습니까?`,
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '차단',
            style: 'destructive',
            onPress: () => {
              // 연락처 차단 로직 구현 필요
              console.log(`연락처 차단: ${item.id}`);
            },
          },
        ],
        { cancelable: true }
      );
    };
    
    // 스와이프 액션 정의 (채팅 버튼 제거: 연락처 클릭 시 이미 채팅방으로 이동함)
    const leftActions = [
      {
        text: '편집',
        icon: 'create',
        color: '#2196F3',
        onPress: handleEdit,
      },
    ];
    
    const rightActions = [
      {
        text: '차단',
        icon: 'ban',
        color: '#FF9800',
        onPress: handleBlock,
      },
      {
        text: '삭제',
        icon: 'trash',
        color: '#F44336',
        onPress: handleDelete,
      },
    ];
    
    // 연락처 항목 내용
    const contactItemContent = (
      <View
        style={[
          styles.contactItem,
          isDarkMode ? styles.contactItemDark : {},
        ]}
      >
        <View style={styles.avatarContainer}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: isDarkMode ? Colors.darkTheme.surface : Colors.lightTheme.surface },
              ]}
            >
              <Text
                style={[
                  styles.avatarPlaceholderText,
                  isDarkMode ? styles.textDark : {},
                ]}
              >
                {item.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.contactInfo}>
          <Text
            style={[
              styles.contactName,
              isDarkMode ? styles.textDark : {},
            ]}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.contactModel,
              isDarkMode ? styles.textSecondaryDark : {},
            ]}
          >
            {item.modelId.split('-').slice(0, 2).join(' ')}
          </Text>
        </View>
        
        {item.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    );
    
    return (
      <SwipeableItem
        leftActions={leftActions}
        rightActions={rightActions}
        onPress={() => handleContactPress(item.id)}
      >
        {contactItemContent}
      </SwipeableItem>
    );
  };
  
  /**
   * 연락처 선택 처리
   */
  const handleContactPress = (contactId: string) => {
    dispatch(selectContact(contactId));
    
    // 연락처 정보 가져오기
    const contact = contacts.find(c => c.id === contactId);
    
    if (!contact) return;
    
    // 현재 상태에서 대화 목록 가져오기
    const state = store.getState();
    const conversations = state.chat.conversations;
    
    // 해당 연락처와의 기존 대화 찾기 (contactId로 비교 & 메시지가 있는 대화만)
    const existingConversation = conversations.find(conv =>
      conv.contactId === contactId && conv.messages.length > 0
    );
    
    if (existingConversation) {
      // 기존 대화가 있으면 해당 대화 선택
      dispatch(selectConversation(existingConversation.id));
      
      // 해당 연락처와의 대화 화면으로 이동
      navigation.navigate('Chat', {
        conversationId: existingConversation.id,
        contactName: contact.name
      });
    } else {
      // 대화가 없거나 메시지가 없는 대화라면 새 채팅 시작
      
      // 현재 대화 상태 초기화 (이전 대화와 분리하기 위해)
      dispatch(clearCurrentConversation());
      
      // 채팅 화면으로 이동하고 거기서 첫 메시지를 보낼 때 채팅 탭에 표시됨
      navigation.navigate('Chat', {
        conversationId: 'new',
        contactName: contact.name,
        contactId: contact.id,
        modelId: contact.modelId
      });
    }
  };
  
  /**
   * 연락처 길게 누르기 처리 - 연락처 상세 화면으로 이동
   */
  const handleContactLongPress = (contactId: string) => {
    dispatch(selectContact(contactId));
    navigation.navigate('ContactDetail', { contactId });
  };
  
  /**
   * 연락처 추가 처리
   */
  const handleAddContact = () => {
    navigation.navigate('ContactCreation');
  };
  
  // 헤더 오른쪽 버튼 설정은 MainNavigator에서 처리하므로 제거
  
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
    >
      {/* 카카오톡 스타일 상단 프로필 영역 */}
      <TouchableOpacity
        style={[styles.profileHeader, isDarkMode ? styles.profileHeaderDark : {}]}
        onPress={() => navigation.navigate('Profile')}
      >
        <View style={styles.profileInfo}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>나</Text>
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={[styles.profileName, isDarkMode ? styles.textDark : {}]}>
              내 프로필
            </Text>
            <Text style={[styles.profileSubtext, isDarkMode ? styles.textSecondaryDark : {}]}>
              프로필 보기
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
            style={styles.profileArrow}
          />
        </View>
      </TouchableOpacity>
      {contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={64}
            color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
          />
          <Text
            style={[
              styles.emptyText,
              isDarkMode ? styles.textSecondaryDark : {},
            ]}
          >
            연락처가 없습니다.
          </Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: Colors.primary },
            ]}
            onPress={handleAddContact}
          >
            <Text style={styles.addButtonText}>연락처 추가</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {contacts.length > 0 && (
        <TouchableOpacity
          style={[
            styles.fab,
            { backgroundColor: Colors.primary },
          ]}
          onPress={handleAddContact}
        >
          <Ionicons name="person-add" size={24} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightTheme.border,
    backgroundColor: Colors.lightTheme.card,
  },
  profileHeaderDark: {
    borderBottomColor: Colors.darkTheme.border,
    backgroundColor: Colors.darkTheme.card,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  profileTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  profileSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  profileArrow: {
    marginLeft: 8,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileAvatarText: {
    color: Colors.textLight,
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.lightTheme.background,
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.background,
  },
  listContent: {
    paddingHorizontal: 0, // 스와이프 액션을 위해 가로 패딩 제거
    paddingTop: 0,
    paddingBottom: 80, // FAB 버튼을 위한 여백
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12, // 여백 유지하되 명확히 지정
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.lightTheme.border,
    backgroundColor: Colors.lightTheme.background,
    // 스와이프 액션과 일관된 높이 유지
    marginHorizontal: 0,
    marginBottom: 0,
  },
  contactItemDark: {
    backgroundColor: Colors.darkTheme.card,
    borderBottomColor: Colors.darkTheme.border,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightTheme.surface,
  },
  avatarPlaceholderText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: Colors.lightTheme.background,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  contactModel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
  textSecondaryDark: {
    color: Colors.darkTheme.textSecondary,
  },
});