import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLanguage } from '../../../store/slices/languageSlice';
import type { RootState } from '../../../store/store';

interface LanguageToggleProps {
  isMatchmaking?: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ isMatchmaking = false }) => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  return (
    <button
      onClick={() => dispatch(toggleLanguage())}
      className={`fixed right-4 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-colors ${
        isMatchmaking ? 'top-16' : 'top-4'
      }`}
      aria-label={currentLanguage === 'ja' ? '言語を英語に切り替え' : 'Switch to Japanese'}
    >
      🌎
    </button>
  );
};

export default LanguageToggle;