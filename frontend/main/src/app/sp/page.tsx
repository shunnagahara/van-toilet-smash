"use client";

import React, { useState } from "react";
import ModalBottomSheet from "./components/ModalBottomSheet";
import Footer from "./components/Footer";

const SpTop: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSheet = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="h-screen">
      {/* ページ上部にボタンを配置 */}
      <button
        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={toggleSheet}
      >
        ボトムシートを開く
      </button>

      {/* ModalBottomSheetコンポーネントを表示 */}
      <ModalBottomSheet isOpen={isOpen} toggleSheet={toggleSheet} />
      <Footer/>
    </div>
  );
};

export default SpTop;
