"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import ModalBottomSheet from "./components/ModalBottomSheet";
import Footer from "./components/Footer";
import MapComponent from "./components/MapComponent";
import LanguageToggle from "./components/LanguageToggle";

const SpTop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

  const toggleSheet = () => {
    setIsOpen((prev) => !prev);
  };

  const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  return (
    <div className="relative h-screen w-full">
      {/* 地図コンポーネントを画面いっぱいに配置 */}
      <div className="absolute inset-0">
        <MapComponent mapboxAccessToken={MAPBOX_TOKEN} onMarkerClick={toggleSheet} />
      </div>

      {/* 言語切り替えボタン */}
      <LanguageToggle />

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