import {
  getFeedsApi,
  getIngredientsApi,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  orderBurgerApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TUser
} from '@utils-types';
import { deleteCookie, setCookie } from '../utils/cookie';
import { v4 as uuidv4 } from 'uuid';

// type TBun = {
//   price: number | null;
// };

export type TConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

type TInitialState = {
  ingredients: TIngredient[]; // Список всех ингредиентов
  loading: boolean; // Флаг загрузки
  orderModalData: TOrder | null; // Данные для модального окна заказа
  constructorItems: TConstructorItems; // Ингредиенты в конструкторе бургера
  orderRequest: boolean; // Флаг запроса на создание заказа
  user: TUser; // Данные пользователя
  orders: TOrder[]; // Список всех заказов
  totalOrders: number; // Общее количество заказов
  ordersToday: number; // Количество заказов за сегодня
  userOrders: TOrder[] | null; // Заказы пользователя
  isAuthenticated: boolean; // Флаг аутентификации пользователя
  isInit: boolean; // Флаг инициализации приложения
  isModalOpened: boolean; // Флаг открытия модального окна
  errorText: string; // Текст ошибки
};

export const initialState: TInitialState = {
  ingredients: [],
  loading: false,
  orderModalData: null,
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  user: {
    name: '',
    email: ''
  },
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  userOrders: null,
  isAuthenticated: false,
  isInit: false,
  isModalOpened: false,
  errorText: ''
};

// Action creator для добавления ингредиента
export const addIngredientAction = (ingredient: TIngredient) => ({
  type: 'stellarBurger/addIngredient',
  payload: {
    ...ingredient,
    id: uuidv4() // Генерация uuid здесь
  }
});

