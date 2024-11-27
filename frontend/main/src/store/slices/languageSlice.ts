import { createSlice } from '@reduxjs/toolkit';

type Language = 'ja' | 'en';

interface LanguageState {
  currentLanguage: Language;
}

const initialState: LanguageState = {
  currentLanguage: 'ja',
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.currentLanguage = state.currentLanguage === 'ja' ? 'en' : 'ja';
    },
  },
});

export const { toggleLanguage } = languageSlice.actions;
export default languageSlice.reducer;