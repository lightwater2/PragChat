import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Keyboard, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/colors';

/**
 * MessageInput 컴포넌트 Props
 */
interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

/**
 * 메시지 입력 컴포넌트
 */
export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [inputHeight, setInputHeight] = useState(40);
  const { isDarkMode } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const recordingAnimation = useRef(new Animated.Value(1)).current;
  
  // 포커스 관리를 위한 로직 추가
  useEffect(() => {
    // 컴포넌트 마운트 후 약간의 지연을 두고 포커스 설정
    const focusTimeout = setTimeout(() => {
      if (inputRef.current && !disabled && !isRecording) {
        inputRef.current.focus();
      }
    }, 300);
    
    return () => clearTimeout(focusTimeout);
  }, [disabled, isRecording]);
  
  // 녹음 애니메이션 효과
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(recordingAnimation, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      recordingAnimation.setValue(1);
      // 애니메이션 중지
      Animated.timing(recordingAnimation, {
        toValue: 1,
        duration: 0,
        useNativeDriver: true,
      }).stop();
    }
  }, [isRecording, recordingAnimation]);
  
  /**
   * 메시지 전송 처리
   */
  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
      setInputHeight(40); // 입력 필드 높이 초기화
      
      // 키보드 닫기 (옵션)
      // Keyboard.dismiss();
    }
  };
  
  /**
   * 음성 입력 토글
   */
  const toggleVoiceRecording = () => {
    setIsRecording(!isRecording);
    
    // 실제 음성 녹음 기능은 향후 구현
    if (!isRecording) {
      // 녹음 시작 로직
      console.log('음성 녹음 시작');
    } else {
      // 녹음 종료 및 처리 로직
      console.log('음성 녹음 종료');
    }
  };
  
  /**
   * 입력 필드 높이 조절
   */
  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    const newHeight = Math.min(Math.max(40, height), 120);
    setInputHeight(newHeight);
  };
  
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
        Platform.OS === 'ios' && { paddingBottom: 6 } // iOS에서 추가 패딩
      ]}
    >
      {/* 음성 입력 버튼 */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          isRecording ? styles.recordingButton : {},
        ]}
        onPress={toggleVoiceRecording}
      >
        <Animated.View
          style={{
            transform: [{ scale: isRecording ? recordingAnimation : 1 }],
          }}
        >
          <Ionicons
            name={isRecording ? "mic" : "mic-outline"}
            size={28}
            color={isRecording
              ? Colors.accent
              : isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>
      
      {/* 이모티콘 버튼 */}
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => {/* 향후 구현 */}}
        disabled={isRecording}
      >
        <Ionicons
          name="happy-outline"
          size={28}
          color={isRecording
            ? (isDarkMode ? '#666666' : '#BDBDBD')
            : (isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary)}
        />
      </TouchableOpacity>
      
      {/* 메시지 입력 필드 */}
      <TextInput
        ref={inputRef}
        style={[
          styles.input,
          isDarkMode ? styles.inputDark : {},
          { height: inputHeight },
        ]}
        value={message}
        onChangeText={setMessage}
        placeholder={isRecording ? "음성을 녹음 중입니다..." : "메시지를 입력하세요..."}
        placeholderTextColor={isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary}
        multiline
        maxLength={1000}
        editable={!disabled && !isRecording}
        onSubmitEditing={handleSend}
        autoCapitalize="none"
        autoCorrect={false}
        blurOnSubmit={false}
        onContentSizeChange={handleContentSizeChange}
        keyboardType="default"
        returnKeyType="default"
        enablesReturnKeyAutomatically={true}
        keyboardAppearance={isDarkMode ? "dark" : "light"}
      />
      
      {/* 전송 버튼 */}
      <TouchableOpacity
        style={[
          styles.sendButton,
          (!message.trim() || disabled || isRecording) ? styles.sendButtonDisabled : {},
        ]}
        onPress={handleSend}
        disabled={!message.trim() || disabled || isRecording}
      >
        <Ionicons
          name="arrow-up"
          size={24}
          color={(!message.trim() || disabled || isRecording) ? Colors.textSecondary : Colors.textLight}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightTheme.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.lightTheme.border,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // iOS에서 세로 패딩 증가
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.surface,
    borderTopColor: Colors.darkTheme.border,
  },
  actionButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
    borderRadius: 20,
  },
  recordingButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: Colors.lightTheme.background,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.lightTheme.border,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  inputDark: {
    backgroundColor: Colors.darkTheme.background,
    borderColor: Colors.darkTheme.border,
    color: Colors.darkTheme.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
});
