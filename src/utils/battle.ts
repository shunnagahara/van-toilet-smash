import type { Location } from '@/types/location';
import { BATTLE } from '@/constants/common';

interface BattleResult {
  player1Result: 'win' | 'lose';
  player2Result: 'win' | 'lose';
}

interface BattleCalculationParams {
  player1Location: Location;
  player2Location: Location;
}

export const calculateBattleResult = ({ 
  player1Location, 
  player2Location 
}: BattleCalculationParams): BattleResult => {
  const calculatePower = (location: Location) => {
    const { POWER_FACTORS } = BATTLE;

    return (
      location.attackPower * POWER_FACTORS.ATTACK +
      location.defensePower * POWER_FACTORS.DEFENSE +
      location.cleanlinessLevel * POWER_FACTORS.CLEANLINESS +
      location.locationLevel * POWER_FACTORS.LOCATION +
      location.crowdingLevel * POWER_FACTORS.CROWDING +
      location.toiletCountLevel * POWER_FACTORS.TOILET_COUNT +
      location.uniquenessLevel * POWER_FACTORS.UNIQUENESS
    );
  };

  const player1Power = calculatePower(player1Location);
  const player2Power = calculatePower(player2Location);

  const randomModifier = 1 + (Math.random() * 2 - 1) * BATTLE.MECHANICS.RANDOM_FACTOR;

  const player1FinalPower = player1Power * randomModifier;
  const player2FinalPower = player2Power;

  const player1Wins = player1FinalPower > player2FinalPower;

  return {
    player1Result: player1Wins ? BATTLE.RESULTS.WIN : BATTLE.RESULTS.LOSE,
    player2Result: player1Wins ? BATTLE.RESULTS.LOSE : BATTLE.RESULTS.WIN
  };
};