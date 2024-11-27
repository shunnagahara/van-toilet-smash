"use client";

import React, { useState } from "react";

interface ModalBottomSheetProps {
  isOpen: boolean;
  toggleSheet: () => void;
}

type SheetState = "A" | "B" | "C";

const ModalBottomSheet: React.FC<ModalBottomSheetProps> = ({ isOpen, toggleSheet }) => {
  const [sheetState, setSheetState] = useState<SheetState>("A");
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

  // スワイプ終了時に状態遷移を判定
  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50; // スワイプ判定のための最小移動距離

    if (swipeDistance > minSwipeDistance) { // 上方向スワイプ
      if (sheetState === "A") {
        setSheetState("B");
      } else if (sheetState === "B") {
        setSheetState("C");
      }
    } else if (swipeDistance < -minSwipeDistance) { // 下方向スワイプ
      if (sheetState === "C") {
        setSheetState("B");
      } else if (sheetState === "B") {
        setSheetState("A");
      }
    }
  };

  // 状態に応じたheightクラスを返す
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

  // シートを閉じる時の処理
  const handleClose = () => {
    setSheetState("A");
    toggleSheet();
  };

  // Cの状態からBに戻る処理
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
      {/* 下向き矢印ボタン（C状態の時のみ表示） */}
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
        <h2 className="text-lg font-semibold text-center">ボトムシート内容</h2>
        <p className="text-center mt-2 text-gray-500">
          {sheetState === "A" && "上にスワイプして展開できます"}
          {sheetState === "B" && "上にスワイプしてフル表示、下にスワイプして縮小できます"}
          {sheetState === "C" && "下にスワイプまたは↓ボタンで縮小できます"}
        </p>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg w-full"
          onClick={handleClose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ModalBottomSheet;