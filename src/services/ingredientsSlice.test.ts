import ingredientsReducer, {
  getIngredientsThunk,
  initialState
} from './ingredientsSlice';
import type { IngredientsState } from './ingredientsSlice';
import type { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  it('хендлер для getIngredientsThunk.pending', () => {
    const state = ingredientsReducer(initialState, {
      type: getIngredientsThunk.pending.type
    });

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('хендлер для getIngredientsThunk.fulfilled', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: '1',
        type: 'bun',
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        calories: 10,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];
    const loadingState: IngredientsState = {
      ...initialState,
      isLoading: true
    };
    const state = ingredientsReducer(loadingState, {
      type: getIngredientsThunk.fulfilled.type,
      payload: mockIngredients
    });

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('хендлер для getIngredientsThunk.rejected', () => {
    const loadingState: IngredientsState = {
      ...initialState,
      isLoading: true
    };
    const state = ingredientsReducer(loadingState, {
      type: getIngredientsThunk.rejected.type,
      error: { message: 'Ошибка загрузки инградиентов' }
    });

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки инградиентов');
  });
});
