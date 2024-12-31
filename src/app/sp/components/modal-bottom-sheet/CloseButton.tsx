import React from "react";
import { COMMON } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';

interface CloseButtonProps {
  onClick: () => void;
  currentLanguage: Language;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, currentLanguage }) => {
  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
      aria-label={t(COMMON.CLOSE)}
    >
      <span className="material-icons text-gray-600 text-lg">close</span>
    </button>
  );
};

export default CloseButton;