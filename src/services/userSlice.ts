import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
// import { deleteCookie, setCookie } from '@utils-cookie';
import { deleteCookie, setCookie } from '../utils/cookie';
import { clearUserOrders, getUserOrdersThunk } from './ordersSlice';

export type TTokens = {
  accessToken: string;
  refreshToken: string;
};

export const setTokens = ({ accessToken, refreshToken }: TTokens) => {
  localStorage.setItem('refreshToken', refreshToken);
  setCookie('accessToken', accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};

export const getUserThunk = createAsyncThunk(
  'users/getUser',
  // getUserApi
  // async () => getUserApi()
  async (_, thunkAPI) => {
    try {
      const response = await getUserApi();
      // thunkAPI.dispatch(getUserOrdersThunk());
      return response;
    } catch (err) {
      // thunkAPI.dispatch(clearUser()); // reject сам это сделает
      thunkAPI.dispatch(clearUserOrders());
      clearTokens();
      throw err;
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async (data: TRegisterData) => {
    const { accessToken, refreshToken, user } = await registerUserApi(data);
    setTokens({ accessToken, refreshToken });
    return user;
  }
);

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  updateUserApi
  // async (data: Partial<TRegisterData>) => updateUserApi(data)
);

export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async (data: TLoginData, thunkAPI) => {
    const { accessToken, refreshToken, user } = await loginUserApi(data);
    setTokens({ accessToken, refreshToken });
    // thunkAPI.dispatch(getUserOrdersThunk());
    return user;
  }
);

export const logoutUserThunk = createAsyncThunk(
  'users/logoutUser',
  async (_, thunkAPI) => {
    try {
      await logoutApi();
      thunkAPI.dispatch(clearUser());
      thunkAPI.dispatch(clearUserOrders());
      clearTokens();
    } catch (err) {
      thunkAPI.dispatch(clearUser());
      thunkAPI.dispatch(clearUserOrders());
      clearTokens();
      throw err;
    }
  }
);

export interface UserState {
  isAuthChecked: boolean;
  isLoading: boolean;
  user: TUser | null;
  error: string | null;
}

export const initialState: UserState = {
  isAuthChecked: false,
  isLoading: false,
  user: null,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
    clearUser: (state) => {
      state.user = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // getUser
    builder.addCase(getUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthChecked = true;
      state.user = null;
    });
    builder.addCase(getUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      state.isAuthChecked = true;
    });

    // register
    builder.addCase(registerUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    });

    // update
    builder.addCase(updateUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
    });

    // login
    builder.addCase(loginUserThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    });
  }
});

export const { authChecked, clearUser, clearError } = userSlice.actions;

export default userSlice.reducer;
