import React from 'react';

interface BattleButtonProps {
  onClick: () => void;
  isWaiting: boolean;
  currentLanguage: string;
}

const BattleButton: React.FC<BattleButtonProps> = ({ onClick, isWaiting, currentLanguage }) => {
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
      {currentLanguage === 'ja' ? 
        'このトイレで戦闘する' : 
        'Battle at this toilet'}
    </button>
  );
};

export default BattleButton; 