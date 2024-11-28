"use client";

import React, { useState } from "react";
import ModalBottomSheet from "./components/ModalBottomSheet";
import Footer from "./components/Footer";
import MapComponent from "./components/MapComponent";
import LanguageToggle from "./components/LanguageToggle";
import type { Location } from "./components/MapComponent";

const SpTop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>();

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    setIsOpen(true);
  };

  const toggleSheet = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setSelectedLocation(undefined);
    }
  };

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <MapComponent 
          mapboxAccessToken={MAPBOX_TOKEN} 
          onMarkerClick={handleMarkerClick}
        />
      </div>

      <LanguageToggle />

      <div className="z-30 relative">
        <ModalBottomSheet 
          isOpen={isOpen} 
          toggleSheet={toggleSheet}
          location={selectedLocation}
        />
      </div>

      <div className="z-30 relative">
        <Footer />
      </div>
    </div>
  );
};

export default SpTop;