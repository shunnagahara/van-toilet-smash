import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './slices/deviceSlice';

const store = configureStore({
  reducer: {
    device: deviceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;