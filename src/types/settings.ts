/**
 * 설정 관련 타입 정의
 */

/**
 * 앱 테마 타입
 */
export type ThemeType = 'light' | 'dark' | 'system';

/**
 * 앱 언어 타입
 */
export type LanguageType = 'ko' | 'en';

/**
 * 알림 설정 타입
 */
export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  vibration: boolean;
}

/**
 * 채팅 설정 타입
 */
export interface ChatSettings {
  fontSize: number;
  defaultBackground?: string;
  backgroundBlur?: boolean;
  backgroundOpacity?: number;
}

/**
 * 데이터 사용량 설정 타입
 */
export interface DataUsageSettings {
  saveImages: boolean;
  autoDownload: boolean;
}

/**
 * 앱 설정 타입
 */
export interface Settings {
  theme: ThemeType;
  language: LanguageType;
  notifications: NotificationSettings;
  chat: ChatSettings;
  dataUsage: DataUsageSettings;
}

/**
 * 설정 상태 타입
 */
export interface SettingsState {
  settings: Settings;
  isLoading: boolean;
}

/**
 * 기본 설정 값
 */
export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  language: 'ko',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
  },
  chat: {
    fontSize: 16,
    defaultBackground: undefined,
    backgroundBlur: false,
    backgroundOpacity: 0.5,
  },
  dataUsage: {
    saveImages: true,
    autoDownload: true,
  },
};