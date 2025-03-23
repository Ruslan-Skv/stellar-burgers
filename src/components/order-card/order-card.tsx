import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../slices/stellar-burger-slice';

const maxIngredients = 6; // Максимальное количество ингредиентов, которые будут отображаться на карточке заказа

// Компонент OrderCard отображает карточку заказа
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();

  /** TODO: взять переменную из стора */
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  // Используем useMemo для оптимизации вычислений информации о заказе
  const orderInfo = useMemo(() => {
    if (!ingredients.length) return null;
    // Создаем массив информации об ингредиентах заказа
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        // Находим ингредиент по его _id
        const ingredient = ingredients.find((ing) => ing._id === item);
        // Если ингредиент найден, добавляем его в массив
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );
    // Вычисляем общую стоимость заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);
    // Ограничиваем количество отображаемых ингредиентов
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);
    // Вычисляем количество оставшихся ингредиентов, которые не поместились на карточке
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;
    // Преобразуем дату создания заказа в объект Date
    const date = new Date(order.createdAt);
    // Возвращаем объект с информацией о заказе
    return {
      ...order, // Копируем все свойства заказа
      ingredientsInfo, // Массив информации об ингредиентах
      ingredientsToShow, // Ингредиенты для отображения
      remains, // Количество оставшихся ингредиентов
      total, // Общая стоимость заказа
      date // Дата создания заказа
    };
  }, [order, ingredients]);

  // Если информация о заказе не была вычислена, возвращаем null
  if (!orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={orderInfo}
      maxIngredients={maxIngredients}
      locationState={{ background: location }}
    />
  );
});
