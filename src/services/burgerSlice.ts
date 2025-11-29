import { orderBurgerApi, TNewOrderResponse } from '@api';
import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { getFeedThunk } from './feedSlice';
import { getUserOrdersThunk } from './ordersSlice';
import { RootState } from './store';

export const orderBurgerThunk = createAsyncThunk<
  TNewOrderResponse, // тип того, что вернёт API
  void, // payload из компонента не нужен
  { state: RootState }
>('burger/orderBurger', async (_, thunkAPI) => {
  const state = thunkAPI.getState();
  const { bun, ingredients } = state.burger.constructorItems;
  if (!bun) {
    throw new Error('Булка не выбрана');
  }
  const ingredientIds: string[] = [
    bun._id,
    ...ingredients.map((ingredient) => ingredient._id)
  ];
  const response = await orderBurgerApi(ingredientIds);
  thunkAPI.dispatch(getFeedThunk());
  thunkAPI.dispatch(getUserOrdersThunk());
  thunkAPI.dispatch(clearConstructor());
  return response;
});

export interface BurgerState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: BurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    clearConstructor: (state) => {
      state.constructorItems = {
        bun: null,
        ingredients: []
      };
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
    addItem: (state, action: PayloadAction<TIngredient>) => {
      const itemToAdd: TConstructorIngredient = {
        ...action.payload,
        id: nanoid()
      };
      itemToAdd.type === 'bun'
        ? (state.constructorItems.bun = itemToAdd)
        : state.constructorItems.ingredients.push(itemToAdd);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload
        );
    },
    moveItemUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const items = state.constructorItems.ingredients;
      if (index <= 0 || index >= items.length) return;
      const temp = items[index - 1];
      items[index - 1] = items[index];
      items[index] = temp;
    },
    moveItemDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const items = state.constructorItems.ingredients;
      if (index < 0 || index >= items.length - 1) return;
      const temp = items[index + 1];
      items[index + 1] = items[index];
      items[index] = temp;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(orderBurgerThunk.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
      state.orderModalData = null;
    });
    builder.addCase(orderBurgerThunk.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(orderBurgerThunk.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.error = null;
      state.orderModalData = action.payload.order;
    });
  }
});

export const {
  clearConstructor,
  clearOrderModal,
  addItem,
  removeItem,
  moveItemUp,
  moveItemDown
} = burgerSlice.actions;

export default burgerSlice.reducer;
