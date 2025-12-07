import burgerReducer, {
  addItem,
  removeItem,
  moveItemUp,
  moveItemDown,
  clearConstructor,
  initialState,
  orderBurgerThunk,
  clearOrderModal
} from './burgerSlice';
import type { BurgerState } from './burgerSlice';
import type { TConstructorIngredient, TIngredient } from '@utils-types';

const createIngredient = (
  id: string,
  type: 'bun' | 'sauce' | 'main'
): TIngredient => ({
  _id: id,
  name: `ingredient-${id}`,
  type,
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 10,
  price: 100,
  image: '',
  image_mobile: '',
  image_large: ''
});

const createFilledState = (): BurgerState => {
  const bun: TConstructorIngredient = {
    ...createIngredient('_', 'bun'),
    id: '_'
  };
  const ingredient1: TConstructorIngredient = {
    ...createIngredient('1', 'main'),
    id: 'a'
  };
  const ingredient2: TConstructorIngredient = {
    ...createIngredient('2', 'sauce'),
    id: 'b'
  };

  return {
    ...initialState,
    constructorItems: {
      bun,
      ingredients: [ingredient1, ingredient2]
    }
  };
};

describe('burgerSlice reducer', () => {
  it('добавление булки', () => {
    const bun = createIngredient('1', 'bun');
    const state = burgerReducer(initialState, addItem(bun));

    expect(state.constructorItems.bun?._id).toBe('1');
    expect(state.constructorItems.bun).toHaveProperty('id');
    expect(state.constructorItems.ingredients.length).toBe(0);
  });

  it('замена булки', () => {
    const bun2 = createIngredient('bun-2', 'bun');
    const state = createFilledState();
    const newState = burgerReducer(state, addItem(bun2));

    expect(newState.constructorItems.bun?._id).toBe('bun-2');
    expect(newState.constructorItems.bun).toHaveProperty('id');
  });

  it('добавление начинки', () => {
    const ingredient = createIngredient('1', 'main');
    const state = burgerReducer(initialState, addItem(ingredient));

    expect(state.constructorItems.ingredients.length).toBe(1);
    expect(state.constructorItems.ingredients[0]._id).toBe('1');
    expect(state.constructorItems.ingredients[0]).toHaveProperty('id');
  });

  it('добавление соуса', () => {
    const ingredient = createIngredient('1', 'sauce');
    const state = burgerReducer(initialState, addItem(ingredient));

    expect(state.constructorItems.ingredients.length).toBe(1);
    expect(state.constructorItems.ingredients[0]._id).toBe('1');
    expect(state.constructorItems.ingredients[0]).toHaveProperty('id');
  });

  it('удаление ингредиента по id', () => {
    const state = createFilledState();
    const newState = burgerReducer(state, removeItem('a'));

    expect(newState.constructorItems.ingredients.length).toBe(1);
    expect(newState.constructorItems.ingredients[0].id).toBe('b');
  });

  it('перемещение ингредиента вверх', () => {
    const state = createFilledState();
    const newState = burgerReducer(state, moveItemUp(1));

    expect(newState.constructorItems.ingredients[0].id).toBe('b');
    expect(newState.constructorItems.ingredients[1].id).toBe('a');
  });

  it('перемещение ингредиента вниз', () => {
    const state = createFilledState();
    const newState = burgerReducer(state, moveItemDown(0));

    expect(newState.constructorItems.ingredients[0].id).toBe('b');
    expect(newState.constructorItems.ingredients[1].id).toBe('a');
  });

  it('не должен ломать массив при неверном индексе вверх', () => {
    const state = createFilledState();
    const newState = burgerReducer(state, moveItemUp(0));

    expect(newState.constructorItems.ingredients[0].id).toBe('a');
  });

  it('не должен ломать массив при неверном индексе вниз', () => {
    const state = createFilledState();
    const newState = burgerReducer(state, moveItemDown(1));

    expect(newState.constructorItems.ingredients[1].id).toBe('b');
  });

  it('сброс конструктора', () => {
    const state = createFilledState();
    const newState = burgerReducer(state, clearConstructor());

    expect(newState.constructorItems.bun).toBeNull();
    expect(newState.constructorItems.ingredients.length).toBe(0);
  });

  it('сброс модалки', () => {
    const state = {
      ...initialState,
      orderRequest: true,
      orderModalData: { number: 123456 } as any
    };
    const newState = burgerReducer(state, clearOrderModal());

    expect(newState.orderModalData).toBeNull();
  });

  it('хендлер для orderBurgerThunk.pending', () => {
    const state = burgerReducer(initialState, {
      type: orderBurgerThunk.pending.type // action
    });

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orderModalData).toBeNull();
  });

  it('хендлер для orderBurgerThunk.fulfilled', () => {
    const mockOrder = { number: 123456 } as any;
    const state = burgerReducer(initialState, {
      type: orderBurgerThunk.fulfilled.type,
      payload: { order: mockOrder }
    });

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('orderBurgerThunk.rejected → error установлен', () => {
    const state = burgerReducer(initialState, {
      type: orderBurgerThunk.rejected.type,
      error: { message: 'Ошибка заказа' }
    });

    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка заказа');
  });
});