const stellarBurgerSlice = createSlice({
  name: 'stellarBurger',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient & { id: string }>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload; // Добавляем булочку
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          id: action.payload.id // Используем id из payload
        });
      }
    },
    //Закрытие запроса на заказ
    closeOrderRequest(state) {
      state.orderRequest = false; // Сбрасываем флаг запроса
      state.orderModalData = null; // Очищаем данные модального окна
      state.constructorItems = {
        bun: null,
        ingredients: [] // Очищаем конструктор
      };
    },
    //Удаление заказов
    removeOrders(state) {
      state.orders.length = 0; // Очищаем список заказов
    },
    //Удаление заказов пользователя
    removeUserOrders(state) {
      state.userOrders = null;
    },
    //Инициализация приложения
    init(state) {
      state.isInit = true;
    },
    //Открытие модального окна
    openModal(state) {
      state.isModalOpened = true;
    },
    //Закрытие модального окна
    closeModal(state) {
      state.isModalOpened = false;
    },
    //Удаление ингредиента
    deleteIngredient(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        ); // Удаляем ингредиент по уникальному ID
    },
    //Установка текста ошибки
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload; // Устанавливаем текст ошибки
    },
    //Удаление текста ошибки
    removeErrorText(state) {
      state.errorText = '';
    },
    //Перемещение ингредиента вверх
    moveIngredientUp(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    //Перемещение ингредиента вниз
    moveIngredientDown(state, action: PayloadAction<TConstructorIngredient>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.id === action.payload.id
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    }
    // // Сбрасываем данные пользователя
    // resetUser(state) {
    //   state.user = { name: '', email: '' }; // Сбрасываем данные пользователя
    //   state.isAuthenticated = false; // Сбрасываем флаг аутентификации
    // }
  },
  selectors: {
    selectIngredients: (state) => state.ingredients, // Получить список ингредиентов
    selectLoading: (state) => state.loading, // Получить флаг загрузки
    selectOrderModalData: (state) => state.orderModalData, // Получить данные модального окна
    selectConstructorItems: (state) => state.constructorItems, // Получить ингредиенты в конструкторе
    selectOrderRequest: (state) => state.orderRequest, // Получить флаг, указывающий, выполняется ли в данный момент запрос на оформление заказа.
    selectUser: (state) => state.user, // Получить данные пользователя (получаем в AppHeader)
    selectOrders: (state) => state.orders, // Получить список заказов
    selectTotalOrders: (state) => state.totalOrders, // Получить общее количество заказов
    selectTodayOrders: (state) => state.ordersToday, // Получить количество заказов за сегодня
    selectUserOrders: (state) => state.userOrders, // Получить заказы пользователя
    selectIsAuthenticated: (state) => state.isAuthenticated, // Получить флаг аутентификации
    selectIsInit: (state) => state.isInit, // Получить флаг инициализации
    selectIsModalOpened: (state) => state.isModalOpened, // Получить флаг открытия модального окна
    selectErrorText: (state) => state.errorText // Получить текст ошибки
  },
  extraReducers: (builder) => {
    builder
      //Загрузка ингредиентов
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.ingredients = action.payload; // Обновляем список ингредиентов
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
      })
      //Создание нового заказа
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true; // Устанавливаем флаг запроса на заказ
      })
      .addCase(fetchNewOrder.rejected, (state, action) => {
        state.orderRequest = false; // Сбрасываем флаг запроса на заказ
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order; // Обновляем данные модального окна
        state.orderRequest = false; // Сбрасываем флаг запроса на заказ
      })
      //Логин пользователя
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.errorText = ''; // Очищаем текст ошибки
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.errorText = (action.payload as string) || 'Произошла ошибка'; // Устанавливаем текст ошибки из action.payload
      })
      .addCase(fetchLoginUser.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.isAuthenticated = true; // Устанавливаем флаг аутентификации
        state.errorText = ''; // Очищаем текст ошибки
      })
      //Регистрация пользователя
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.errorText = '';
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.errorText = (action.payload as string) || 'Произошла ошибка'; // Устанавливаем текст ошибки
      })
      .addCase(fetchRegisterUser.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.isAuthenticated = true; // Устанавливаем флаг аутентификации
        state.errorText = '';
      })
      //Получение данных пользователя
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.errorText = '';
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.isAuthenticated = false; // Сбрасываем флаг аутентификации
        state.user = { name: '', email: '' }; // Очищаем данные пользователя
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.user.name = action.payload.user.name; // Обновляем имя пользователя
        state.user.email = action.payload.user.email; // Обновляем email пользователя
        state.isAuthenticated = true; // Устанавливаем флаг аутентификации
      })
      //Получение ленты заказов
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false; // Сбрасываем флаг загрузки
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.orders = action.payload.orders; // Обновляем список заказов
        state.totalOrders = action.payload.total; // Обновляем общее количество заказов
        state.ordersToday = action.payload.totalToday; // Обновляем количество заказов за сегодня
      })
      //Получение заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false; // Сбрасываем флаг загрузки
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.userOrders = action.payload; // Обновляем заказы пользователя
      })
      //Выход пользователя
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.user = { name: '', email: '' }; // Сбрасываем данные пользователя
        state.isAuthenticated = false; // Сбрасываем флаг аутентификации
        state.userOrders = null; // Очищаем заказы пользователя
      })
      .addCase(fetchLogout.fulfilled, (state) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.user = { name: '', email: '' }; // Очищаем данные пользователя
        state.isAuthenticated = false; // Сбрасываем флаг аутентификации
        state.userOrders = null; // Очищаем заказы пользователя
        state.constructorItems = { bun: null, ingredients: [] }; // Очищаем конструктор
        state.orderModalData = null; // Очищаем данные модального окна
        state.orderRequest = false; // Сбрасываем флаг запроса на заказ
      })
      // Обновление данных пользователя
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true; // Устанавливаем флаг загрузки
        state.errorText = '';
      })
      .addCase(fetchUpdateUser.rejected, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        state.errorText = (action.payload as string) || 'Произошла ошибка';
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false; // Сбрасываем флаг загрузки
        if (action.payload.success) {
          state.user.name = action.payload.user.name; // Обновляем имя пользователя
          state.user.email = action.payload.user.email; // Обновляем email пользователя
        }
      });
  }
});

