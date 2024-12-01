// src/app/sp/components/MapComponent.tsx
import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/types/location';
import { getLocations } from '@/constants/location';

interface MapComponentProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  mapboxAccessToken: string | undefined;
  onMarkerClick?: (location: Location) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  initialViewState = {
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 13
  },
  mapboxAccessToken,
  onMarkerClick 
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        // データが配列であることを確認
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          console.error('Received non-array data:', data);
          setError(currentLanguage === 'ja' ? 
            'データの形式が不正です' : 
            'Invalid data format');
        }
      } catch (err) {
        console.error('Error loading locations:', err);
        setError(currentLanguage === 'ja' ? 
          'データの読み込みに失敗しました' : 
          'Failed to load locations');
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [currentLanguage]);

  if (!mapboxAccessToken) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>{currentLanguage === 'ja' ? 'Mapboxのアクセストークンが必要です' : 'Mapbox access token is required'}</p>
    </div>;
  }

  if (loading) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>{currentLanguage === 'ja' ? '読み込み中...' : 'Loading...'}</p>
    </div>;
  }

  if (error) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p className="text-red-500">{error}</p>
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
        {Array.isArray(locations) && locations.map(location => (
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