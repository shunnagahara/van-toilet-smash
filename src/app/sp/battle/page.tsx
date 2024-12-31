"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import type { Location } from '@/types/location';
import { VANCOUVER_LOCATIONS } from '@/constants/location';
import { checkForMatch } from '@/repository/supabase/matching';
import { TOILET, COMMON } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';

type BattleResult = "win" | "lose" | null;

const BattleContent: React.FC = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId') || '';
  const router = useRouter();
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage) as Language;
  const [countdown, setCountdown] = useState<number>(5);
  const [battleResult, setBattleResult] = useState<BattleResult>(null);
  const [playerLocation, setPlayerLocation] = useState<Location | null>(null);
  const [opponentLocation, setOpponentLocation] = useState<Location | null>(null);

  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  useEffect(() => {
    const playerLocationId = parseInt(searchParams.get('playerLocationId') || '0');
    const opponentLocationId = parseInt(searchParams.get('opponentLocationId') || '0');

    setPlayerLocation(VANCOUVER_LOCATIONS.find(loc => loc.id === playerLocationId) || null);
    setOpponentLocation(VANCOUVER_LOCATIONS.find(loc => loc.id === opponentLocationId) || null);
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0 && battleResult === null) {
      const checkMatchResult = async () => {
        const { data: matching } = await checkForMatch(userId);
        if (matching) {
          const result = matching.player1_id === userId ? 
            matching.player1_result : 
            matching.player2_result;
          setBattleResult(result);
        }
      };
      checkMatchResult();
    }
  }, [countdown, battleResult, userId]);

  const handleReturnToTop = () => {
    router.push('/sp');
  };

  const renderBattleResult = () => (
    <div className="flex flex-col items-center justify-center space-y-6 p-4">
      {battleResult === "win" ? (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            {t(TOILET.BATTLE_VICTORY)}
          </h2>
          <p className="text-lg text-gray-700">
            {t(TOILET.BATTLE_CONGRATULATIONS)}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            {t(TOILET.BATTLE_DEFEAT)}
          </h2>
          <p className="text-lg text-gray-700">
            {t(TOILET.BATTLE_TRY_AGAIN)}
          </p>
        </div>
      )}

      <button
        onClick={handleReturnToTop}
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        {t(COMMON.RETURN_TO_TOP)}
      </button>
    </div>
  );

  if (!playerLocation || !opponentLocation) {
    return <div>{t(COMMON.LOADING)}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          {battleResult === null ? (
            <>
              <h2 className="text-2xl font-bold text-green-600">
                {t(TOILET.BATTLE_MATCHED)}
              </h2>

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-blue-600">
                  {t(TOILET.BATTLE_STARTS_IN)}
                </h3>
                <p className="text-4xl text-black font-bold mt-2">{countdown}</p>
              </div>
              
              <div className="w-full max-w-md space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-2">
                    {t(TOILET.BATTLE_YOUR_LOCATION)}
                  </h3>
                  <p className="text-black">{playerLocation[currentLanguage].name}</p>
                </div>

                <div className="flex justify-center">
                  <span className="material-icons text-3xl text-gray-500">sync_alt</span>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg text-black font-medium mb-2">
                    {t(TOILET.BATTLE_OPPONENT_LOCATION)}
                  </h3>
                  <p className="text-black">{opponentLocation[currentLanguage].name}</p>
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

const BattlePage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BattleContent />
    </Suspense>
  );
};

export default BattlePage;