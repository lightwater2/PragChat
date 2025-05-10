import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

/**
 * 스플래시 아이콘 컴포넌트 Props
 */
interface SplashIconProps {
  size?: number;
  color?: string;
}

/**
 * 스플래시 아이콘 컴포넌트
 * 앱 로고로 사용할 수 있는 간단한 아이콘
 */
export const SplashIcon: React.FC<SplashIconProps> = ({
  size = 120,
  color = Colors.primary,
}) => {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.circle, { width: size, height: size, borderColor: color }]}>
        <Ionicons name="chatbubbles" size={size * 0.5} color={color} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderRadius: 60,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});