import { rootReducer } from './store';
import { userSlice } from './userSlice';
import { ingredientsSlice } from './ingredientsSlice';
import { feedSlice } from './feedSlice';
import { ordersSlice } from './ordersSlice';
import { burgerSlice } from './burgerSlice';

describe('rootReducer', () => {
  it('инициализация начального состояния', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // ключи
    expect(state).toHaveProperty(userSlice.name);
    expect(state).toHaveProperty(ingredientsSlice.name);
    expect(state).toHaveProperty(feedSlice.name);
    expect(state).toHaveProperty(ordersSlice.name);
    expect(state).toHaveProperty(burgerSlice.name);

    // initialState
    expect(state[userSlice.name]).toEqual(userSlice.getInitialState());
    expect(state[ingredientsSlice.name]).toEqual(ingredientsSlice.getInitialState());
    expect(state[feedSlice.name]).toEqual(feedSlice.getInitialState());
    expect(state[ordersSlice.name]).toEqual(ordersSlice.getInitialState());
    expect(state[burgerSlice.name]).toEqual(burgerSlice.getInitialState());
  });
});