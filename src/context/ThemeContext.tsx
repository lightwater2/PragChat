import React, { createContext, useContext, ReactNode } from 'react';
import { useAppSelector } from '../state/hooks';
import { lightTheme, darkTheme } from '../constants/theme';

/**
 * 테마 컨텍스트 타입
 */
type ThemeContextType = {
  theme: typeof lightTheme | typeof darkTheme;
  isDarkMode: boolean;
};

/**
 * 테마 컨텍스트 생성
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * 테마 제공자 Props
 */
type ThemeProviderProps = {
  children: ReactNode;
};

/**
 * 테마 제공자 컴포넌트
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Redux 스토어에서 테마 설정 가져오기
  const themeMode = useAppSelector((state) => state.ui.theme);
  
  // 현재 테마 결정
  const isDarkMode = themeMode === 'dark';
  const theme = isDarkMode ? darkTheme : lightTheme;
  
  return (
    <ThemeContext.Provider value={{ theme, isDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * 테마 사용 훅
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};