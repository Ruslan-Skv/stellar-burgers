import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import {
  selectOrders,
  selectTodayOrders,
  selectTotalOrders
} from '../../slices/stellar-burger-slice';

//функция фильтрует заказы по статусу.  Возвращает первые 20 номеров заказов
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

//Компонент FeedInfo отвечает за отображение информации о заказах (списки готовых и ожидающих заказов).
export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const orders: TOrder[] = useSelector(selectOrders); // список заказов
  const total = useSelector(selectTotalOrders); //общее количество заказов
  const totalToday = useSelector(selectTodayOrders); //количество заказов за сегодня
  const feed = { total, totalToday }; //Объект, содержащий общую информацию о ленте заказов
  //Фильтрация заказов
  const readyOrders = getOrders(orders, 'done'); // Массив номеров заказов со статусом 'done' (готовые заказы).
  const pendingOrders = getOrders(orders, 'pending'); //Массив номеров заказов со статусом 'pending' (ожидающие заказы).

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
