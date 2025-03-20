import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types'; // Тип, описывающий структуру ингредиента в конструкторе бургера.
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  closeOrderRequest,
  fetchNewOrder,
  selectConstructorItems,
  selectIsAuthenticated,
  selectOrderModalData,
  selectOrderRequest
} from '../../slices/stellar-burger-slice';
import { useNavigate } from 'react-router-dom';

//Компонент BurgerConstructor отвечает за отображение и управление конструктором бургера, включая расчет стоимости, обработку заказа и отображение модального окна.
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest); //Флаг, указывающий, выполняется ли в данный момент запрос на оформление заказа.
  const orderModalData = useSelector(selectOrderModalData); //Данные для отображения в модальном окне после успешного оформления заказа.
  const isAuthenticated = useSelector(selectIsAuthenticated);

  //onOrderClick: Функция, которая вызывается при клике на кнопку оформления заказа: Проверяет, выбрана ли булка (constructorItems.bun). Проверяет, не выполняется ли уже запрос на оформление заказа (orderRequest). Если условия не выполнены, функция завершается.
  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login', { replace: true });
    }

    if (constructorItems.bun!._id && constructorItems.ingredients.length) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        fetchNewOrder([
          constructorItems.bun!._id,
          ...ingredientsIds,
          constructorItems.bun!._id
        ])
      );
    }
  };

  const closeOrderModal = () => {
    dispatch(closeOrderRequest());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price! * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  // return null;

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
