import React from 'react';

interface PowerRatingProps {
  value: number;
  icon: string;
  label: string;
  maxValue?: number;
}

const PowerRating: React.FC<PowerRatingProps> = ({ 
  value, 
  icon, 
  label,
  maxValue = 10 
}) => {
  const filledStars = Math.floor((value / maxValue) * 5);
  
  const getIconColor = (isActive: boolean) => {
    if (!isActive) return 'text-gray-300';
    
    switch (icon) {
      case 'local_fire_department':
        return 'text-red-400';
      case 'shield':
        return 'text-blue-400';
      default:
        return 'text-yellow-500';
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`material-icons text-lg ${
                getIconColor(index < filledStars)
              }`}
            >
              {icon}
            </span>
          ))}
        </div>
        <span className="ml-2 text-gray-600">
          {label}: {value.toFixed(1)}
        </span>
      </div>
    </div>
  );
};

export default PowerRating;