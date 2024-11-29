import React, { useState, useEffect } from "react";
import type { Location } from "@/types/location";
import type { MatchState } from "@/types/waitlist";
import type { MatchingState } from "@/types/matching";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import ImageCarousel from "./ImageCarousel";
import { addToWaitlist } from "@/repository/supabase/waitlist";
import { checkForMatch, subscribeToMatching } from "@/repository/supabase/matching";
import { VANCOUVER_LOCATIONS } from "@/constants/location";

interface ModalBottomSheetProps {
  isOpen: boolean;
  toggleSheet: () => void;
  location?: Location;
}

type SheetState = "A" | "B" | "C";

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({ isOpen, toggleSheet, location }) => {
  const [sheetState, setSheetState] = useState<SheetState>("A");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [matchState, setMatchState] = useState<MatchState>({
    isWaiting: false,
    error: undefined,
  });
  // 新しいstate
  const [matchingState, setMatchingState] = useState<MatchingState>({
    isMatched: false,
  });
  const [userId, setUserId] = useState<string>("");
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let channel: any;
  
    const checkForMatchWrapper = async () => {
      console.log('Checking for match - userId:', userId);
      const { data: matching, error } = await checkForMatch(userId);
      console.log('Check result - matching:', matching, 'error:', error);
  
      if (error) {
        console.error('Matching check error:', error);
        setMatchState(prev => ({ ...prev, error: error.message }));
        return;
      }
  
      if (matching) {
        handleMatchFound(matching);
      }
    };
  
    const handleMatchFound = (matching: MatchingEntry) => {
      console.log('Match found!', matching);
      const opponentLocationId = matching.player1_id === userId 
        ? matching.player2_location_id 
        : matching.player1_location_id;
      
      const opponentLocation = VANCOUVER_LOCATIONS.find(
        loc => loc.id === opponentLocationId
      );
      console.log('Opponent location:', opponentLocation);
  
      setMatchingState({
        isMatched: true,
        matchingData: matching,
        opponentLocation,
      });
      setMatchState(prev => ({ ...prev, isWaiting: false }));
    };
  
    if (matchState.isWaiting && userId) {
      console.log('Starting match checking for user:', userId);
      intervalId = setInterval(checkForMatchWrapper, 1000);
  
      // リアルタイム購読のセットアップ
      channel = subscribeToMatching(userId, (matching: MatchingEntry) => {
        console.log('Realtime match notification received:', matching);
        handleMatchFound(matching);
      });
  
      // マッチング状態の初期チェック
      checkForMatchWrapper();
    }
  
    return () => {
      if (intervalId) {
        console.log('Clearing interval');
        clearInterval(intervalId);
      }
      if (channel) {
        console.log('Unsubscribing from channel');
        channel.unsubscribe();
      }
    };
  }, [matchState.isWaiting, userId]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      if (sheetState === "A") {
        setSheetState("B");
      } else if (sheetState === "B") {
        setSheetState("C");
      }
    } else if (swipeDistance < -minSwipeDistance) {
      if (sheetState === "C") {
        setSheetState("B");
      } else if (sheetState === "B") {
        setSheetState("A");
      }
    }
  };

  const getHeightClass = () => {
    switch (sheetState) {
      case "A":
        return "h-1/5";
      case "B":
        return "h-1/2";
      case "C":
        return "h-full";
      default:
        return "h-1/5";
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
      const { data, error, userId: newUserId } = await addToWaitlist(location.id);
      console.log('Waitlist response - data:', data, 'error:', error, 'userId:', newUserId);

      if (error) {
        console.error('Waitlist error:', error);
        setMatchState({ isWaiting: false, error: error.message });
        return;
      }

      setUserId(newUserId);
      setMatchState({ isWaiting: true });
      console.log('Successfully added to waitlist with userId:', newUserId);
    } catch (error) {
      console.error('Battle request error:', error);
      setMatchState({ 
        isWaiting: false, 
        error: currentLanguage === 'ja' ? 
          'エラーが発生しました' : 
          'An error occurred'
      });
    }
  };


  const renderMatchingScreen = () => {
    console.log('Rendering matching screen');
    console.log('Current location:', location);
    console.log('Opponent location:', matchingState.opponentLocation);

    return (
      <div className="flex flex-col items-center justify-center space-y-6 p-4">
        <h2 className="text-2xl font-bold text-green-600">
          {currentLanguage === 'ja' ? 'マッチングしました！' : 'Matched!'}
        </h2>
        
        <div className="w-full max-w-md space-y-6">
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">
              {currentLanguage === 'ja' ? 'あなたの場所' : 'Your Location'}
            </h3>
            <p className="text-gray-700">{location?.[currentLanguage].name}</p>
          </div>

          <div className="flex justify-center">
            <span className="material-icons text-3xl text-gray-500">sync_alt</span>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">
              {currentLanguage === 'ja' ? '対戦相手の場所' : 'Opponent Location'}
            </h3>
            <p className="text-gray-700">{matchingState.opponentLocation?.[currentLanguage].name}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    console.log('Rendering content');
    console.log('matchingState:', matchingState);
    console.log('matchState:', matchState);

    if (matchingState.isMatched) {
      return renderMatchingScreen();
    }

    if (matchState.isWaiting) {
      return (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-lg font-medium">
            {currentLanguage === 'ja' ? 
              '対戦相手を待っています...' : 
              'Waiting for an opponent...'}
          </p>
        </div>
      );
    }

    if (matchState.error) {
      return (
        <div className="text-center text-red-500">
          <p>{matchState.error}</p>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* 既存のトイレ情報表示部分 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">{location?.[currentLanguage].name}</h2>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="material-icons text-gray-500">location_on</span>
              <p className="text-gray-600">
                {`${location?.latitude.toFixed(4)}, ${location?.longitude.toFixed(4)}`}
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="material-icons text-gray-500">star</span>
              <p className="text-gray-600">{location?.rating?.toFixed(1)} / 5.0</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="material-icons text-gray-500">
                {location?.isOpen ? 'check_circle' : 'cancel'}
              </span>
              <p className="text-gray-600">
                {location?.isOpen ? 
                  (currentLanguage === 'ja' ? '営業中' : 'Open') : 
                  (currentLanguage === 'ja' ? '営業時間外' : 'Closed')}
              </p>
            </div>
          </div>
        </div>

        <div className="py-2">
          <p className="text-gray-700">{location?.[currentLanguage].description}</p>
        </div>

        {/* バトルボタンの追加 */}
        <button
          onClick={handleBattleRequest}
          className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {currentLanguage === 'ja' ? 
            'このトイレで戦闘する' : 
            'Battle at this toilet'}
        </button>

        {location?.images && location.images.length > 0 && (
          <div className="pt-2">
            <h3 className="text-lg font-medium mb-3">
              {currentLanguage === 'ja' ? '施設写真' : 'Facility Photos'}
            </h3>
            <ImageCarousel images={location.images} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transform transition-all duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } ${getHeightClass()}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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
        
        {location ? renderContent() : (
          <p className="text-center text-gray-500">
            {currentLanguage === 'ja' ? 
              'マーカーを選択してください' : 
              'Please select a marker'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ModalBottomSheet;