"use client";

import React, { useEffect, useState } from "react";
import ModalBottomSheet from "./components/ModalBottomSheet";
import MapComponent from "./components/MapComponent";
import LanguageToggle from "./components/LanguageToggle";
import type { Location } from "@/types/location";
import type { MatchState } from "@/types/waitlist";

declare global {
  interface Window {
    workbox: {
      register: () => Promise<void>;
      active: boolean;
    };
  }
}

const SpTop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [matchState, setMatchState] = useState<MatchState>({
    isWaiting: false,
    error: undefined,
  });

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // Service Workerの登録
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then(registration => {
            console.log('Service Worker registered:', registration);
          })
          .catch(error => {
            console.error('Service Worker registration failed:', error);
          });
      }
    }
  }, []);

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

      <LanguageToggle isMatchmaking={matchState.isWaiting} />

      <div className="z-30 relative">
        <ModalBottomSheet 
          isOpen={isOpen} 
          toggleSheet={toggleSheet}
          location={selectedLocation}
          onMatchStateChange={setMatchState}
        />
      </div>
    </div>
  );
};

export default SpTop;