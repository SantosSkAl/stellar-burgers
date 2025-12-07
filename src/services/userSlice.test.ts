import userReducer, {
  authChecked,
  clearUser,
  clearError,
  getUserThunk,
  registerUserThunk,
  updateUserThunk,
  loginUserThunk,
  initialState
} from './userSlice';
import type { UserState } from './userSlice';

describe('userSlice reducer', () => {
  const mockUser = {
    email: 'test@test.com',
    name: 'Test User'
  } as any;

  it('установка флага первичной проверки аутентификации', () => {
    const state = userReducer(initialState, authChecked());

    expect(state.isAuthChecked).toBe(true);
  });

  it('сброс пользователя', () => {
    const filledState: UserState = {
      ...initialState,
      user: mockUser
    };
    const state = userReducer(filledState, clearUser());

    expect(state.user).toBeNull();
  });

  it('очистка ошибки', () => {
    const filledState: UserState = {
      ...initialState,
      error: 'Ошибка'
    };
    const state = userReducer(filledState, clearError());

    expect(state.error).toBeNull();
  });

  // getUser
  it('хендлер для getUserThunk.pending', () => {
    const state = userReducer(initialState, {
      type: getUserThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для getUserThunk.rejected', () => {
    const loadingState: UserState = {
      ...initialState,
      isLoading: true
    };
    const state = userReducer(loadingState, {
      type: getUserThunk.rejected.type
    });

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toBeNull();
  });

  it('хендлер для getUserThunk.fulfilled', () => {
    const state = userReducer(initialState, {
      type: getUserThunk.fulfilled.type,
      payload: { user: mockUser }
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(true);
  });

  // register
  it('хендлер для registerUserThunk.pending', () => {
    const state = userReducer(initialState, {
      type: registerUserThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для registerUserThunk.rejected', () => {
    const loadingState: UserState = {
      ...initialState,
      isLoading: true
    };
    const state = userReducer(loadingState, {
      type: registerUserThunk.rejected.type,
      error: { message: 'Ошибка регистрации' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка регистрации');
  });

  it('хендлер для registerUserThunk.fulfilled', () => {
    const state = userReducer(initialState, {
      type: registerUserThunk.fulfilled.type,
      payload: mockUser
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  // update
  it('хендлер для updateUserThunk.pending', () => {
    const state = userReducer(initialState, {
      type: updateUserThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для updateUserThunk.rejected', () => {
    const state = userReducer(initialState, {
      type: updateUserThunk.rejected.type,
      error: { message: 'Ошибка обновления' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка обновления');
  });

  it('хендлер для updateUserThunk.fulfilled', () => {
    const state = userReducer(initialState, {
      type: updateUserThunk.fulfilled.type,
      payload: { user: mockUser }
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });

  // login
  it('хендлер для loginUserThunk.pending', () => {
    const state = userReducer(initialState, {
      type: loginUserThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для loginUserThunk.rejected', () => {
    const state = userReducer(initialState, {
      type: loginUserThunk.rejected.type,
      error: { message: 'Ошибка входа' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка входа');
  });

  it('хендлер для loginUserThunk.fulfilled', () => {
    const state = userReducer(initialState, {
      type: loginUserThunk.fulfilled.type,
      payload: mockUser
    });

    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.error).toBeNull();
  });
});
