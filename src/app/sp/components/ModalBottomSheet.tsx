import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Location } from "@/types/location";
import type { MatchState } from "@/types/waitlist";
import type { MatchingEntry } from "@/types/matching";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import ImageCarousel from "./ImageCarousel";
import { addToWaitlist } from "@/repository/supabase/waitlist";
import { checkForMatch, subscribeToMatching, cancelMatching } from "@/repository/supabase/matching";

interface ModalBottomSheetProps {
  isOpen: boolean;
  toggleSheet: () => void;
  location?: Location;
  onMatchStateChange?: (state: MatchState) => void;
}

type SheetState = "A" | "B" | "C";

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({ isOpen, toggleSheet, location, onMatchStateChange }) => {
  const [sheetState, setSheetState] = useState<SheetState>("A");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [matchState, setMatchState] = useState<MatchState>({
    isWaiting: false,
    error: undefined,
  });
  const [userId, setUserId] = useState<string>("");
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let channel: RealtimeChannel;
  
    const checkForMatchWrapper = async () => {
      const { data: matching, error } = await checkForMatch(userId);
  
      if (error) {
        setMatchState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : '予期せぬエラーが発生しました'
        }));
        return;
      }
  
      if (matching) {
        handleMatchFound(matching);
      }
    };
  
    const handleMatchFound = (matching: MatchingEntry) => {
      const opponentLocationId = matching.player1_id === userId 
        ? matching.player2_location_id 
        : matching.player1_location_id;
      
      const playerLocationId = matching.player1_id === userId
        ? matching.player1_location_id
        : matching.player2_location_id;
    
      router.push(`/sp/battle?playerLocationId=${playerLocationId}&opponentLocationId=${opponentLocationId}`);
    };
  
    if (matchState.isWaiting && userId) {
      const intervalId = setInterval(checkForMatchWrapper, 1000);
      
      channel = subscribeToMatching(userId, handleMatchFound);
      
      checkForMatchWrapper();

      return () => {
        clearInterval(intervalId);
        channel?.unsubscribe();
      };
    }
  }, [matchState.isWaiting, userId, router]);

  useEffect(() => {
    // マッチング状態が変更された時の処理
    if (matchState.isWaiting) {
      // 少し遅延させてアニメーションを開始
      setTimeout(() => {
        setIsNotificationVisible(true);
      }, 100);
    } else {
      setIsNotificationVisible(false);
    }
  }, [matchState.isWaiting]);

  const handleCancelMatching = async () => {
    if (!userId) return;
  
    try {
      await cancelMatching(userId);
      const newState = { isWaiting: false };
      setMatchState(newState);
      onMatchStateChange?.(newState);
      setUserId("");
    } catch (error) {
      console.error('Error canceling match:', error);
      const newState = {
        ...matchState,
        error: currentLanguage === 'ja' ? 
          'キャンセルに失敗しました' : 
          'Failed to cancel matching'
      };
      setMatchState(newState);
      onMatchStateChange?.(newState);
    }
  };


  // タッチイベントハンドラー
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      if (sheetState === "A") setSheetState("B");
      else if (sheetState === "B") setSheetState("C");
    } else if (swipeDistance < -minSwipeDistance) {
      if (sheetState === "C") setSheetState("B");
      else if (sheetState === "B") setSheetState("A");
    }
  };

  const handleClose = () => {
    setSheetState("A");
    toggleSheet();
  };

  const handleCollapseToB = () => {
    setSheetState("B");
  };

  const handleBattleRequest = async () => {
    if (!location) return;
  
    try {
      const { error: waitlistError, userId: newUserId } = await addToWaitlist(location.id);
  
      if (waitlistError) {
        const newState = { isWaiting: false, error: waitlistError.message };
        setMatchState(newState);
        onMatchStateChange?.(newState);
        return;
      }
  
      setUserId(newUserId);
      const newState = { isWaiting: true };
      setMatchState(newState);
      onMatchStateChange?.(newState);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      const newState = { 
        isWaiting: false, 
        error: currentLanguage === 'ja' ? 
          'エラーが発生しました' : 
          'An error occurred',
        detail: error
      };
      setMatchState(newState);
      onMatchStateChange?.(newState);
    }
  };

  const getHeightClass = () => {
    switch (sheetState) {
      case "A": return "h-1/5";
      case "B": return "h-1/2";
      case "C": return "h-full";
      default: return "h-1/5";
    }
  };

  const MatchingNotification = () => {
    const message = currentLanguage === 'ja' 
      ? '対戦相手を探しています... しばらくお待ちください...' 
      : 'Looking for an opponent... Please wait for seconds';

    return (
      <div className="flex items-center overflow-hidden flex-1 mx-4">
        <div className="whitespace-nowrap animate-marquee">
          {message}
        </div>
      </div>
    );
  };

  return (
    <>
     {/* 待機中の通知バー */}
     {matchState.isWaiting && (
        <div 
            className={`fixed w-full bg-blue-500 text-white h-12 z-50 transition-transform duration-700 ease-in-out ${
              isNotificationVisible ? 'translate-y-0' : '-translate-y-full'
            }`}
          >
          <div className="h-full flex items-center relative">
            {/* キャンセルボタン - 固定位置 */}
            <button
              onClick={handleCancelMatching}
              className="h-12 w-12 flex items-center justify-center hover:bg-blue-600 transition-colors flex-shrink-0"
              aria-label={currentLanguage === 'ja' ? 'マッチングをキャンセル' : 'Cancel matching'}
            >
              <span className="material-icons">close</span>
            </button>

            {/* 横スクロールするテキスト */}
            <MatchingNotification />
          </div>
        </div>
      )}

      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transform transition-all duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${getHeightClass()} touch-none`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
          aria-label={currentLanguage === 'ja' ? '閉じる' : 'Close'}
        >
          <span className="material-icons text-gray-600 text-lg">close</span>
        </button>

        {sheetState === "C" && (
          <button
            onClick={handleCollapseToB}
            className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-10"
          >
            <span className="material-icons">arrow_downward</span>
          </button>
        )}

        <div className="p-4 h-full overflow-hidden">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-gray-300 rounded-full mb-4"></div>
          </div>
          
          {location ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">{location[currentLanguage].name}</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-gray-500">location_on</span>
                    <p className="text-gray-600">
                      {`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-gray-500">star</span>
                    <p className="text-gray-600">
                      {location.rating ? `${location.rating.toFixed(1)} / 5.0` : 'No rating'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="material-icons text-gray-500">
                      {location.isOpen ? 'check_circle' : 'cancel'}
                    </span>
                    <p className="text-gray-600">
                      {location.isOpen ? 
                        (currentLanguage === 'ja' ? '営業中' : 'Open') : 
                        (currentLanguage === 'ja' ? '営業時間外' : 'Closed')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="py-2">
                <p className="text-gray-700">{location[currentLanguage].description}</p>
              </div>

              <button
                onClick={handleBattleRequest}
                disabled={matchState.isWaiting}
                className={`w-full py-3 rounded-lg transition-colors ${
                  matchState.isWaiting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {currentLanguage === 'ja' ? 
                  'このトイレで戦闘する' : 
                  'Battle at this toilet'}
              </button>

              {matchState.error && (
                <p className="text-red-500 text-center">{matchState.error}</p>
              )}

              {location.images && location.images.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-lg font-medium mb-3">
                    {currentLanguage === 'ja' ? '施設写真' : 'Facility Photos'}
                  </h3>
                  <ImageCarousel images={location.images} />
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              {currentLanguage === 'ja' ? 
                'マーカーを選択してください' : 
                'Please select a marker'}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ModalBottomSheet;