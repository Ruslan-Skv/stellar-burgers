import { expect, test, describe, jest } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';

import { mockStore } from '../mockData';
import stellarBurgerSlice, { selectConstructorItems, selectErrorText, selectIngredients, selectIsAuthenticated, selectIsInit, selectIsModalOpened, selectLoading, selectOrderModalData, selectOrderRequest, selectOrders, selectTodayOrders, selectTotalOrders, selectUser, selectUserOrders } from '../stellar-burger-slice';


let store = configureStore({
  reducer: {
    stellarBurger: stellarBurgerSlice 
  },
  preloadedState: {
    stellarBurger: mockStore 
  }
});

// Описываем набор тестов для селекторов
describe('Test selectors', () => {
  // Тест селектора данных пользователя
  test('Test selectUser', () => {
    const user = selectUser(store.getState()); // Получаем данные пользователя
    expect(user).toEqual({
      name: 'testUser',
      email: 'test@gmail.com'
    }); // Проверяем соответствие моковым данным
  });

  // Тест селектора флага инициализации
  test('Test selectIsInit', () => {
    const isInit = selectIsInit(store.getState());
    expect(isInit).toBe(false); // Ожидаем false, как в моковых данных
  });

  // Тест селектора состояния модального окна
  test('Test selectIsModalOpened', () => {
    const isModalOpened = selectIsModalOpened(store.getState());
    expect(isModalOpened).toBe(false); // Ожидаем закрытое состояние
  });

  // Тест селектора текста ошибки
  test('Test selectErrorText', () => {
    const errorText = selectErrorText(store.getState());
    expect(errorText).toBe('test error ......'); // Проверяем текст из моковых данных
  });

  // Тест селектора аутентификации
  test('Test selectIsAuthenticated', () => {
    const isAuthenticated = selectIsAuthenticated(store.getState());
    expect(isAuthenticated).toBe(true); // Ожидаем true из моковых данных
  });

  // Тест селектора состояния загрузки
  test('Test selectLoading', () => {
    const loading = selectLoading(store.getState());
    expect(loading).toBe(false); // Ожидаем false (нет загрузки)
  });

  // Тест селектора состояния запроса заказа
  test('Test selectOrderRequest', () => {
    const orderRequest = selectOrderRequest(store.getState());
    expect(orderRequest).toBe(false); // Ожидаем false (нет активного запроса)
  });

  // Тест селектора общего количества заказов
  test('Test selectTotalOrders', () => {
    const totalOrders = selectTotalOrders(store.getState());
    expect(totalOrders).toBe(73600); // Проверяем значение из моковых данных
  });

  // Тест селектора количества заказов за сегодня
  test('Test selectTodayOrders', () => {
    const todayOrders = selectTodayOrders(store.getState());
    expect(todayOrders).toBe(10); // Проверяем значение из моковых данных
  });

  // Тест селектора списка ингредиентов
  test('Test selectIngredients', () => {
    const ingredients = selectIngredients(store.getState());
    expect(ingredients).toEqual(mockStore.ingredients); // Сравниваем с моковыми данными
  });

  // Тест селектора ингредиентов в конструкторе
  test('Test selectConstructorItems', () => {
    const constructorItems = selectConstructorItems(store.getState());
    expect(constructorItems).toEqual(mockStore.constructorItems); // Полное сравнение объекта
  });

  // Тест селектора данных модального окна заказа
  test('Test selectOrderModalData', () => {
    const orderModalData = selectOrderModalData(store.getState());
    expect(orderModalData).toEqual(mockStore.orderModalData); // Сравниваем сложный объект
  });

  // Тест селектора списка заказов
  test('Test selectOrders', () => {
    const orders = selectOrders(store.getState());
    expect(orders).toEqual(mockStore.orders); // Сравниваем массив заказов
  });

  // Тест селектора заказов пользователя
  test('Test selectUserOrders', () => {
    const userOrders = selectUserOrders(store.getState());
    expect(userOrders).toEqual(mockStore.userOrders); // Сравниваем массив заказов
  });
});
