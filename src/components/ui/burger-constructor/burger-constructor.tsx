import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems, //Объект, содержащий булку (bun) и массив ингредиентов (ingredients)
  orderRequest, //Флаг, указывающий, выполняется ли запрос на оформление заказа.
  price, // Общая стоимость заказа.
  orderModalData, //Данные о заказе, которые отображаются в модальном окне.
  onOrderClick, //Функция, вызываемая при нажатии на кнопку "Оформить заказ".
  closeOrderModal //Функция для закрытия модального окна.
}) => (
  <section className={styles.burger_constructor}>
    {/* Верхняя булка */}
    {constructorItems.bun ? (
      <div className={`${styles.element} mb-4 mr-4`}>
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsTop} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}
    {/* Список ингредиентов */}
    <ul className={styles.elements}>
      {constructorItems.ingredients.length > 0 ? (
        constructorItems.ingredients.map(
          (item: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={item}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={item.id}
            />
          )
        )
      ) : (
        <div
          className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        >
          Выберите начинку
        </div>
      )}
    </ul>
    {/* Нижняя булка */}
    {constructorItems.bun ? (
      <div className={`${styles.element} mt-4 mr-4`}>
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ${styles.noBunsBottom} ml-8 mb-4 mr-5 text text_type_main-default`}
      >
        Выберите булки
      </div>
    )}
    {/* Итоговая стоимость и кнопка оформления заказа */}
    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.cost} mr-10`}>
        <p className={`text ${styles.text} mr-2`}>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        htmlType='button'
        type='primary'
        size='large'
        children='Оформить заказ'
        onClick={onOrderClick}
      />
    </div>

    {/* Модальное окно загрузки */}
    {orderRequest && (
      <Modal onClose={closeOrderModal} title={'Оформляем заказ...'}>
        <Preloader />
      </Modal>
    )}

    {/* Модальное окно с деталями заказа */}
    {orderModalData && (
      <Modal
        onClose={closeOrderModal}
        title={orderRequest ? 'Оформляем заказ...' : ''}
      >
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);
