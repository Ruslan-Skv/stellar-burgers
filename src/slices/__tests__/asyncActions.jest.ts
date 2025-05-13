import { expect, test, describe, jest } from '@jest/globals';
import stellarBurgerSlice, {
  fetchFeed,
  fetchIngredients,
  fetchLoginUser,
  fetchLogout,
  fetchNewOrder,
  fetchRegisterUser,
  fetchUpdateUser,
  fetchUserOrders,
  getUserThunk,
  initialState
} from '../stellar-burger-slice';

describe('Тест async actions', () => {
  // Тест для состояния pending при запросе данных пользователя
  test('Тест getUserThunk pending', () => {
    // Вызываем редьюсер с действием getUserThunk.pending
    const state = stellarBurgerSlice(initialState, getUserThunk.pending(''));

    // Проверяем что флаг загрузки установлен в true
    expect(state.loading).toBe(true);
  });

  // Тест для успешного получения данных пользователя
  test('Тест getUserThunk fullfiled', () => {
    // Моковые данные пользователя
    const mockResponse = {
      success: true,
      user: { name: 'user', email: 'user@mail.ru' }
    };
    // Вызываем редьюсер с успешным действием
    const state = stellarBurgerSlice(
      initialState,
      getUserThunk.fulfilled(mockResponse, '')
    );

    // Проверяем что данные пользователя обновились
    expect(state.user).toEqual(mockResponse.user);
  });

  // Тест для ошибки при получении данных пользователя
  test('Тест getUserTnunk rejected', () => {
    // Моковая ошибка
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    // Вызываем редьюсер с действием ошибки
    const state = stellarBurgerSlice(
      initialState,
      getUserThunk.rejected(mockAnswer, '')
    );

    // Проверяем что:
    // 1. Флаг загрузки сброшен
    // 2. Флаг аутентификации false
    // 3. Данные пользователя сброшены
    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
  });

  // Тест для состояния pending при загрузке ингредиентов
  test('Тест fetchIngredients pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchIngredients.pending('')
    );

    expect(state.loading).toBe(true);
  });

  // Тест для успешной загрузки ингредиентов
  test('Тест fetchIngredients fulfilled', () => {
    // Моковые данные ингредиентов
    const mockResponse = [
      {
        _id: '643d69a5c3f7b9001cfa093d',
        name: 'Флюоресцентная булка R2-D3',
        type: 'bun',
        proteins: 44,
        fat: 26,
        carbohydrates: 85,
        calories: 643,
        price: 988,
        image: 'https://code.s3.yandex.net/react/code/bun-01.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
      }
    ];
    const state = stellarBurgerSlice(
      initialState,
      fetchIngredients.fulfilled(mockResponse, '')
    );

    // Проверяем что:
    // 1. Флаг загрузки сброшен
    // 2. Список ингредиентов обновлен
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(mockResponse);
  });

  // Тест для ошибки при загрузке ингредиентов
  test('Тест fetchIngredients rejected', () => {
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchIngredients.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
  });

  // Тест для состояния pending при создании нового заказа
  test('Тест fetchNewOrder pending', () => {
    const mockOrder = ['testid1', 'testid2', 'testid3'];
    const state = stellarBurgerSlice(
      initialState,
      fetchNewOrder.pending('', mockOrder)
    );

    // Проверяем что флаг запроса заказа установлен
    expect(state.orderRequest).toBe(true);
  });

  // Тест для ошибки при создании заказа
  test('Тест fetchNewOrder rejected', () => {
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchNewOrder.rejected(mockAnswer, '', [''])
    );

    // Проверяем что флаг запроса сброшен
    expect(state.orderRequest).toBe(false);
  });

  // Тест для успешного создания заказа
  test('Тест fetchNewOrder fulfilled', () => {
    // Моковые данные заказа
    const mockResponse = {
      success: true,
      name: 'testname',
      order: {
        _id: '67f0dd26e8e61d001cec084f',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa0940',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Флюоресцентный метеоритный бургер',
        createdAt: '2025-04-05T07:35:02.385Z',
        updatedAt: '2025-04-05T07:35:03.075Z',
        number: 73501
      }
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchNewOrder.fulfilled(mockResponse, '', [''])
    );

    // Проверяем что:
    // 1. Данные модального окна обновлены
    // 2. Флаг запроса сброшен
    expect(state.orderModalData).toEqual(mockResponse.order);
    expect(state.orderRequest).toBe(false);
  });

  test('Тест fetchLoginUser pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchLoginUser.pending('', { email: 'test@mail.ru', password: 'test' })
    );

    expect(state.loading).toBe(true);
  });

  test('Тест fetchLoginUser rejected', () => {
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchLoginUser.rejected(mockAnswer, '', {
        email: 'test@mail.ru',
        password: 'test'
      })
    );

    expect(state.loading).toBe(false);
    expect(state.errorText).toBe('Произошла ошибка');
  });

  test('Тест fetchLoginUser fulfiled', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchLoginUser.fulfilled(
        {
          success: true,
          refreshToken: 'testtoken',
          accessToken: 'testaccess',
          user: { name: 'testuser', email: 'testuser@mail.ru' }
        },
        '',
        { password: 'testuser', email: 'testuser@mail.ru' }
      )
    );

    expect(state.loading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
  });

  test('Тест fetchRegisterUser pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.pending(
        '',
        { name: 'user', email: 'test@mail.ru', password: 'test' },
        ''
      )
    );

    expect(state.loading).toBe(true);
  });

  test('Тест fetchRegisterUser rejected', () => {
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.rejected(mockAnswer, '', {
        name: 'user',
        email: 'test@mail.ru',
        password: 'test'
      })
    );

    expect(state.loading).toBe(false);
    expect(state.errorText).toBe('Произошла ошибка');
  });

  test('Тест fetchRegisterUser fulfilled', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchRegisterUser.fulfilled(
        {
          success: true,
          refreshToken: 'testtoken',
          accessToken: 'testaccess',
          user: { name: 'testuser', email: 'testuser@mail.ru' }
        },
        '',
        { name: 'user', password: 'testuser', email: 'testuser@mail.ru' }
      )
    );

    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  test('Тест fetchFeed pending', () => {
    const state = stellarBurgerSlice(initialState, fetchFeed.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тест fetchFeed rejected', () => {
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchFeed.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тест fetchFeed fulfilled', () => {
    const mockResponse = {
      success: true,
      total: 100,
      totalToday: 10,
      orders: [
        {
          _id: '67f0dd26e8e61d001cec084f',
          ingredients: [
            '643d69a5c3f7b9001cfa093d',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa0940',
            '643d69a5c3f7b9001cfa093d'
          ],
          status: 'done',
          name: 'Флюоресцентный метеоритный бургер',
          createdAt: '2025-04-05T07:35:02.385Z',
          updatedAt: '2025-04-05T07:35:03.075Z',
          number: 73501
        }
      ]
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchFeed.fulfilled(mockResponse, '')
    );

    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockResponse.orders);
    expect(state.totalOrders).toEqual(mockResponse.total);
    expect(state.ordersToday).toEqual(mockResponse.totalToday);
  });

  test('Тест fetchUserOrders pending', () => {
    const state = stellarBurgerSlice(initialState, fetchUserOrders.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тест fetchUserOrders rejected', () => {
    const mockAnswer = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchUserOrders.rejected(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тест fetchUserOrders fulfilled', () => {
    const mockResponse = [
      {
        _id: '664e927097ede0001d06bdb9',
        ingredients: [
          '643d69a5c3f7b9001cfa093d',
          '643d69a5c3f7b9001cfa093e',
          '643d69a5c3f7b9001cfa093d'
        ],
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2024-05-23T00:48:48.039Z',
        updatedAt: '2024-05-23T00:48:48.410Z',
        number: 40680
      }
    ];
    const state = stellarBurgerSlice(
      initialState,
      fetchUserOrders.fulfilled(mockResponse, '')
    );

    expect(state.loading).toBe(false);
    expect(state.userOrders).toEqual(mockResponse);
  });

  test('Тест fetchLogout pending', () => {
    const state = stellarBurgerSlice(initialState, fetchLogout.pending(''));

    expect(state.loading).toBe(true);
  });

  test('Тест fetchLogout rejected', () => {
    const mockError = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchLogout.rejected(mockError, '')
    );

    expect(state.loading).toBe(false);
  });

  test('Тест fetchLogout fulfilled', () => {
    const mockAnswer = { success: true };
    const state = stellarBurgerSlice(
      initialState,
      fetchLogout.fulfilled(mockAnswer, '')
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
    expect(state.isAuthenticated).toBe(false);
  });

  test('Тест fetchUpdateUser pending', () => {
    const state = stellarBurgerSlice(
      initialState,
      fetchUpdateUser.pending('', { name: 'test' })
    );
    expect(state.loading).toBe(true);
  });

  test('Тест fetchUpdateUser rejected', () => {
    const mockError = { name: 'test', message: 'Произошла ошибка' };
    const state = stellarBurgerSlice(
      initialState,
      fetchUpdateUser.rejected(mockError, '', { name: 'test' })
    );
    expect(state.loading).toBe(false);
  });

  test('Тест fetchUpdateUser fulfilled', () => {
    const mockUser = { name: 'testuser', email: 'changedEmail@mail.ru' };
    const mockResponse = {
      success: true,
      user: mockUser
    };
    const state = stellarBurgerSlice(
      initialState,
      fetchUpdateUser.fulfilled(mockResponse, '', mockUser)
    );

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
  });
});
