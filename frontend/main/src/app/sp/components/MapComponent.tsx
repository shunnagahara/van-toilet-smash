import React from 'react';
import Map, { Marker } from 'react-map-gl';
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

const VANCOUVER_LOCATIONS = [
  {
    id: 1,
    name: "Gastown",
    latitude: 49.2827,
    longitude: -123.1067
  },
  {
    id: 2,
    name: "Yaletown",
    latitude: 49.2754,
    longitude: -123.1216
  },
  {
    id: 3,
    name: "Coal Harbour",
    latitude: 49.2897,
    longitude: -123.1226
  }
];

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
          >
            <div className="relative w-10 h-10 cursor-pointer transform hover:scale-110 transition-transform">
              {/* 赤いマーカー背景 */}
              <div className="absolute inset-0 bg-red-500 rounded-full" />
              {/* 中心の白い円 - insetの値を小さくして赤枠を細く */}
              <div className="absolute inset-[2px] bg-white rounded-full" />
              {/* トイレアイコン - テキストサイズを大きく */}
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