import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState, ThemeType } from '../../types/ui';

/**
 * 초기 UI 상태
 */
const initialState: UIState = {
  theme: 'light',
  fontSize: 16,
};

/**
 * UI 슬라이스
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * 테마 변경
     */
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;
    },
    
    /**
     * 글꼴 크기 변경
     */
    setFontSize: (state, action: PayloadAction<number>) => {
      state.fontSize = action.payload;
    },
    
    /**
     * 테마 토글 (라이트 <-> 다크)
     */
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setTheme, setFontSize, toggleTheme } = uiSlice.actions;

export default uiSlice.reducer;