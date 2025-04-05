import { expect, test, describe, jest, afterAll, beforeEach } from '@jest/globals';
import * as API from '../burger-api';

// Сохраняем оригинальные реализации для восстановления после тестов
const originalFetch = global.fetch;
const originalDocument = global.document;
const originalLocalStorage = global.localStorage;

/**
 * Вспомогательная функция для создания мокового ответа fetch
 * @param data - Данные для возврата в ответе
 * @param ok - Флаг успешности запроса (по умолчанию true)
 * @returns Промис с моковым ответом
 */
async function getMockResponse(data: any, ok: boolean = true) {
  return Promise.resolve({
    ok, // Статус успешности запроса
    json: () => Promise.resolve(data),
    status: ok ? 200 : 400 
  });
}

// Восстановление оригинальных реализаций после всех тестов
afterAll(() => {
    global.fetch = originalFetch;
    global.document = originalDocument;
    global.localStorage = originalLocalStorage;
  });

  // Сброс моков перед каждым тестом
beforeEach(() => {
    jest.clearAllMocks();
  });

// Описываем тестовый набор для API
describe('API tests', () => {
  // Мокаем глобальные объекты document и localStorage
  beforeEach(() => {
    global.document = { cookie: 'accessToken=test_val' } as any;
    global.localStorage = { 
      getItem: jest.fn(() => 'testItem'), 
      setItem: jest.fn() 
    }  as any;
  });

  // Моковые данные для успешного ответа
  const mockData = {
    success: true,
    data: 'test data',
    orders: ['test1', 'test2']
  };

  // Моковые данные для ошибки
  const mockError = {
    success: false,
    name: 'error',
    message: 'jwt expired'
  };

  // Тест для refreshToken (успешный сценарий)
  test('Test refreshTokenApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const spy = jest.spyOn(API, 'refreshToken');
    const res = await API.refreshToken();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для refreshToken (ошибочный сценарий)
  test('Test refreshTokenApi fail ok=false', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError, false)) as any;
    await API.refreshToken().catch((err) => expect(err).toEqual(mockError));
  });

  // Тест для getIngredientsApi (успешный сценарий)
  test('Test getIngredientsApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const spy = jest.spyOn(API, 'getIngredientsApi');
    const res = await API.getIngredientsApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData.data);
  });

  // Тест для getIngredientsApi (ошибочный сценарий)
  test('Test getIngredientsApi fail', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    await API.getIngredientsApi().catch((err) =>
      expect(err).toEqual(mockError)
    );
  });

  // Тест для getFeedsApi (успешный сценарий)
  test('Test getFeedsApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const spy = jest.spyOn(API, 'getFeedsApi');
    const res = await API.getFeedsApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для getFeedsApi (ошибочный сценарий)
  test('Test getFeedsApi fail', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    await API.getFeedsApi().catch((err) => expect(err).toEqual(mockError));
  });

  // Тест для getOrdersApi (успешный сценарий)
  test('Test getOrdersApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const spy = jest.spyOn(API, 'getOrdersApi');
    const res = await API.getOrdersApi();

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData.orders);
  });

  // Тест для getOrdersApi (ошибочный сценарий)
  test('Test getOrdersApi fail', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    await API.getOrdersApi().catch((err) => expect(err).toEqual(mockError));
  });

  // Тест для orderBurgerApi (успешный сценарий)
  test('Test orderBurgerApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const burger = ['testid1', 'testid2', 'testid1'];
    const spy = jest.spyOn(API, 'orderBurgerApi');
    const res = await API.orderBurgerApi(burger);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для orderBurgerApi (ошибочный сценарий)
  test('Test orderBurgerApi fail', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    const burger = ['testid1', 'testid2', 'testid1'];
    await API.orderBurgerApi(burger).catch((err) =>
      expect(err).toEqual(mockError)
    );
  });

  // Тест для getOrderByNumberApi
  test('Test getOrderByNumberApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const spy = jest.spyOn(API, 'getOrderByNumberApi');
    const res = await API.getOrderByNumberApi(123);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для registerUserApi (успешный сценарий)
  test('Test registerUserApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const mockUserData = {
      name: 'name',
      email: 'test@mail.com',
      password: 'test'
    };
    const spy = jest.spyOn(API, 'registerUserApi');
    const res = await API.registerUserApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для registerUserApi (ошибочный сценарий)
  test('Test registerUserApi fail', async () => {
    const mockUserData = {
      name: 'name',
      email: 'test@mail.com',
      password: 'test'
    };
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    await API.registerUserApi(mockUserData).catch((err) =>
      expect(err).toEqual(mockError)
    );
  });

  // Тест для loginUserApi (успешный сценарий)
  test('Test loginUserApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const mockUserData = { email: 'test@mail.com', password: 'test' };
    const spy = jest.spyOn(API, 'loginUserApi');
    const res = await API.loginUserApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для loginUserApi (ошибочный сценарий)
  test('Test loginUserApi fail', async () => {
    const mockUserData = { email: 'test@mail.com', password: 'test' };
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    await API.loginUserApi(mockUserData).catch((err) =>
      expect(err).toEqual(mockError)
    );
  });

  // Тест для forgotPasswordApi (успешный сценарий)
  test('Test forgotPasswordApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const mockUserData = { email: 'test@mail.com' };
    const spy = jest.spyOn(API, 'forgotPasswordApi');
    const res = await API.forgotPasswordApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для forgotPasswordApi (ошибочный сценарий)
  test('Test forgotPasswordApi fail', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    await API.forgotPasswordApi({ email: 'test@mail.com' }).catch((err) =>
      expect(err).toEqual(mockError)
    );
  });

  // Тест для resetPasswordApi (успешный сценарий)
  test('Test resetPasswordApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const mockUserData = { password: 'test', token: 'testtoken' };
    const spy = jest.spyOn(API, 'resetPasswordApi');
    const res = await API.resetPasswordApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для resetPasswordApi (ошибочный сценарий)
  test('Test resetPasswordApi fail', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockError)) as any;
    const mockUserData = { password: 'test', token: 'testtoken' };
    await API.resetPasswordApi(mockUserData).catch((err) =>
      expect(err).toEqual(mockError)
    );
  });

  // Тест для getUserApi
  test('Test getUserApi', async () => {
    // Подменяем глобальный fetch на моковую реализацию
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    // Создаем шпиона для отслеживания вызовов getUserApi
    const spy = jest.spyOn(API, 'getUserApi');
    // Вызываем тестируемую функцию
    const res = await API.getUserApi();

    // Проверяем, что функция была вызвана
    expect(spy).toHaveBeenCalled();
    // Проверяем, что результат соответствует ожидаемым данным
    expect(res).toEqual(mockData);
  });

  // Тест для updateUserApi
  test('Test updateUser', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const mockUserData = { name: 'test', email: 'test@mail.com' };
    const spy = jest.spyOn(API, 'updateUserApi');
    const res = await API.updateUserApi(mockUserData);

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });

  // Тест для logoutApi
  test('Test logoutApi', async () => {
    global.fetch = jest.fn(() => getMockResponse(mockData)) as any;
    const spy = jest.spyOn(API, 'logoutApi');
    const res = await API.logoutApi('');

    expect(spy).toHaveBeenCalled();
    expect(res).toEqual(mockData);
  });
});
