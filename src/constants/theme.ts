import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Colors } from './colors';

/**
 * 라이트 테마 설정
 */
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.lightTheme.background,
    surface: Colors.lightTheme.surface,
    text: Colors.lightTheme.text,
    error: Colors.error,
  },
};

/**
 * 다크 테마 설정
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.primary,
    secondary: Colors.secondary,
    background: Colors.darkTheme.background,
    surface: Colors.darkTheme.surface,
    text: Colors.darkTheme.text,
    error: Colors.error,
  },
};