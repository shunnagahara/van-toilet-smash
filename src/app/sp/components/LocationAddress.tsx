import React from 'react';

interface LocationAddressProps {
  address: string;
}

const LocationAddress: React.FC<LocationAddressProps> = ({ address }) => {
  return (
    <div className="text-gray-600 text-sm">
      <span className="material-icons text-sm mr-1 align-middle">location_on</span>
      {address}
    </div>
  );
};

export default LocationAddress;