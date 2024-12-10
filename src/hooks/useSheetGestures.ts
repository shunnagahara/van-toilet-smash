import { useState, useCallback } from 'react';

export type SheetState = 'A' | 'B' | 'C';

interface SheetGesturesReturn {
  sheetState: SheetState;
  setSheetState: (state: SheetState) => void;
  handlers: {
    handleTouchStart: (e: React.TouchEvent) => void;
    handleTouchMove: (e: React.TouchEvent) => void;
    handleTouchEnd: (e: React.TouchEvent) => void;
  };
  getHeightClass: () => string;
}

export const useSheetGestures = (initialState: SheetState): SheetGesturesReturn => {
  const [sheetState, setSheetState] = useState<SheetState>(initialState);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const getHeightClass = useCallback(() => {
    switch (sheetState) {
      case "A": return "h-1/5";
      case "B": return "h-1/2";
      case "C": return "h-full";
      default: return "h-1/5";
    }
  }, [sheetState]);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchStart(e.touches[0].clientY);
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (swipeDistance > minSwipeDistance) {
      // 上スワイプ
      if (sheetState === 'A') setSheetState('B');
      else if (sheetState === 'B') setSheetState('C');
    } else if (swipeDistance < -minSwipeDistance) {
      // 下スワイプ
      if (sheetState === 'C') setSheetState('B');
      else if (sheetState === 'B') setSheetState('A');
    }
  };

  return {
    sheetState,
    setSheetState,
    handlers: {
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd,
    },
    getHeightClass
  };
}; 