import feedReducer, {
  getFeedThunk,
  initialState
} from './feedSlice';
import type { FeedState } from './feedSlice';
import type { TOrder } from '@utils-types';

describe('feedSlice reducer', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: [],
    status: 'done',
    name: 'Test order',
    number: 123,
    createdAt: '',
    updatedAt: ''
  };

  it('хендлер для getFeedThunk.pending', () => {
    const state = feedReducer(initialState, {
      type: getFeedThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для getFeedThunk.rejected', () => {
    const loadingState: FeedState = {
      ...initialState,
      isLoading: true
    };
    const state = feedReducer(loadingState, {
      type: getFeedThunk.rejected.type,
      error: { message: 'Ошибка загрузки ленты' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ленты');
  });

  it('хендлер для getFeedThunk.fulfilled', () => {
    const loadingState: FeedState = {
      ...initialState,
      isLoading: true
    };
    const state = feedReducer(loadingState, {
      type: getFeedThunk.fulfilled.type,
      payload: {
        orders: [mockOrder],
        total: 1000,
        totalToday: 50
      }
    });

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(1000);
    expect(state.totalToday).toBe(50);
    expect(state.error).toBeNull();
  });
});
