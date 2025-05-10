import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { RootStackParamList } from './types';
import { MainNavigator } from './MainNavigator';
import { SplashScreen } from '../screens/SplashScreen';

// 루트 스택 네비게이터 생성
const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 앱 네비게이션 컴포넌트
 */
export const AppNavigator: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: isDarkMode ? Colors.darkTheme.surface : Colors.primary,
          },
          headerTintColor: Colors.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: isDarkMode ? Colors.darkTheme.background : Colors.lightTheme.background,
          },
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};