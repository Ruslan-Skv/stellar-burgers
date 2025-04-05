export const mockStore = {
  ingredients: [
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
    },
    {
      _id: '643d69a5c3f7b9001cfa0940',
      name: 'Говяжий метеорит (отбивная)',
      type: 'main',
      proteins: 800,
      fat: 800,
      carbohydrates: 300,
      calories: 2674,
      price: 3000,
      image: 'https://code.s3.yandex.net/react/code/meat-04.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png'
    }
  ],
  loading: false,
  orderModalData: {
    ingredients: ['test-id1', 'test-id2'],
    _id: '67f0dd26e8e61d001cec084f',
    status: 'done',
    name: 'Флюоресцентный метеоритный бургер',
    createdAt: '2025-04-05T07:35:02.385Z',
    updatedAt: '2025-04-05T07:35:03.075Z',
    number: 73501
  },
  constructorItems: {
    bun: {
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
    },
    ingredients: [
      {
        _id: '643d69a5c3f7b9001cfa0940',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
        id: 'ingredient_1'
      },
      {
        _id: '643d69a5c3f7b9001cfa0940',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
        id: 'ingredient_1'
      },
      {
        _id: '643d69a5c3f7b9001cfa0940',
        name: 'Говяжий метеорит (отбивная)',
        type: 'main',
        proteins: 800,
        fat: 800,
        carbohydrates: 300,
        calories: 2674,
        price: 3000,
        image: 'https://code.s3.yandex.net/react/code/meat-04.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
        id: 'ingredient_1'
      }
    ]
  },
  orderRequest: false,
  user: {
    name: 'testUser',
    email: 'test@gmail.com'
  },
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
    },
    {
      _id: '67f0dbbfe8e61d001cec084d',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0946',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Флюоресцентный space био-марсианский минеральный люминесцентный бургер',
      createdAt: '2025-04-05T07:29:03.296Z',
      updatedAt: '2025-04-05T07:29:03.943Z',
      number: 73500
    }
  ],
  totalOrders: 73600,
  ordersToday: 10,
  userOrders: [
    {
      _id: '67efc86dea327c001cf323b8',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa093c'
      ],
      status: 'done',
      name: 'Краторный био-марсианский бургер',
      createdAt: '2025-04-04T11:54:21.479Z',
      updatedAt: '2025-04-04T11:54:22.150Z',
      number: 73312
    },
    {
      _id: '67efc328ea327c001cf323a6',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0940',
        '643d69a5c3f7b9001cfa0943',
        '643d69a5c3f7b9001cfa093d'
      ],
      status: 'done',
      name: 'Space флюоресцентный люминесцентный метеоритный бургер',
      createdAt: '2025-04-04T11:31:52.322Z',
      updatedAt: '2025-04-04T11:31:52.989Z',
      number: 73309
    }
  ],
  isAuthenticated: true,
  isInit: false,
  isModalOpened: false,
  errorText: 'test error ......'
};

export const mockIngredient = {
  _id: '643d69a5c3f7b9001cfa0940',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main',
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  id: 'test_id_1'
};

export const mockBun = {
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
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  id: 'test_bun_id'
};
