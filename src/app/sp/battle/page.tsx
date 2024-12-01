"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Location } from '@/types/location';
import { VANCOUVER_LOCATIONS } from '@/constants/location';

type BattleResult = "win" | "lose" | null;

const BattlePage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
  
  // State
  const [countdown, setCountdown] = useState<number>(5);
  const [battleResult, setBattleResult] = useState<BattleResult>(null);
  const [playerLocation, setPlayerLocation] = useState<Location | null>(null);
  const [opponentLocation, setOpponentLocation] = useState<Location | null>(null);

  useEffect(() => {
    // URLパラメータから情報を取得
    const playerLocationId = parseInt(searchParams.get('playerLocationId') || '0');
    const opponentLocationId = parseInt(searchParams.get('opponentLocationId') || '0');

    // ロケーション情報を設定
    setPlayerLocation(VANCOUVER_LOCATIONS.find(loc => loc.id === playerLocationId) || null);
    setOpponentLocation(VANCOUVER_LOCATIONS.find(loc => loc.id === opponentLocationId) || null);
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && battleResult === null) {
      const result = Math.random() < 0.5 ? "win" : "lose";
      setBattleResult(result);
    }
  }, [countdown, battleResult]);

  const handleReturnToTop = () => {
    router.push('/sp');
  };

  const renderBattleResult = () => (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      {battleResult === "win" ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {currentLanguage === 'ja' ? '勝利！' : 'Victory!'}
          </h2>
          <p className="text-lg text-gray-700">
            {currentLanguage === 'ja' 
              ? 'おめでとうございます！あなたの勝利です！' 
              : 'Congratulations! You are the winner!'}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            {currentLanguage === 'ja' ? '敗北...' : 'Defeat...'}
          </h2>
          <p className="text-lg text-gray-700">
            {currentLanguage === 'ja'
              ? '残念...次は勝利を掴みましょう！'
              : 'Too bad... Better luck next time!'}
          </p>
        </div>
      )}

      <button
        onClick={handleReturnToTop}
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {currentLanguage === 'ja' ? 'TOPに戻る' : 'Return to TOP'}
      </button>
    </div>
  );

  if (!playerLocation || !opponentLocation) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          {battleResult === null ? (
            <>
              <h2 className="text-2xl font-bold text-green-600">
                {currentLanguage === 'ja' ? 'マッチングしました！' : 'Matched!'}
              </h2>

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-blue-600">
                  {currentLanguage === 'ja' ? '対戦開始まで...' : 'Battle starts in...'}
                </h3>
                <p className="text-4xl font-bold mt-2">{countdown}</p>
              </div>
              
              <div className="w-full max-w-md space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">
                    {currentLanguage === 'ja' ? 'あなたの場所' : 'Your Location'}
                  </h3>
                  <p className="text-gray-700">{playerLocation[currentLanguage].name}</p>
                </div>

                <div className="flex justify-center">
                  <span className="material-icons text-3xl text-gray-500">sync_alt</span>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">
                    {currentLanguage === 'ja' ? '対戦相手の場所' : 'Opponent Location'}
                  </h3>
                  <p className="text-gray-700">{opponentLocation[currentLanguage].name}</p>
                </div>
              </div>
            </>
          ) : (
            renderBattleResult()
          )}
        </div>
      </div>
    </div>
  );
};

export default BattlePage;