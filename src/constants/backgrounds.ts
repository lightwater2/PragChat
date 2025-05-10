/**
 * 채팅 배경 색상 상수
 */
export const CHAT_BACKGROUND_COLORS = {
  DEFAULT: '#f5f5f5',
  GRADIENT_BLUE: '#e6f2ff',
  GRADIENT_PURPLE: '#f0e6ff',
  PATTERN_LIGHT: '#f9f9f9',
  PATTERN_DARK: '#2c2c2c',
  SOLID_LIGHT: '#ffffff',
  SOLID_DARK: '#121212',
};

/**
 * 배경 정보
 */
export interface BackgroundInfo {
  id: string;
  name: string;
  color: string;
  isDark: boolean;
}

/**
 * 배경 목록
 */
export const BACKGROUND_LIST: BackgroundInfo[] = [
  {
    id: 'default',
    name: '기본',
    color: CHAT_BACKGROUND_COLORS.DEFAULT,
    isDark: false,
  },
  {
    id: 'gradient_blue',
    name: '블루 그라데이션',
    color: CHAT_BACKGROUND_COLORS.GRADIENT_BLUE,
    isDark: false,
  },
  {
    id: 'gradient_purple',
    name: '퍼플 그라데이션',
    color: CHAT_BACKGROUND_COLORS.GRADIENT_PURPLE,
    isDark: true,
  },
  {
    id: 'pattern_light',
    name: '라이트 패턴',
    color: CHAT_BACKGROUND_COLORS.PATTERN_LIGHT,
    isDark: false,
  },
  {
    id: 'pattern_dark',
    name: '다크 패턴',
    color: CHAT_BACKGROUND_COLORS.PATTERN_DARK,
    isDark: true,
  },
  {
    id: 'solid_light',
    name: '라이트 솔리드',
    color: CHAT_BACKGROUND_COLORS.SOLID_LIGHT,
    isDark: false,
  },
  {
    id: 'solid_dark',
    name: '다크 솔리드',
    color: CHAT_BACKGROUND_COLORS.SOLID_DARK,
    isDark: true,
  },
];

/**
 * 배경 ID로 배경 정보 가져오기
 */
export const getBackgroundById = (id: string): BackgroundInfo | undefined => {
  return BACKGROUND_LIST.find((bg) => bg.id === id);
};

/**
 * 기본 배경 가져오기
 */
export const getDefaultBackground = (): BackgroundInfo => {
  return BACKGROUND_LIST[0];
};