import { getIngredientsApi } from '@api';
import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { RootState } from './store';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  getIngredientsApi
);

export interface IngredientsState {
  isLoading: boolean;
  ingredients: TIngredient[];
  error: string | null;
}

const initialState: IngredientsState = {
  isLoading: false,
  ingredients: [],
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Unknown error';
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, action) => {
      state.isLoading = false;
      state.ingredients = action.payload;
      state.error = null;
    });
  }
});

// базовый селектор, достаёт из стора нужный нам стейт (его можно указать также
// в selectors слайса и потом обращатся к нему через ingredientsSlice.selectors)
const ingredientsSelector = (store: RootState) => store.ingredients.ingredients;

// производные селекторы, мемоизация вшита под капотом фунции createSelector
// (если указывать селекторы просто в selectors слайса - мемоизации не будет)
export const selectBuns = createSelector([ingredientsSelector], (ingredients) =>
  ingredients.filter((ingredient) => ingredient.type === 'bun')
);
export const selectMains = createSelector(
  [ingredientsSelector],
  (ingredients) =>
    ingredients.filter((ingredient) => ingredient.type === 'main')
);
export const selectSauces = createSelector(
  [ingredientsSelector],
  (ingredients) =>
    ingredients.filter((ingredient) => ingredient.type === 'sauce')
);

export default ingredientsSlice.reducer;
