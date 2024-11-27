import React from 'react';
import Map, { NavigationControl } from 'react-map-gl';
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
    longitude: 139.7673068,  // 東京駅の経度
    latitude: 35.6809591,    // 東京駅の緯度
    zoom: 14
  },
  mapboxAccessToken 
}) => {
  if (!mapboxAccessToken) {
    return <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <p>Mapbox access token is required</p>
    </div>;
  }

  return (
    <div className="w-full h-full">
      <Map
        mapboxAccessToken={mapboxAccessToken}
        initialViewState={initialViewState}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <NavigationControl position="top-right" />
      </Map>
    </div>
  );
};

export default MapComponent;