import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { incrementInstallCount } from '@/repository/supabase/pwa';

interface IOSInstructionStep {
  text: string;
  icon: string;
}

const PWAInstallPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    const initializePWA = async () => {
      // デバイスとモード判定のログ
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      console.log('Device Detection:', {
        userAgent: navigator.userAgent,
        isIOSDevice,
        standalone: (window.navigator as any).standalone,
        matchMedia: window.matchMedia('(display-mode: standalone)').matches
      });

      setIsIOS(isIOSDevice);
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone;

      console.log('PWA State:', {
        isStandalone,
        hasPromptBeenShown: localStorage.getItem('pwaPromptShown'),
        hasInstallTracked: localStorage.getItem('pwaInstallTracked')
      });

      const hasPromptBeenShown = localStorage.getItem('pwaPromptShown');

      if (!isStandalone && !hasPromptBeenShown) {
        console.log('Showing install prompt');
        if (isIOSDevice) {
          setIsVisible(true);
        } else {
          const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setIsVisible(true);
          };

          window.addEventListener('beforeinstallprompt', handler);
          return () => window.removeEventListener('beforeinstallprompt', handler);
        }
      }
    };

    initializePWA().catch(error => {
      console.error('Error initializing PWA:', error);
    });

    // インストール完了イベントのリスナー（主にAndroid用）
    const handleAppInstalled = async () => {
      console.log('App installed event triggered');
      try {
        await incrementInstallCount();
        localStorage.setItem('pwaInstallTracked', 'true');
        console.log('Install counted successfully');
      } catch (error) {
        console.error('Failed to track PWA install:', error);
      }
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 表示モードの変更監視
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = async (e: MediaQueryListEvent) => {
      console.log('Display mode changed:', {
        matches: e.matches,
        mediaQuery: mediaQuery.matches,
        standalone: (window.navigator as any).standalone
      });

      if (e.matches && !localStorage.getItem('pwaInstallTracked')) {
        try {
          await incrementInstallCount();
          localStorage.setItem('pwaInstallTracked', 'true');
          console.log('Install counted on display mode change');
        } catch (error) {
          console.error('Failed to track PWA install on display mode change:', error);
        }
      }
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  const getIOSInstructions = (): IOSInstructionStep[] => {
    return currentLanguage === 'ja' 
      ? [
          { text: 'ブラウザのメニューボタン（共有ボタン）をタップ', icon: 'ios_share' },
          { text: '下にスクロールして「ホーム画面に追加」をタップ', icon: 'add_to_home_screen' },
          { text: '右上の「追加」をタップ', icon: 'add' }
        ]
      : [
          { text: 'Tap the browser menu (share) button', icon: 'ios_share' },
          { text: 'Scroll down and tap "Add to Home Screen"', icon: 'add_to_home_screen' },
          { text: 'Tap "Add" in the top right', icon: 'add' }
        ];
  };

  const handleInstall = async () => {
    console.log('Install button clicked:', { isIOS, deferredPrompt: !!deferredPrompt });
    
    if (isIOS) {
      setShowIOSInstructions(true);
      localStorage.setItem('pwaPromptShown', 'true');
      console.log('Showing iOS instructions');
      
      // iOSの場合、ここでインストールのトラッキングを試みる
      try {
        await incrementInstallCount();
        localStorage.setItem('pwaInstallTracked', 'true');
        console.log('iOS install tracking successful');
      } catch (error) {
        console.error('Failed to track iOS install:', error);
      }
    } else if (deferredPrompt) {
      try {
        console.log('Prompting for install...');
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('Install prompt outcome:', outcome);
        
        if (outcome === 'accepted') {
          setIsVisible(false);
          localStorage.setItem('pwaPromptShown', 'true');
          console.log('Install accepted');
        }
      } catch (error) {
        console.error('Installation error:', error);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = async () => {
    console.log('Dismissing prompt:', { showIOSInstructions, isIOS });
    
    if (isIOS && showIOSInstructions) {
      try {
        await incrementInstallCount();
        console.log('iOS install tracking on dismiss successful');
      } catch (error) {
        console.error('Failed to track PWA install on dismiss:', error);
      }
    }
    
    setIsVisible(false);
    setShowIOSInstructions(false);
    localStorage.setItem('pwaPromptShown', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-fade-in">
      <div className="flex items-start">
        <div className="flex-1">
          {showIOSInstructions ? (
            <>
              <h3 className="font-semibold text-lg mb-4">
                {currentLanguage === 'ja' 
                  ? 'インストール手順' 
                  : 'Installation Steps'}
              </h3>
              <ol className="space-y-4 mb-4">
                {getIOSInstructions().map((step, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <span className="material-icons text-blue-500">{step.icon}</span>
                    <span className="text-gray-700">{step.text}</span>
                  </li>
                ))}
              </ol>
              <button
                onClick={handleDismiss}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition-colors w-full"
              >
                {currentLanguage === 'ja' ? '了解' : 'Got it'}
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
        {!showIOSInstructions && (
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-500 p-1"
            aria-label="Close"
          >
            <span className="material-icons text-xl">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PWAInstallPrompt;