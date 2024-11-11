import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 型定義
interface DeviceState {
  isPC: boolean;
}

// 初期状態
const initialState: DeviceState = {
  isPC: false,
};

// スライスを作成
const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setIsPC: (state, action: PayloadAction<boolean>) => {
      state.isPC = action.payload;
    },
  },
});

export const { setIsPC } = deviceSlice.actions;
export default deviceSlice.reducer;
