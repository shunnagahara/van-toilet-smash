import React, { useState } from 'react';
import Image from 'next/image';

interface ToiletFighterImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

const ToiletFighterImage: React.FC<ToiletFighterImageProps> = ({
  src,
  alt,
  width = 70,
  height = 70,
  className = '',
  priority = false,
  onClick
}) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ width, height }}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-full" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={90}
        priority={priority}
        className={`rounded-full object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${onClick ? 'cursor-pointer hover:opacity-80' : ''}`}
        onLoadingComplete={() => setIsLoading(false)}
        onClick={onClick}
      />
    </div>
  );
};

export default ToiletFighterImage;