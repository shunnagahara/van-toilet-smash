import React from "react";

interface CloseButtonProps {
  onClick: () => void;
  currentLanguage: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick, currentLanguage }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
      aria-label={currentLanguage === 'ja' ? '閉じる' : 'Close'}
    >
      <span className="material-icons text-gray-600 text-lg">close</span>
    </button>
  );
};

export default CloseButton; 