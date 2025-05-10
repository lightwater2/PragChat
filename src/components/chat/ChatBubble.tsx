import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Message, MessageDeliveryStatus } from '../../types/chat';
import { Colors } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

/**
 * ChatBubble 컴포넌트 Props
 */
interface ChatBubbleProps {
  message: Message;
}

/**
 * 채팅 메시지 버블 컴포넌트
 */
export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const { isDarkMode } = useTheme();
  const isUser = message.role === 'user';
  
  // 날짜 포맷팅
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // 전달 상태 렌더링
  const renderDeliveryStatus = (status?: MessageDeliveryStatus) => {
    switch (status) {
      case 'sending':
        return (
          <View style={styles.deliveryStatusContainer}>
            <Text style={[styles.deliveryStatus, isDarkMode && styles.deliveryStatusDark]}>
              전송 중
            </Text>
            <Ionicons
              name="time-outline"
              size={12}
              color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
            />
          </View>
        );
      case 'sent':
        return (
          <View style={styles.deliveryStatusContainer}>
            <Text style={[styles.deliveryStatus, isDarkMode && styles.deliveryStatusDark]}>
              전송됨
            </Text>
            <Ionicons
              name="checkmark"
              size={12}
              color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
            />
          </View>
        );
      case 'delivered':
        return (
          <View style={styles.deliveryStatusContainer}>
            <Text style={[styles.deliveryStatus, isDarkMode && styles.deliveryStatusDark]}>
              전달됨
            </Text>
            <Ionicons
              name="checkmark-done"
              size={12}
              color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
            />
          </View>
        );
      case 'failed':
        return (
          <View style={styles.deliveryStatusContainer}>
            <Text style={[styles.deliveryStatus, styles.failedStatus]}>
              실패
            </Text>
            <Ionicons
              name="alert-circle"
              size={12}
              color={Colors.error}
            />
          </View>
        );
      default:
        return (
          <Text
            style={[
              styles.readStatus,
              styles.unreadStatus,
              isDarkMode && styles.unreadStatusDark,
            ]}
          >
            1
          </Text>
        );
    }
  };
  
  return (
    <View style={[
      styles.messageRow,
      isUser ? styles.userMessageRow : null
    ]}>
      {/* 사용자 메시지가 아닌 경우 프로필 이미지 표시 */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
        </View>
      )}
      
      <View style={[
        styles.bubbleContainer,
        isUser ? styles.userBubbleContainer : styles.assistantBubbleContainer
      ]}>
        {/* 메시지 버블 */}
        <View
          style={[
            styles.bubble,
            isUser ? styles.userBubble : styles.assistantBubble,
            isDarkMode && (isUser ? styles.userBubbleDark : styles.assistantBubbleDark),
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.assistantMessageText,
              isDarkMode && (isUser ? styles.userMessageTextDark : styles.assistantMessageTextDark),
              !message.content ? styles.emptyMessage : {},
            ]}
          >
            {message.content || '(빈 메시지)'}
          </Text>
        </View>
        
        {/* 타임스탬프와 읽음 확인 */}
        <View
          style={[
            styles.timestampContainer,
            isUser ? styles.userTimestampContainer : styles.assistantTimestampContainer,
          ]}
        >
          {/* 전달 상태 및 읽음 확인 (사용자 메시지만) */}
          {isUser && (
            <View style={styles.readStatusContainer}>
              {message.isRead ? (
                <View style={styles.readStatusWrapper}>
                  <Text
                    style={[
                      styles.readStatus,
                      isDarkMode && styles.readStatusDark,
                    ]}
                  >
                    읽음
                  </Text>
                  <Ionicons
                    name="checkmark-done"
                    size={12}
                    color={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
                  />
                </View>
              ) : (
                <View style={styles.readStatusWrapper}>
                  {renderDeliveryStatus(message.deliveryStatus)}
                </View>
              )}
            </View>
          )}
          
          {/* 타임스탬프 */}
          <Text
            style={[
              styles.timestamp,
              isUser ? styles.userTimestamp : styles.assistantTimestamp,
              isDarkMode && styles.timestampDark,
            ]}
          >
            {formattedTime}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageRow: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatarContainer: {
    width: 36,
    marginRight: 8,
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#A5C4E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textLight,
  },
  bubbleContainer: {
    maxWidth: '80%',
  },
  userBubbleContainer: {
    alignSelf: 'flex-end',
  },
  assistantBubbleContainer: {
    flex: 1,
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    maxWidth: '100%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FEE500', // 카카오톡 노란색
    borderTopRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.lightTheme.card,
    borderTopLeftRadius: 4,
  },
  userBubbleDark: {
    backgroundColor: '#FEE500', // 카카오톡 노란색은 다크모드에서도 유지
  },
  assistantBubbleDark: {
    backgroundColor: Colors.darkTheme.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#000000', // 카카오톡 노란 배경에는 검은색 텍스트
  },
  assistantMessageText: {
    color: Colors.textPrimary,
  },
  userMessageTextDark: {
    color: '#000000', // 카카오톡 노란 배경에는 다크모드에서도 검은색 텍스트
  },
  assistantMessageTextDark: {
    color: Colors.darkTheme.text,
  },
  emptyMessage: {
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginHorizontal: 4,
  },
  userTimestampContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  assistantTimestampContainer: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  userTimestamp: {
    textAlign: 'right',
  },
  assistantTimestamp: {
    textAlign: 'left',
  },
  timestampDark: {
    color: Colors.darkTheme.textSecondary,
  },
  readStatusContainer: {
    marginRight: 4,
  },
  readStatusWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readStatus: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginRight: 2,
  },
  readStatusDark: {
    color: Colors.darkTheme.textSecondary,
  },
  unreadStatus: {
    color: Colors.accent,
    fontWeight: 'bold',
  },
  unreadStatusDark: {
    color: Colors.accent,
  },
  deliveryStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryStatus: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginRight: 2,
  },
  deliveryStatusDark: {
    color: Colors.darkTheme.textSecondary,
  },
  failedStatus: {
    color: Colors.error,
    fontWeight: 'bold',
  },
});