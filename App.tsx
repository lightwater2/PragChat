import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store } from './src/state/store';
import { useAppDispatch } from './src/state/hooks';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { logEnvDebugInfo } from './src/utils/env';
import { initializeSampleData } from './src/utils/sampleData';

/**
 * 앱 내부 컴포넌트
 * ThemeProvider 내부에서 테마 정보를 사용하기 위한 컴포넌트
 */
const AppContent: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  
  // 앱 시작 시 환경 변수 디버그 정보 출력 및 샘플 데이터 초기화
  useEffect(() => {
    logEnvDebugInfo();
    
    // 연락처 목록이 비어있는지 확인 후 샘플 데이터 초기화
    const state = store.getState();
    if (state.contacts.contacts.length === 0) {
      initializeSampleData(dispatch);
    }
  }, [dispatch]);
  
  return (
    <>
      <AppNavigator />
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
};

/**
 * 앱 메인 컴포넌트
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <ThemeProvider>
            <PaperProvider>
              <AppContent />
            </PaperProvider>
          </ThemeProvider>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}