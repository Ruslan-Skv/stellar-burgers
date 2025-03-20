export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
};

export type TConstructorIngredient = TIngredient & {
  id: string;
};

export type TOrder = {
  _id: string; // Идентификатор заказа
  status: string; // Статус заказа
  name: string; // Название заказа
  createdAt: string; // Дата создания заказа
  updatedAt: string; // Дата обновления заказа
  number: number; // Номер заказаз
  ingredients: string[]; // Массив идентификаторов ингредиентов
};

export type TOrdersData = {
  orders: TOrder[];
  total: number;
  totalToday: number;
};

export type TUser = {
  email: string;
  name: string;
};

export type TTabMode = 'bun' | 'sauce' | 'main';
