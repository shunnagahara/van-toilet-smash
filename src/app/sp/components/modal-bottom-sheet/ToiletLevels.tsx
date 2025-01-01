import React from 'react';
import { TOILET } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';

interface ToiletLevelsProps {
  cleanlinessLevel: number;
  locationLevel: number;
  crowdingLevel: number;
  toiletCountLevel: number;
  uniquenessLevel: number;
  currentLanguage: Language;
}

const ToiletLevels: React.FC<ToiletLevelsProps> = ({
  cleanlinessLevel,
  locationLevel,
  crowdingLevel,
  toiletCountLevel,
  uniquenessLevel,
  currentLanguage
}) => {
  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  const levels = [
    {
      value: cleanlinessLevel,
      color: 'blue',
      label: t(TOILET.STATS_CLEANLINESS)
    },
    {
      value: locationLevel,
      color: 'green',
      label: t(TOILET.STATS_LOCATION)
    },
    {
      value: crowdingLevel,
      color: 'red',
      label: t(TOILET.STATS_CROWDING)
    },
    {
      value: toiletCountLevel,
      color: 'purple',
      label: t(TOILET.STATS_TOILET_COUNT)
    },
    {
      value: uniquenessLevel,
      color: 'yellow',
      label: t(TOILET.STATS_UNIQUENESS)
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
    <div className="space-y-5">
      {levels.map((level, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-1">
            <div className={`text-base font-medium ${getColorClasses(level.color).split(' ')[0]} dark:text-white`}>
              {level.label}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className={`${getColorClasses(level.color).split(' ')[1]} text-xs font-medium text-white text-center p-0.5 leading-none rounded-full`} 
              style={{width: `${level.value}%`}}
            >
              {level.value}-- debug
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToiletLevels;