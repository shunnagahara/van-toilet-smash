import React from 'react';

interface LocationCoordinatesProps {
  latitude: number;
  longitude: number;
}

const LocationCoordinates: React.FC<LocationCoordinatesProps> = ({ latitude, longitude }) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="material-icons text-gray-500">location_on</span>
      <p className="text-gray-600">
        {`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
      </p>
    </div>
  );
};

export default LocationCoordinates; 