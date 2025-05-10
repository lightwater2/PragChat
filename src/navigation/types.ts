import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

/**
 * 메인 스택 네비게이션 파라미터 타입
 */
export type MainStackParamList = {
  TabNavigator: undefined;
  Chat: {
    conversationId: string;
    contactName?: string;
    contactId?: string;
    modelId?: string;
  };
  ContactCreation: undefined;
  ContactDetail: { contactId: string };
  ContactEdit: { contactId: string };
  Profile: undefined;
  SettingsDetail: { screen: string };
  ModelSelection: undefined;
};

/**
 * 탭 네비게이션 파라미터 타입
 */
export type TabParamList = {
  ContactsTab: undefined;
  ChatsTab: undefined;
  SettingsTab: undefined;
};

/**
 * 루트 스택 네비게이션 파라미터 타입
 */
export type RootStackParamList = {
  Splash: undefined;
  Main: {
    screen?: string;
    params?: any;
  };
};

/**
 * 드로어 네비게이션 파라미터 타입
 */
// 더 이상 사용하지 않음
export type DrawerParamList = {
  MainContent: undefined;
};

/**
 * 메인 스택 네비게이션 Props 타입
 */
export type MainNavigationProps<T extends keyof MainStackParamList> = {
  navigation: NativeStackNavigationProp<MainStackParamList, T>;
  route: RouteProp<MainStackParamList, T>;
};

/**
 * 탭 네비게이션 Props 타입
 */
export type TabNavigationProps<T extends keyof TabParamList> = {
  navigation: BottomTabNavigationProp<TabParamList, T>;
  route: RouteProp<TabParamList, T>;
};