import { configureStore } from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import uiReducer from './slices/uiSlice';
import contactsReducer from './slices/contactsSlice';
import settingsReducer from './slices/settingsSlice';

/**
 * Redux 스토어 설정
 */
export const store = configureStore({
  reducer: {
    chat: chatReducer,
    ui: uiReducer,
    contacts: contactsReducer,
    settings: settingsReducer,
  },
});

// 스토어의 RootState 및 AppDispatch 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;