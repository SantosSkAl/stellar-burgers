import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getUserOrdersThunk = createAsyncThunk(
  'orders/getUserOrders',
  getOrdersApi
);

export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrderByNumber',
  getOrderByNumberApi
);

export interface OrdersState {
  isLoading: boolean;
  userOrders: TOrder[];
  selectedOrder: TOrder | null;
  error: string | null;
}

const initialState: OrdersState = {
  isLoading: false,
  userOrders: [],
  selectedOrder: null,
  error: null
};

export const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearUserOrders: (state) => {
      state.userOrders = [];
    }
  },
  extraReducers: (builder) => {
    // userOrders
    builder.addCase(getUserOrdersThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserOrdersThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(getUserOrdersThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userOrders = action.payload;
      state.error = null;
    });

    // selectOrder
    builder.addCase(getOrderByNumberThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
      state.selectedOrder = null;
    });
    builder.addCase(getOrderByNumberThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.selectedOrder = action.payload.orders[0] || null;
      state.error = null;
    });
  }
});

export const { clearUserOrders } = ordersSlice.actions;

export default ordersSlice.reducer;
