import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getFeedThunk = createAsyncThunk('feed/getFeed', getFeedsApi);

export interface FeedState {
  isLoading: boolean;
  orders: TOrder[];
  error: string | null;
  total: number;
  totalToday: number;
}

const initialState: FeedState = {
  isLoading: false,
  orders: [],
  error: null,
  total: 0,
  totalToday: 0
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFeedThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getFeedThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(getFeedThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.error = null;
    });
  }
});

export default feedSlice.reducer;
