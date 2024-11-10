"use client";

import React, { useState } from "react";

const ModalBottomSheet: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const toggleSheet = () => {
    setIsOpen(!isOpen);
    setIsExpanded(false); // 開閉時には通常サイズに戻す
  };

  // スワイプの開始位置を記録
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  // スワイプの移動位置を更新
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientY);
  };

  // スワイプ終了時に方向を判別
  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50; // スワイプ判定のための最小移動距離

    if (swipeDistance > minSwipeDistance) {
      // 上方向スワイプ
      setIsExpanded(true);
    } else if (swipeDistance < -minSwipeDistance) {
      // 下方向スワイプ
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative h-screen">
      {/* トグルボタン */}
      <button
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        onClick={toggleSheet}
      >
        ボトムシートを開く
      </button>

      {/* ボトムシート */}
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
            {/* スワイプインジケーター */}
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
    </div>
  );
};

export default ModalBottomSheet;
