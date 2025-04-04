import { configureStore } from '@reduxjs/toolkit';
import stellarBurgerSlice, {
  addIngredient,
  closeModal,
  closeOrderRequest,
  deleteIngredient,
  init,
  moveIngredientDown,
  moveIngredientUp,
  openModal,
  removeErrorText,
  removeOrders,
  removeUserOrders,
  selectConstructorItems,
  selectErrorText,
  selectIsInit,
  selectIsModalOpened,
  selectOrderModalData,
  selectOrderRequest,
  selectOrders,
  selectUserOrders,
  setErrorText
} from '../stellar-burger-slice';
import { mockBun, mockIngredient, mockStore } from '../mockData';

// Функция для адаптации моковых данных к ожидаемому формату
const adaptIngredient = (ingredient: typeof mockIngredient) => ({
  ...ingredient,
  id: ingredient._id // Добавляем поле id на основе _id
});

// Создаём тестовый Redux-стор с предзагруженным состоянием из mockStore.
function initStore() {
  return configureStore({
    reducer: {
      stellarBurger: stellarBurgerSlice // Подключаем редьюсер
    },
    preloadedState: {
      stellarBurger: mockStore // Начальное состояние из мок-данных
    }
  });
}

describe('Test actions', () => {
  test('Test deleteIngredient', () => {
    const store = initStore();
    const initialState = selectConstructorItems(store.getState());
    const initialCount = initialState.ingredients.length;

    store.dispatch(deleteIngredient(adaptIngredient(mockIngredient)));

    const newState = selectConstructorItems(store.getState());
    expect(newState.ingredients.length).toBe(initialCount - 1);
  });

  test('Test addIngredient', () => {
    const store = initStore();
    const initialState = selectConstructorItems(store.getState());
    const initialIngredientCount = initialState.ingredients.length;
    // Добавляем обычный ингредиент
    store.dispatch(addIngredient(adaptIngredient(mockIngredient)));
    // Добавляем булку (должна сохраниться в bun, а не в ingredients)
    store.dispatch(addIngredient(adaptIngredient(mockBun)));

    const newState = selectConstructorItems(store.getState());
    expect(newState.ingredients.length).toEqual(initialIngredientCount + 1);
    expect(newState.bun?.name).toEqual(mockBun.name);
  });

  test('Test closeOrderRequest', () => {
    const store = initStore();
    store.dispatch(closeOrderRequest());

    const orderRequest = selectOrderRequest(store.getState());
    const orderModalData = selectOrderModalData(store.getState());
    const constructorItems = selectConstructorItems(store.getState());

    expect(orderRequest).toBe(false);
    expect(orderModalData).toBe(null);
    expect(constructorItems).toEqual({
      bun: {
        price: 0
      },
      ingredients: []
    });
  });

  test('Test removeOrders', () => {
    const store = initStore();
    const initialOrders = selectOrders(store.getState()).length;
    store.dispatch(removeOrders());
    const orders = selectOrders(store.getState()).length;
    expect(initialOrders).toBe(2);
    expect(orders).toBe(0);
  });

  test('Test removeUserOrders', () => {
    const store = initStore();
    const initialOrders = selectUserOrders(store.getState())!.length;
    store.dispatch(removeUserOrders());
    const orders = selectUserOrders(store.getState());
    expect(initialOrders).toBe(2);
    expect(orders).toBe(null);
  });

  test('Test init', () => {
    const store = initStore();
    const beforeInit = selectIsInit(store.getState());
    store.dispatch(init());
    const afterInit = selectIsInit(store.getState());
    expect(beforeInit).toBe(false);
    expect(afterInit).toBe(true);
  });

  test('Test openModal', () => {
    const store = initStore();
    const beforeOpen = selectIsModalOpened(store.getState());
    store.dispatch(openModal());
    const afterOpen = selectIsModalOpened(store.getState());
    expect(beforeOpen).toBe(false);
    expect(afterOpen).toBe(true);
  });

  test('Test closeModal', () => {
    const store = initStore();
    store.dispatch(closeModal());
    const isOpen = selectIsModalOpened(store.getState());
    expect(isOpen).toBe(false);
  });

  test('Test setErrorText', () => {
    const store = initStore();
    store.dispatch(setErrorText('my test error'));
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('my test error');
  });

  test('Test removeErrorText', () => {
    const store = initStore();
    store.dispatch(setErrorText('Error here!'));
    store.dispatch(removeErrorText());
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('');
  });

  test('Test moveIngredientUp', () => {
    const store = initStore();
    let ingredients = selectConstructorItems(store.getState()).ingredients;
    const lastIngredient = ingredients[ingredients.length - 1];

    store.dispatch(moveIngredientUp(adaptIngredient(lastIngredient)));

    ingredients = selectConstructorItems(store.getState()).ingredients;

    expect(ingredients[ingredients.length - 2]).toEqual(lastIngredient);
  });

  test('Test moveIngredientDown', () => {
    const store = initStore();
    let ingredients = selectConstructorItems(store.getState()).ingredients;
    const firstIngredient = ingredients[0];

    store.dispatch(moveIngredientDown(adaptIngredient(firstIngredient)));

    ingredients = selectConstructorItems(store.getState()).ingredients;

    expect(ingredients[1]).toEqual(firstIngredient);
  });
});
