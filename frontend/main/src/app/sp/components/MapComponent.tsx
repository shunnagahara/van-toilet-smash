import React from 'react';
import Map, { Marker } from 'react-map-gl';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/types/location';

interface MapComponentProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  mapboxAccessToken: string | undefined;
  onMarkerClick?: (location: Location) => void;
}

const VANCOUVER_LOCATIONS: Location[] = [
  {
    id: 1,
    name: "Gastown Public Toilet",
    latitude: 49.2827,
    longitude: -123.1067,
    description: "Historic Gastown地区の公衆トイレ。24時間利用可能。",
    rating: 4.2,
    isOpen: true,
    images: [
      {
        id: "1",
        url: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-images/images.jpeg",
        createdAt: new Date().toISOString()
      },
      {
        id: "2",
        url: "https://tgoysscvgojhzejawwpj.supabase.co/storage/v1/object/public/toilet-images/8f3e39adc40efd3b6234a7b3ce7c21977447f8e2.jpg",
        createdAt: new Date().toISOString()
      },
    ]
  },
  // ... 他のロケーション
];

const MapComponent: React.FC<MapComponentProps> = ({ 
  initialViewState = {
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 13
  },
  mapboxAccessToken,
  onMarkerClick 
}) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  if (!mapboxAccessToken) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>{currentLanguage === 'ja' ? 'Mapboxのアクセストークンが必要です' : 'Mapbox access token is required'}</p>
    </div>;
  }

  const mapStyle = currentLanguage === 'ja' 
    ? 'mapbox://styles/mapbox/streets-v11?language=ja' 
    : 'mapbox://styles/mapbox/streets-v11?language=en';

  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyle}
      >
        {VANCOUVER_LOCATIONS.map(location => (
          <Marker
            key={location.id}
            latitude={location.latitude}
            longitude={location.longitude}
            anchor="bottom"
            onClick={() => onMarkerClick?.(location)}
          >
            <div className="relative w-10 h-10 cursor-pointer transform hover:scale-110 transition-transform">
              <div className="absolute inset-0 bg-red-500 rounded-full" />
              <div className="absolute inset-[2px] bg-white rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center text-base">
                🚽
              </div>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapComponent;
