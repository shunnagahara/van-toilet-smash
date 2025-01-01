import React from 'react';

interface ToiletLevelsProps {
  cleanlinessLevel: number;
  locationLevel: number;
  crowdingLevel: number;
  toiletCountLevel: number;
  uniquenessLevel: number;
  currentLanguage: string;
}

interface LevelConfig {
  value: number;
  color: LevelColor;
  label: string;
}

type LevelColor = 'blue' | 'green' | 'red' | 'purple' | 'yellow';

const ToiletLevels: React.FC<ToiletLevelsProps> = ({
  cleanlinessLevel,
  locationLevel,
  crowdingLevel,
  toiletCountLevel,
  uniquenessLevel,
  currentLanguage
}) => {
  // 色に関連するスタイルを別々のオブジェクトとして定義
  const colorStyles = {
    blue: {
      text: 'text-blue-700',
      bg: 'bg-blue-600'
    },
    green: {
      text: 'text-green-700',
      bg: 'bg-green-600'
    },
    red: {
      text: 'text-red-700',
      bg: 'bg-red-600'
    },
    purple: {
      text: 'text-purple-700',
      bg: 'bg-purple-600'
    },
    yellow: {
      text: 'text-yellow-700',
      bg: 'bg-yellow-600'
    }
  };

  const levels: LevelConfig[] = [
    {
      value: cleanlinessLevel,
      color: 'blue',
      label: currentLanguage === 'ja' ? '清潔レベル' : 'Cleanliness Level'
    },
    {
      value: locationLevel,
      color: 'green',
      label: currentLanguage === 'ja' ? '立地レベル' : 'Location Level'
    },
    {
      value: crowdingLevel,
      color: 'red',
      label: currentLanguage === 'ja' ? '混雑レベル' : 'Crowding Level'
    },
    {
      value: toiletCountLevel,
      color: 'purple',
      label: currentLanguage === 'ja' ? '便器数レベル' : 'Toilet Count Level'
    },
    {
      value: uniquenessLevel,
      color: 'yellow',
      label: currentLanguage === 'ja' ? 'ユニークレベル' : 'Uniqueness Level'
    }
  ];

  return (
    <div className="space-y-2">
      {levels.map((level, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span className={`text-base font-medium ${colorStyles[level.color].text}`}>
              {level.label}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`${colorStyles[level.color].bg} text-xs font-medium text-white text-center p-0.5 leading-none rounded-full`} 
              style={{ width: `${level.value}%` }}
            >
              {level.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToiletLevels;