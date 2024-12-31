import React, { useEffect, useState } from 'react';
import Map, { Marker } from 'react-map-gl';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/types/location';
import { getLocations } from '@/constants/location';
import { getAssetPath } from '@/utils/path';
import { MAP, COMMON } from '@/constants/i18n';
import type { Language } from '@/constants/i18n';

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
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage) as Language;

  const t = (text: { ja: string; en: string }) => text[currentLanguage];

  const calculateTotalScore = (location: Location): number => {
    return (
      location.cleanlinessLevel +
      location.locationLevel +
      location.crowdingLevel +
      location.toiletCountLevel +
      location.uniquenessLevel
    );
  };

  const getMarkerColor = (totalScore: number): string => {
    if (totalScore <= 100) return 'bg-blue-400';
    if (totalScore <= 200) return 'bg-green-400';
    if (totalScore <= 300) return 'bg-yellow-400';
    if (totalScore <= 400) return 'bg-orange-400';
    return 'bg-red-400';
  };

  useEffect(() => {
    const loadLocations = async () => {
      try {
        setLoading(true);
        const data = await getLocations();
        if (Array.isArray(data)) {
          setLocations(data);
        } else {
          console.error('Received non-array data:', data);
          setError(t(COMMON.ERROR_INVALID_DATA));
        }
      } catch (err) {
        console.error('Error loading locations:', err);
        setError(t(COMMON.ERROR_LOAD_FAILED));
      } finally {
        setLoading(false);
      }
    };

    loadLocations();
  }, [currentLanguage]);

  if (!mapboxAccessToken) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>{t(MAP.MAPBOX_TOKEN_REQUIRED)}</p>
    </div>;
  }

  if (loading) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>{t(COMMON.LOADING)}</p>
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
        {Array.isArray(locations) && locations.map(location => {
          const totalScore = calculateTotalScore(location);
          const markerColor = getMarkerColor(totalScore);
          
          return (
            <Marker
              key={location.id}
              latitude={location.latitude}
              longitude={location.longitude}
              anchor="bottom"
              onClick={() => onMarkerClick?.(location)}
            >
              <div className="relative w-10 h-10 cursor-pointer transform hover:scale-110 transition-transform">
                <div className={`absolute inset-0 ${markerColor} rounded-full`} />
                <div className="absolute inset-[2px] bg-white rounded-full" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image 
                    src={getAssetPath(totalScore >= 300 ? "/rare-toilet.png" : "/toilet.png")}
                    alt={totalScore >= 300 ? t(MAP.RARE_TOILET) : t(MAP.TOILET)} 
                    width={24} 
                    height={24} 
                  />
                </div>
              </div>
            </Marker>
          );
        })}
      </Map>
    </div>
  );
};

export default MapComponent;