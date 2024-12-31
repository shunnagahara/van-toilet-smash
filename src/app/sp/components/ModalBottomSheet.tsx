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
import { COMMON, TOILET, MAP } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';
import MatchingNotificationBar from './modal-bottom-sheet/MatchingNotificationBar';
import CloseButton from './modal-bottom-sheet/CloseButton';
import BattleButton from './modal-bottom-sheet/BattleButton';
import PowerRating from './modal-bottom-sheet/PowerRating';
import ToiletLevels from './modal-bottom-sheet/ToiletLevels';
import LocationAddress from './modal-bottom-sheet/LocationAddress';
import ImageModal from './modal-bottom-sheet/ImageModal';
import ToiletFighterImage from './modal-bottom-sheet/ToiletFighterImage';

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
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage) as Language;
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const router = useRouter();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  useEffect(() => {
    let channel: RealtimeChannel;
  
    const checkForMatchWrapper = async () => {
      const { data: matching, error } = await checkForMatch(userId);
  
      if (error) {
        setMatchState(prev => ({ 
          ...prev, 
          error: error instanceof Error ? error.message : t(COMMON.ERROR_GENERAL)
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
    if (matchState.isWaiting) {
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
        error: t(COMMON.ERROR_CANCEL_FAILED)
      };
      setMatchState(newState);
      onMatchStateChange?.(newState);
    }
  };

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
        error: t(COMMON.ERROR_GENERAL),
        detail: error
      };
      setMatchState(newState);
      onMatchStateChange?.(newState);
    }
  };

  return (
    <>
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
                          label={t(TOILET.STATS_ATTACK)}
                        />
                        <PowerRating
                          value={location.defensePower}
                          icon="shield"
                          label={t(TOILET.STATS_DEFENSE)}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center mt-4 w-1/3">
                        <ToiletFighterImage
                        src={location.fighterPic}
                        alt={t(TOILET.STATS_DETAILS)}
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
                      <span>{t(TOILET.STATS_DETAILS)}</span>
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
              {t(MAP.SELECT_MARKER)}
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