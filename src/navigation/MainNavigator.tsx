import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/colors';
import { MainStackParamList } from './types';
import { TabNavigator } from './TabNavigator';
import { ChatScreen } from '../screens/ChatScreen';
import { ModelSelectionScreen } from '../screens/ModelSelectionScreen';
import { ContactCreationScreen } from '../screens/ContactCreationScreen';
import { ContactDetailScreen } from '../screens/ContactDetailScreen';
import { ContactEditScreen } from '../screens/ContactEditScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsDetailScreen } from '../screens/SettingsDetailScreen';
import { useAppSelector } from '../state/hooks';

// 스택 네비게이터 생성
const Stack = createNativeStackNavigator<MainStackParamList>();

/**
 * 헤더 오른쪽 아이콘 컴포넌트
 */
const HeaderRight: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ModelSelection')}
        style={{ marginRight: 16 }}
      >
        <Ionicons name="search-outline" size={24} color={Colors.textLight} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ContactCreation')}
        style={{ marginRight: 16 }}
      >
        <Ionicons name="person-add-outline" size={24} color={Colors.textLight} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('SettingsDetail', { screen: '설정' })}
      >
        <Ionicons name="settings-outline" size={24} color={Colors.textLight} />
      </TouchableOpacity>
    </View>
  );
};

/**
 * 메인 스택 네비게이터 컴포넌트
 */
export const MainNavigator: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { selectedModelId } = useAppSelector((state) => state.chat);
  
  return (
    <Stack.Navigator
      initialRouteName="TabNavigator"
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
        name="TabNavigator"
        component={TabNavigator}
        options={{
          title: 'PragChat',
          headerRight: () => <HeaderRight />,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({ route }) => ({
          title: route.params.contactName || '대화',
          headerBackTitle: '뒤로',
          headerRight: () => (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={{ marginRight: 16 }}>
                <Ionicons name="search-outline" size={22} color={Colors.textLight} />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={22} color={Colors.textLight} />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
      <Stack.Screen
        name="ContactCreation"
        component={ContactCreationScreen}
        options={{
          title: '연락처 추가',
          headerBackTitle: '뒤로',
        }}
      />
      <Stack.Screen
        name="ContactDetail"
        component={ContactDetailScreen}
        options={{
          title: '연락처 정보',
          headerBackTitle: '뒤로',
        }}
      />
      <Stack.Screen
        name="ContactEdit"
        component={ContactEditScreen}
        options={{
          title: '연락처 편집',
          headerBackTitle: '뒤로',
        }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '내 프로필',
          headerBackTitle: '뒤로',
        }}
      />
      <Stack.Screen
        name="SettingsDetail"
        component={SettingsDetailScreen}
        options={({ route }) => ({
          title: route.params.screen || '설정',
          headerBackTitle: '뒤로',
        })}
      />
      <Stack.Screen
        name="ModelSelection"
        component={ModelSelectionScreen}
        options={{
          title: '모델 선택',
          headerBackTitle: '뒤로',
          headerRight: () => (
            <Text style={{ color: Colors.textLight, fontSize: 14 }}>
              현재: {selectedModelId.split('-').slice(0, 2).join(' ')}
            </Text>
          ),
        }}
      />
    </Stack.Navigator>
  );
};