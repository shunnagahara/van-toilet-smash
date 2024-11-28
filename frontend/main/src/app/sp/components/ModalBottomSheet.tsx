"use client";

import React, { useState } from "react";
import type { Location } from "./MapComponent";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

interface ModalBottomSheetProps {
  isOpen: boolean;
  toggleSheet: () => void;
  location?: Location;
}

type SheetState = "A" | "B" | "C";

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({ isOpen, toggleSheet, location }) => {
  const [sheetState, setSheetState] = useState<SheetState>("A");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  // Previous touch handlers remain the same...
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      if (sheetState === "A") {
        setSheetState("B");
      } else if (sheetState === "B") {
        setSheetState("C");
      }
    } else if (swipeDistance < -minSwipeDistance) {
      if (sheetState === "C") {
        setSheetState("B");
      } else if (sheetState === "B") {
        setSheetState("A");
      }
    }
  };

  const getHeightClass = () => {
    switch (sheetState) {
      case "A":
        return "h-1/5";
      case "B":
        return "h-1/2";
      case "C":
        return "h-full";
      default:
        return "h-1/5";
    }
  };

  const handleClose = () => {
    setSheetState("A");
    toggleSheet();
  };

  const handleCollapseToB = () => {
    setSheetState("B");
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transform transition-all duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } ${getHeightClass()}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {sheetState === "C" && (
        <button
          onClick={handleCollapseToB}
          className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <span className="material-icons">arrow_downward</span>
        </button>
      )}

      <div className="p-4">
        <div className="flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full mb-4"></div>
        </div>
        
        {location ? (
          <div>
            <h2 className="text-xl font-semibold mb-2">{location.name}</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="material-icons text-gray-500">location_on</span>
                <p className="text-gray-600">{`${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="material-icons text-gray-500">star</span>
                <p className="text-gray-600">{location.rating?.toFixed(1)} / 5.0</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="material-icons text-gray-500">
                  {location.isOpen ? 'check_circle' : 'cancel'}
                </span>
                <p className="text-gray-600">
                  {location.isOpen ? 
                    (currentLanguage === 'ja' ? '営業中' : 'Open') : 
                    (currentLanguage === 'ja' ? '営業時間外' : 'Closed')}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-gray-700">{location.description}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">
            {currentLanguage === 'ja' ? 
              'マーカーを選択してください' : 
              'Please select a marker'}
          </p>
        )}

        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          onClick={handleClose}
        >
          {currentLanguage === 'ja' ? '閉じる' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default ModalBottomSheet;