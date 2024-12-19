import { incrementInstallCount } from "@/repository/supabase/pwa";

export const checkAndTrackInstall = async () => {
  const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone;
  
  // インストール済みかどうかのフラグをチェック
  const hasTrackedInstall = localStorage.getItem('pwaInstallTracked');

  // スタンドアローンモードで起動され、まだトラッキングされていない場合
  if (isStandalone && !hasTrackedInstall) {
    try {
      await incrementInstallCount();
      localStorage.setItem('pwaInstallTracked', 'true');
    } catch (error) {
      console.error('Failed to track PWA install:', error);
    }
  }

  return { isIOSDevice, isStandalone };
};