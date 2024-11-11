"use client";

import React, { useState } from "react";

interface ModalBottomSheetProps {
  isOpen: boolean;
  toggleSheet: () => void;
}

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({ isOpen, toggleSheet }) => {
  const [isExpanded, setIsExpanded] = useState(false); // 展開状態を管理
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // スワイプ開始位置を記録
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  // スワイプの移動位置を更新
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  // スワイプ終了時に展開または縮小を判定
  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50; // スワイプ判定のための最小移動距離

    if (swipeDistance > minSwipeDistance) {
      // 上方向スワイプで展開
      setIsExpanded(true);
    } else if (swipeDistance < -minSwipeDistance) {
      // 下方向スワイプで縮小
      setIsExpanded(false);
    }
  };

  return (
    <div
      className={`fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-lg transform transition-all duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      } ${isExpanded ? "h-full" : "h-1/3"}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-4 cursor-pointer">
        <div className="flex justify-center">
          <div className="w-12 h-1 bg-gray-300 rounded-full mb-4"></div>
        </div>
        <h2 className="text-lg font-semibold text-center">ボトムシート内容</h2>
        <p className="text-center mt-2 text-gray-500">
          ここに内容を表示します。スワイプで展開・縮小できます。
        </p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          onClick={toggleSheet}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ModalBottomSheet;
