import ordersReducer, {
  clearUserOrders,
  getUserOrdersThunk,
  getOrderByNumberThunk,
  isUserOrders,
  initialState
} from './ordersSlice';
import type { OrdersState } from './ordersSlice';
import type { TOrder } from '@utils-types';

describe('ordersSlice reducer', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: [],
    status: 'done',
    name: 'Test order',
    number: 123,
    createdAt: '',
    updatedAt: ''
  };

  it('сброс заказов пользователя', () => {
    const filledState: OrdersState = {
      ...initialState,
      userOrders: [mockOrder]
    };
    const state = ordersReducer(filledState, clearUserOrders());

    expect(state.userOrders).toEqual([]);
  });

  // UserOrders
  it('хендлер для getUserOrdersThunk.pending', () => {
    const state = ordersReducer(initialState, {
      type: getUserOrdersThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для getUserOrdersThunk.rejected', () => {
    const loadingState: OrdersState = {
      ...initialState,
      isLoading: true
    };
    const state = ordersReducer(loadingState, {
      type: getUserOrdersThunk.rejected.type,
      error: { message: 'Ошибка загрузки заказов' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  it('хендлер для getUserOrdersThunk.fulfilled', () => {
    const loadingState: OrdersState = {
      ...initialState,
      isLoading: true
    };
    const state = ordersReducer(loadingState, {
      type: getUserOrdersThunk.fulfilled.type,
      payload: [mockOrder]
    });

    expect(state.isLoading).toBe(false);
    expect(state.userOrders).toEqual([mockOrder]);
    expect(state.error).toBeNull();
  });

  // selectOrder
  it('хендлер для getOrderByNumberThunk.pending', () => {
    const filledState: OrdersState = {
      ...initialState,
      selectedOrder: mockOrder
    };
    const state = ordersReducer(filledState, {
      type: getOrderByNumberThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.selectedOrder).toBeNull();
    expect(state.error).toBeNull();
  });

  it('хендлер для getOrderByNumberThunk.rejected', () => {
    const loadingState: OrdersState = {
      ...initialState,
      isLoading: true
    };
    const state = ordersReducer(loadingState, {
      type: getOrderByNumberThunk.rejected.type,
      error: { message: 'Ошибка загрузки заказа' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказа');
  });

  it('хендлер для getOrderByNumberThunk.fulfilled', () => {
    const loadingState: OrdersState = {
      ...initialState,
      isLoading: true
    };
    const state = ordersReducer(loadingState, {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: { orders: [mockOrder] }
    });

    expect(state.isLoading).toBe(false);
    expect(state.selectedOrder).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('хендлер для getOrderByNumberThunk.fulfilled с не найденым заказом', () => {
    const loadingState: OrdersState = {
      ...initialState,
      isLoading: true
    };
    const state = ordersReducer(loadingState, {
      type: getOrderByNumberThunk.fulfilled.type,
      payload: { orders: [] }
    });

    expect(state.isLoading).toBe(false);
    expect(state.selectedOrder).toBeNull();
    expect(state.error).toBeNull();
  });
});
