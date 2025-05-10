/**
 * 테마 타입
 */
export type ThemeType = 'light' | 'dark';

/**
 * UI 상태 타입
 */
export interface UIState {
  theme: ThemeType;
  fontSize: number;
}