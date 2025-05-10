import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/colors';

/**
 * TypingIndicator 컴포넌트 Props
 */
interface TypingIndicatorProps {
  isVisible: boolean;
}

/**
 * AI가 타이핑 중임을 나타내는 인디케이터 컴포넌트
 */
export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible }) => {
  const { isDarkMode } = useTheme();
  const [dots, setDots] = useState('');
  
  // 애니메이션 값
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  // 점 애니메이션 효과
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setDots((prev) => {
          if (prev.length >= 3) return '';
          return prev + '.';
        });
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);
  
  // 페이드 인/아웃 애니메이션
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);
  
  if (!isVisible) return null;
  
  return (
    <Animated.View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
        { opacity: fadeAnim },
      ]}
    >
      <Text style={[styles.text, isDarkMode ? styles.textDark : {}]}>
        AI가 응답 중입니다{dots}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.assistantBubble,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 8,
    maxWidth: '60%',
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.surface,
  },
  text: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  textDark: {
    color: Colors.darkTheme.text,
  },
});