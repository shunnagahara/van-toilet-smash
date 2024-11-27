"use client";

import React, { useState } from "react";
import ModalBottomSheet from "./components/ModalBottomSheet";
import Footer from "./components/Footer";
import MapComponent from "./components/MapComponent";

const SpTop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => {
    setIsOpen((prev) => !prev);
  };

  // IMPORTANT: Replace with your actual Mapbox access token
  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="relative h-screen w-full">
      {/* 地図コンポーネントを画面いっぱいに配置 */}
      <div className="absolute inset-0">
        <MapComponent mapboxAccessToken={MAPBOX_TOKEN} />
      </div>

      {/* ページ上部にボタンを配置 */}
      <button
        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg z-20"
        onClick={toggleSheet}
      >
        ボトムシートを開く
      </button>

      {/* ModalBottomSheetコンポーネントを表示 */}
      <div className="z-30 relative">
        <ModalBottomSheet isOpen={isOpen} toggleSheet={toggleSheet} />
      </div>

      {/* フッターをオーバーレイ表示 */}
      <div className="z-30 relative">
        <Footer />
      </div>
    </div>
  );
};

export default SpTop;