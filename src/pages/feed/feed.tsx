import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages'; //UI-компонент, который отображает ленту заказов.
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  fetchIngredients,
  removeOrders,
  selectOrders
} from '../../slices/stellar-burger-slice';

//Компонент Feed отвечает за отображение ленты заказов. Если заказы еще не загружены, отображается прелоадер.
export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchIngredients()), dispatch(fetchFeed())]);
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeed());
        dispatch(removeOrders());
      }}
    />
  );
};
