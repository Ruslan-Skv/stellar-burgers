import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  closeModal,
  fetchFeed,
  fetchIngredients,
  fetchLogout,
  getUserThunk,
  init,
  selectIngredients,
  selectIsAuthenticated,
  selectIsModalOpened,
  selectOrders
} from '../../slices/stellar-burger-slice';
import { deleteCookie, getCookie } from '../../utils/cookie';

export const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const background = location.state && location.state.background;
  const ingredients = useSelector(selectIngredients);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = getCookie('accessToken');
  const feed = useSelector(selectOrders);
  const isModalOpened = useSelector(selectIsModalOpened);
  const navigate = useNavigate();

  // Инициализация приложения: проверка аутентификации и загрузка данных
  useEffect(() => {
    if (!isAuthenticated && token) {
      dispatch(getUserThunk())
        .then(() => {
          dispatch(init());
        })
        .catch((e) => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else if (!isAuthenticated) {
      dispatch(init());
    }
  }, [isAuthenticated, token, dispatch]);

  //Загрузка ингредиентов, если они еще не загружены
  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients()).catch((error) => {
        console.error('Ошибка загрузки ингредиентов:', error);
      });
    }
  }, [ingredients.length, dispatch]);

  // // Загрузка ленты заказов, если она еще не загружена
  useEffect(() => {
    if (!feed.length) {
      dispatch(fetchFeed()).catch((error) => {
        console.error('Ошибка загрузки ленты заказов:', error);
      });
    }
  }, [feed.length, dispatch]);

  // Обработка выхода пользователя
  const handleLogout = async () => {
    await dispatch(fetchLogout()); // Выполняем выход
    navigate('/login'); // Редирект на страницу входа
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />

        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Рендерим модальные окна, если есть background */}
      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={'Заказ'}
                onClose={() => {
                  dispatch(closeModal());
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Детали ингредиента'}
                onClose={() => {
                  dispatch(closeModal());
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={'Заказ'}
                  onClose={() => {
                    dispatch(closeModal());
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};
