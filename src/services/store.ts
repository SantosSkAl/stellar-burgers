import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSlice } from './userSlice';
import { ingredientsSlice } from './ingredientsSlice';
import { feedSlice } from './feedSlice';
import { ordersSlice } from './ordersSlice';
import { burgerSlice } from './burgerSlice';

const rootReducer = combineSlices(
  userSlice,
  ingredientsSlice,
  feedSlice,
  ordersSlice,
  burgerSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
