import React from 'react';

interface MatchingNotificationBarProps {
  isVisible: boolean;
  onCancel: () => void;
  currentLanguage: string;
}

const MatchingNotificationBar: React.FC<MatchingNotificationBarProps> = ({ isVisible, onCancel, currentLanguage }) => {
  const message = currentLanguage === 'ja' 
    ? '対戦相手を探しています... しばらくお待ちください...' 
    : 'Looking for an opponent... Please wait for seconds';

  return (
    <div 
      className={`fixed w-full bg-blue-500 text-white h-12 z-50 transition-transform duration-700 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } top-[env(safe-area-inset-top)]`}
    >
      <div className="h-full flex items-center relative">
        <button
          onClick={onCancel}
          className="h-12 w-12 flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0"
          aria-label={currentLanguage === 'ja' ? 'マッチングをキャンセル' : 'Cancel matching'}
        >
          <span className="material-icons">close</span>
        </button>
        <div className="flex items-center overflow-hidden flex-1 mx-4">
          <div className="whitespace-nowrap animate-marquee">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingNotificationBar; 