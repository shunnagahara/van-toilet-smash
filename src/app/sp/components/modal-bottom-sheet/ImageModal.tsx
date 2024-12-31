import React, { useState } from 'react';
import { LocationImage } from '@/types/location';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: LocationImage[];
  currentLanguage: string;
}

const ImageModal = ({ isOpen, onClose, images, currentLanguage }: ImageModalProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean[]>(Array(images.length).fill(true));
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  const handleImageLoad = (index: number) => {
    setIsLoading(prev => {
      const newState = [...prev];
      newState[index] = false;
      return newState;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white p-2 z-50"
          aria-label={currentLanguage === 'ja' ? '閉じる' : 'Close'}
        >
          <span className="material-icons">close</span>
        </button>

        {/* Image carousel */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div ref={sliderRef} className="keen-slider">
            {images.map((image, idx) => (
              <div key={image.id} className="keen-slider__slide flex justify-center">
                <div className="h-[200px] flex items-center justify-center bg-gray-100 relative w-full">
                  {isLoading[idx] && currentSlide === idx && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                  )}
                  <div className="relative h-full aspect-video">
                    <Image
                      src={image.url}
                      alt={`Slide ${idx + 1}`}
                      fill
                      className={`object-contain transition-opacity duration-300 ${
                        isLoading[idx] ? 'opacity-0' : 'opacity-100'
                      }`}
                      sizes="(max-width: 2xl) 100vw, 42rem"
                      onLoadingComplete={() => handleImageLoad(idx)}
                      loading={currentSlide === idx ? "eager" : "lazy"}
                      priority={currentSlide === idx}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation indicators */}
          <div className="flex justify-center gap-2 p-4 bg-white">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === idx ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;