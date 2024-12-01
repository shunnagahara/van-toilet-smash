import React, { useState } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { LocationImage } from '@/types/location';

interface ImageCarouselProps {
  images: LocationImage[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  if (images.length === 0) return null;

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider h-48 rounded-lg overflow-hidden">
        {images.map((image, idx) => (
          <div key={image.id} className="keen-slider__slide">
            <img
              src={image.url}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              instanceRef.current?.moveToIdx(idx);
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === idx ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;