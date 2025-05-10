import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { RootStackParamList } from '../navigation/types';
import { SplashIcon } from '../components/common/SplashIcon';

/**
 * 스플래시 화면 컴포넌트
 */
export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDarkMode } = useTheme();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // 페이드 인 애니메이션
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // 2초 후 메인 화면으로 이동
    const timer = setTimeout(() => {
      navigation.replace('Main', {});
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [navigation, fadeAnim]);
  
  return (
    <View
      style={[
        styles.container,
        isDarkMode ? styles.containerDark : {},
      ]}
    >
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <SplashIcon size={120} color={Colors.primary} />
        <Text
          style={[
            styles.title,
            isDarkMode ? styles.titleDark : {},
          ]}
        >
          PragChat
        </Text>
        <Text
          style={[
            styles.subtitle,
            isDarkMode ? styles.subtitleDark : {},
          ]}
        >
          대화형 AI 어시스턴트
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightTheme.background,
  },
  containerDark: {
    backgroundColor: Colors.darkTheme.background,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
    marginTop: 24,
    marginBottom: 8,
  },
  titleDark: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
  subtitleDark: {
    color: Colors.darkTheme.textSecondary,
  },
});