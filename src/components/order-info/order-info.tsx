import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectOrders
} from '../../slices/stellar-burger-slice';
import { redirect, useParams } from 'react-router-dom';

// Компонент OrderInfo отображает информацию о заказе
export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */

  const params = useParams<{ number: string }>();
  if (!params.number) {
    redirect('/feed');
    return null;
  }

  const orders = useSelector(selectOrders);

  const orderData = orders.find(
    (item) => item.number === parseInt(params.number!)
  );

  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    // Если данные заказа или ингредиенты отсутствуют, возвращаем null
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    // Тип для хранения информации об ингредиентах с количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Создаем объект с информацией об ингредиентах и их количестве
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        // Если ингредиент еще не был добавлен в аккумулятор
        if (!acc[item]) {
          // Находим ингредиент по его _id
          const ingredient = ingredients.find((ing) => ing._id === item);
          // Если ингредиент найден, добавляем его в аккумулятор с количеством 1
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          // Если ингредиент уже есть в аккумуляторе, увеличиваем его количество
          acc[item].count++;
        }

        return acc;
      },
      {} // Начальное значение аккумулятора
    );

    // Вычисляем общую стоимость заказа
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возвращаем объект с информацией о заказе
    return {
      ...orderData, // Копируем все свойства заказа
      ingredientsInfo, // Информация об ингредиентах с количеством
      date, // Дата создания заказа
      total // Общая стоимость заказа
    };
  }, [orderData, ingredients]);

  // Если информация о заказе не была вычислена, показываем Preloader
  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
