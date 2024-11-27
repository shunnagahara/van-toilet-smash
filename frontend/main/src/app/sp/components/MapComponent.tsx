import React from 'react';
import Map from 'react-map-gl';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapComponentProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  mapboxAccessToken: string | undefined;
}

const MapComponent: React.FC<MapComponentProps> = ({ 
  initialViewState = {
    longitude: -123.1207,
    latitude: 49.2827,
    zoom: 13
  },
  mapboxAccessToken 
}) => {
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  if (!mapboxAccessToken) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>{currentLanguage === 'ja' ? 'Mapboxのアクセストークンが必要です' : 'Mapbox access token is required'}</p>
    </div>;
  }

  // 言語に応じてマップスタイルを切り替え
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
      />
    </div>
  );
};

export default MapComponent;