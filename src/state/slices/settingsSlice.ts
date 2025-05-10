import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  Settings, 
  SettingsState, 
  DEFAULT_SETTINGS,
  ThemeType,
  LanguageType,
  NotificationSettings,
  ChatSettings,
  DataUsageSettings
} from '../../types/settings';

/**
 * 초기 설정 상태
 */
const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
  isLoading: false,
};

/**
 * 설정 슬라이스
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    /**
     * 테마 설정
     */
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.settings.theme = action.payload;
    },
    
    /**
     * 언어 설정
     */
    setLanguage: (state, action: PayloadAction<LanguageType>) => {
      state.settings.language = action.payload;
    },
    
    /**
     * 알림 설정 업데이트
     */
    updateNotificationSettings: (state, action: PayloadAction<Partial<NotificationSettings>>) => {
      state.settings.notifications = {
        ...state.settings.notifications,
        ...action.payload,
      };
    },
    
    /**
     * 채팅 설정 업데이트
     */
    updateChatSettings: (state, action: PayloadAction<Partial<ChatSettings>>) => {
      state.settings.chat = {
        ...state.settings.chat,
        ...action.payload,
      };
    },
    
    /**
     * 데이터 사용량 설정 업데이트
     */
    updateDataUsageSettings: (state, action: PayloadAction<Partial<DataUsageSettings>>) => {
      state.settings.dataUsage = {
        ...state.settings.dataUsage,
        ...action.payload,
      };
    },
    
    /**
     * 모든 설정 업데이트
     */
    updateAllSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    
    /**
     * 설정 초기화
     */
    resetSettings: (state) => {
      state.settings = DEFAULT_SETTINGS;
    },
    
    /**
     * 로딩 상태 설정
     */
    setSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setTheme,
  setLanguage,
  updateNotificationSettings,
  updateChatSettings,
  updateDataUsageSettings,
  updateAllSettings,
  resetSettings,
  setSettingsLoading,
} = settingsSlice.actions;

export default settingsSlice.reducer;