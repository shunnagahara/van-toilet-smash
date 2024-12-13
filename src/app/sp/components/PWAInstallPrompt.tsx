import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    
    // Check if the user has already dismissed the prompt
    const hasPromptBeenShown = localStorage.getItem('pwaPromptShown');

    if (!isStandalone && !hasPromptBeenShown) {
      const handler = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setIsVisible(true);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsVisible(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('pwaPromptShown', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">
            {currentLanguage === 'ja' 
              ? 'アプリをインストール' 
              : 'Install App'}
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            {currentLanguage === 'ja'
              ? 'ホーム画面に追加して、より快適にご利用いただけます。'
              : 'Add to home screen for a better experience.'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              {currentLanguage === 'ja' ? 'インストール' : 'Install'}
            </button>
            <button
              onClick={handleDismiss}
              className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100 transition-colors"
            >
              {currentLanguage === 'ja' ? '後で' : 'Later'}
            </button>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-500 p-1"
          aria-label="Close"
        >
          <span className="material-icons text-xl">close</span>
        </button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;