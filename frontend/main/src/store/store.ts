import { configureStore } from '@reduxjs/toolkit';
import deviceReducer from './slices/deviceSlice';
import languageReducer from './slices/languageSlice';

const store = configureStore({
  reducer: {
    device: deviceReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;