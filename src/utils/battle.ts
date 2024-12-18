import type { Location } from '@/types/location';

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
  // 各プレーヤーの総合力を計算
  const calculatePower = (location: Location) => {
    const powerFactors = {
      attackPower: 2.0,      // 攻撃力の重み
      defensePower: 1.5,     // 防御力の重み
      cleanlinessLevel: 1.2, // 清潔度の重み
      locationLevel: 1.0,    // 立地の重み
      crowdingLevel: 0.8,    // 混雑度の重み
      toiletCountLevel: 0.7, // トイレ数の重み
      uniquenessLevel: 1.3   // ユニーク性の重み
    };

    return (
      location.attackPower * powerFactors.attackPower +
      location.defensePower * powerFactors.defensePower +
      location.cleanlinessLevel * powerFactors.cleanlinessLevel +
      location.locationLevel * powerFactors.locationLevel +
      location.crowdingLevel * powerFactors.crowdingLevel +
      location.toiletCountLevel * powerFactors.toiletCountLevel +
      location.uniquenessLevel * powerFactors.uniquenessLevel
    );
  };

  const player1Power = calculatePower(player1Location);
  const player2Power = calculatePower(player2Location);

  // ランダム性を加味した勝敗決定
  const randomFactor = 0.2; // 20%のランダム性
  const randomModifier = 1 + (Math.random() * 2 - 1) * randomFactor;
  
  const player1FinalPower = player1Power * randomModifier;
  const player2FinalPower = player2Power;

  const player1Wins = player1FinalPower > player2FinalPower;

  return {
    player1Result: player1Wins ? 'win' : 'lose',
    player2Result: player1Wins ? 'lose' : 'win'
  };
};