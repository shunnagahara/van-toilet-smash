import React from 'react';
import type { Language } from '@/constants/i18n';
import { TOILET } from '@/constants/i18n';

interface BattleButtonProps {
  onClick: () => void;
  isWaiting: boolean;
  currentLanguage: Language;
}

const BattleButton: React.FC<BattleButtonProps> = ({ onClick, isWaiting, currentLanguage }) => {
  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  return (
    <button
      onClick={onClick}
      disabled={isWaiting}
      className={`w-full py-3 rounded-lg transition-colors ${
        isWaiting
          ? 'bg-gray-300 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600 text-white'
      }`}
    >
      {t(TOILET.BATTLE_BUTTON)}
    </button>
  );
};

export default BattleButton;