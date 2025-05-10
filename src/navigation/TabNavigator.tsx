import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { TabParamList } from './types';
import { ChatsScreen } from '../screens/ChatsScreen';
import { ContactsScreen } from '../screens/ContactsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { useAppSelector } from '../state/hooks';
import { RootState } from '../state/store';

// 탭 네비게이터 생성
const Tab = createBottomTabNavigator<TabParamList>();

/**
 * 탭 네비게이터 컴포넌트
 */
/**
 * 읽지 않은 메시지 수 계산을 위한 selector 함수
 */
const selectTotalUnreadCount = (state: RootState) =>
  state.chat.chatPreviews.reduce((total, preview) => total + preview.unreadCount, 0);

/**
 * 탭 네비게이터 컴포넌트
 */
export const TabNavigator: React.FC = () => {
  const { isDarkMode } = useTheme();
  const totalUnreadCount = useAppSelector(selectTotalUnreadCount);
  
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 상단 헤더는 MainNavigator에서 관리
        tabBarHideOnKeyboard: true, // 키보드가 표시될 때 탭 바 숨기기
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.darkTheme.surface : Colors.lightTheme.surface,
          borderTopColor: isDarkMode ? Colors.darkTheme.border : Colors.lightTheme.border,
          height: Platform.OS === 'ios' ? 90 : 60, // iOS에서 더 큰 높이 설정
          paddingBottom: Platform.OS === 'ios' ? 30 : 8, // iOS에서 더 큰 패딩 설정
          paddingTop: 8,
        },
        tabBarItemStyle: {
          // 탭 바 아이템 스타일 조정
          paddingBottom: Platform.OS === 'ios' ? 5 : 0,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDarkMode ? Colors.darkTheme.textSecondary : Colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="ContactsTab"
        component={ContactsScreen}
        options={{
          title: '친구',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatsTab"
        component={ChatsScreen}
        options={{
          title: '채팅',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
          tabBarBadge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: '#FF5252',
            fontSize: 12,
          },
        }}
      />
      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          title: '설정',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};