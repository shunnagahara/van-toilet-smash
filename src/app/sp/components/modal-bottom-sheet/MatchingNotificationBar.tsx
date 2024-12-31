import React from 'react';
import { TOILET } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';

interface MatchingNotificationBarProps {
  isVisible: boolean;
  onCancel: () => void;
  currentLanguage: Language;
}

const MatchingNotificationBar: React.FC<MatchingNotificationBarProps> = ({ 
  isVisible, 
  onCancel, 
  currentLanguage 
}) => {
  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  return (
    <div 
      className={`fixed w-full bg-blue-500 text-white h-12 z-50 transition-transform duration-700 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="h-full flex items-center relative">
        <button
          onClick={onCancel}
          className="h-12 w-12 flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0"
          aria-label={t(TOILET.BATTLE_CANCEL)}
        >
          <span className="material-icons">close</span>
        </button>
        <div className="flex items-center overflow-hidden flex-1 mx-4">
          <div className="whitespace-nowrap animate-marquee">
            {t(TOILET.BATTLE_SEARCHING)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingNotificationBar;