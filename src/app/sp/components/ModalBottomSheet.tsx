import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { Location } from "@/types/location";
import type { MatchState } from "@/types/waitlist";
import type { MatchingEntry } from "@/types/matching";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { addToWaitlist } from "@/repository/supabase/waitlist";
import { checkForMatch, subscribeToMatching, cancelMatching } from "@/repository/supabase/matching";
import MatchingNotificationBar from './MatchingNotificationBar';
import CloseButton from './CloseButton';
import BattleButton from './BattleButton';
import PowerRating from './PowerRating';
import ToiletLevels from './ToiletLevels';
import Image from 'next/image';
import LocationAddress from './LocationAddress';
import ImageModal from './ImageModal';

interface ModalBottomSheetProps {
  isOpen: boolean;
  toggleSheet: () => void;
  location?: Location;
  onMatchStateChange?: (state: MatchState) => void;
}

type SheetState = "A" | "B";

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

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

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
    
      router.push(`/sp/battle?playerLocationId=${playerLocationId}&opponentLocationId=${opponentLocationId}&userId=${userId}`);
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
    } else if (swipeDistance < -minSwipeDistance) {
      if (sheetState === "B") setSheetState("A");
    }
  };

  const handleClose = () => {
    setSheetState('A');
    toggleSheet();
  };

  const getHeightClass = () => {
    switch (sheetState) {
      case "A": return "h-1/3";
      case "B": return "h-full";
      default: return "h-1/3";
    }
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

  return (
    <>
      {/* 待機中の通知バー */}
      <MatchingNotificationBar 
        isVisible={matchState.isWaiting && isNotificationVisible}
        onCancel={handleCancelMatching}
        currentLanguage={currentLanguage}
      />

      <div
        className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transform transition-all duration-300 ${
          isOpen ? "translate-y-0" : "translate-y-full"
        } ${getHeightClass()} touch-none`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        <CloseButton onClick={handleClose} currentLanguage={currentLanguage} />

        <div className="p-4 h-full overflow-hidden">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-gray-300 rounded-full mb-4"></div>
          </div>
          
          {location ? (
            <div className="space-y-5">
              <div>
                <div className="space-y-3">
                  <div className="flex">
                    <div className="flex flex-col w-2/3">
                      <h2 className="text-lg text-black font-semibold mb-4">{location[currentLanguage].name}</h2>
                      <div className="flex-1 space-y-3">
                        <PowerRating
                          value={location.attackPower}
                          icon="local_fire_department"
                          label={currentLanguage === 'ja' ? '攻撃力' : 'Attack'}
                        />
                        <PowerRating
                          value={location.defensePower}
                          icon="shield"
                          label={currentLanguage === 'ja' ? '防御力' : 'Defense'}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center mt-4 w-1/3">
                      <Image
                        src={location.fighterPic}
                        alt={currentLanguage === 'ja' ? 'トイレファイター' : 'Toilet Fighter'}
                        width={70}
                        height={70}
                        className={`rounded-full object-cover ${
                          location.images?.length 
                            ? 'cursor-pointer hover:opacity-80 transition-opacity rainbow-border' 
                            : 'cursor-default'
                        }`}
                        onClick={() => location.images?.length && setIsImageModalOpen(true)}
                      />
                    </div>
                  </div>

                  <ToiletLevels
                    cleanlinessLevel={location.cleanlinessLevel}
                    locationLevel={location.locationLevel}
                    crowdingLevel={location.crowdingLevel}
                    toiletCountLevel={location.toiletCountLevel}
                    uniquenessLevel={location.uniquenessLevel}
                    currentLanguage={currentLanguage}
                  />

                  <div className="relative">
                    <button 
                      onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                      className="w-full flex items-center justify-between py-2 text-gray-600"
                    >
                      <span>{currentLanguage === 'ja' ? '詳細情報' : 'Details'}</span>
                      <span className="material-icons">
                        {isDetailsOpen ? 'expand_less' : 'expand_more'}
                      </span>
                    </button>
                    
                    {isDetailsOpen && (
                      <div className="space-y-3">
                        <LocationAddress address={location[currentLanguage].address} />


                        <div className="py-2">
                          <p className="text-gray-700 text-sm">{location[currentLanguage].description}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <BattleButton
                onClick={handleBattleRequest}
                isWaiting={matchState.isWaiting}
                currentLanguage={currentLanguage}
              />

              {matchState.error && (
                <p className="text-red-500 text-center">{matchState.error}</p>
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
      {location && location.images && (
          <ImageModal
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            images={location.images}
          currentLanguage={currentLanguage}
        />
      )}
    </>
  );
};

export default ModalBottomSheet;