// Загрузка ингредиентов (вызываем в App, Feed, ProfileOrders)
export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  getIngredientsApi
);

//Создание нового заказа (вызываем в BurgerConstructor)
export const fetchNewOrder = createAsyncThunk(
  'orders/newOrder',
  orderBurgerApi
);

//Логин пользователя (применяем в Login)
export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { dispatch, rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      localStorage.setItem('refreshToken', response.refreshToken);
      setCookie('accessToken', response.accessToken);
      dispatch(getUserThunk()); // Запрашиваем данные пользователя
      return response;
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Ошибка авторизации');
    }
  }
);

//Регистрация пользователя (применяем в Register)
export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  registerUserApi
);

//Получение данных пользователя (вызываем в App, Register)
export const getUserThunk = createAsyncThunk('user/get', getUserApi);

// Получение ленты заказов (вызываем в App, Feed)
export const fetchFeed = createAsyncThunk('user/feed', getFeedsApi);

//Получение заказов пользователя (применяем в ProfileOrders)
export const fetchUserOrders = createAsyncThunk('user/orders', getOrdersApi);

// Выход пользователя (вызываем в ProfileMenu)
export const fetchLogout = createAsyncThunk(
  'user/logout',
  async (_, { dispatch }) => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      const response = await logoutApi(refreshToken); // Вызов API для выхода
      return response;
    }
    // Если refreshToken отсутствует, просто возвращаем успешный ответ
    return { success: true };
  }
);

//Обновление данных пользователя (применяем в Profile)
export const fetchUpdateUser = createAsyncThunk('user/update', updateUserApi);

export const {
  selectLoading, // Получить флаг загрузки (Получаем в ConstructorPage, Login, Profile, Register)
  selectIngredients, // Получить список ингредиентов (получаем в App, BurgerIngredients, IngredientDetails, OrderCard, OrderInfo)
  selectOrderModalData, // Получить данные модального окна (применяем в BurgerConstructor)
  selectConstructorItems, // Получить ингредиенты в конструкторе (применяем в BurgerConstructor, IngredientsCategory)
  selectOrderRequest, // Получить флаг, указывающий, выполняется ли в данный момент запрос на оформление заказа.(применяется в BurgerConstructor)
  selectUser, // Получить данные пользователя (получаем в AppHeader, Profile)
  selectOrders, // Получить список заказов (получаем в App, FeedInfo, OrderInfo, Feed)
  selectTotalOrders, // Получить общее количество заказов (получаем в FeedInfo)

  selectTodayOrders, // Получить количество заказов за сегодня (получаем в FeedInfo)
  selectUserOrders, // Получить заказы пользователя (применяем в ProfileOrders)
  selectIsAuthenticated, // Получить флаг аутентификации (применяем в App, BurgerConstructor)
  selectIsInit,
  selectIsModalOpened, // Получить флаг открытия модального окна (получаем в App)
  selectErrorText // Получить текст ошибки (применяем в Login, Register)
} = stellarBurgerSlice.selectors;

export const {
  addIngredient, //Добавление ингредиента (применяем в BurgerIngredient)
  closeOrderRequest, //Закрытие запроса на заказ (применяем в BurgerConstructor)
  removeOrders, //Удаление заказов (применяем в Feed)
  removeUserOrders, //Удаление заказов пользователя (применяем в ProfileOrders)
  init, //Инициализация приложения (применяем в App)
  openModal, // Открытие модалки (применяем в BurgerIngredientUI)
  closeModal, //Закрытие модального окна (применяем в App)
  deleteIngredient, //Удаление ингредиента (применяем в BurgerConstructorElement)
  setErrorText,
  removeErrorText, //Удаление текста ошибки (применяем в Login, Register)
  moveIngredientUp, //Перемещение ингредиента вверх (применяем в BurgerConstructorElement)
  moveIngredientDown //Перемещение ингредиента вниз (применяем в BurgerConstructorElement)
  // resetUser
} = stellarBurgerSlice.actions;
export default stellarBurgerSlice.reducer;
