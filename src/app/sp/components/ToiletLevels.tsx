import React from 'react';

interface ToiletLevelsProps {
  cleanlinessLevel: number;
  locationLevel: number;
  crowdingLevel: number;
  toiletCountLevel: number;
  uniquenessLevel: number;
  currentLanguage: string;
}

const ToiletLevels: React.FC<ToiletLevelsProps> = ({
  cleanlinessLevel,
  locationLevel,
  crowdingLevel,
  toiletCountLevel,
  uniquenessLevel,
  currentLanguage
}) => {
  const levels = [
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
  ] as const;

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-700 bg-blue-600',
      green: 'text-green-700 bg-green-600',
      red: 'text-red-700 bg-red-600',
      purple: 'text-purple-700 bg-purple-600',
      yellow: 'text-yellow-700 bg-yellow-600'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="space-y-2">
      {levels.map((level, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1">
            <span className={`text-base font-medium ${getColorClasses(level.color).split(' ')[0]} dark:text-white`}>
              {level.label}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className={`${getColorClasses(level.color).split(' ')[1]} text-xs font-medium text-white text-center p-0.5 leading-none rounded-full`} 
              style={{width: `${level.value}%`}}
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