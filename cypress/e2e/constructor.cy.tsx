// Глобальные настройки
// Устанавливаем базовый URL API из переменных окружения Cypress
const API_URL = Cypress.env('BURGER_API_URL');

// Обработчик для игнорирования неперехваченных исключений в приложении
// (чтобы тесты не падали из-за ошибок в коде приложения)
Cypress.on('uncaught:exception', () => {
  return false;
});

// describe('проверяем доступность приложения', function () {
//   it('сервис должен быть доступен по адресу localhost:4000', function () {
//     cy.visit('http://localhost:4000');
//   });
// });

//Настройки перед каждым тестом
beforeEach(() => {
  // Устанавливаем тестовые данные в localStorage (токен обновления)
  window.localStorage.setItem('refreshToken', 'testRefreshToken');

  // Устанавливаем тестовую куку (токен доступа)
  cy.setCookie('accessToken', 'testAccessToken');

  // Мок для запроса ингредиентов
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/ingredients`
      },
      ingredients
    ).as('getIngredients'); // Даем имя моку для последующего ожидания
  });

  // Мок для запроса списка заказов
  cy.fixture('orders.json').then((orders) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/orders/all`
      },
      orders
    ).as('getOrders');
  });

  // Мок для запроса данных пользователя
  cy.fixture('user.json').then((user) => {
    cy.intercept(
      {
        method: 'GET',
        url: `${API_URL}/auth/user`
      },
      user
    ).as('getUser');
  });

  // Посещаем главную страницу
  cy.visit('/');

  // Ожидаем завершения запроса ингредиентов
  cy.wait('@getIngredients');
});

//Очистка после каждого теста
afterEach(() => {
  // Удаляем все куки
  cy.clearAllCookies();

  // Очищаем localStorage
  cy.clearAllLocalStorage();
});

//Тестовые сценарии
describe('Проверка работоспособности приложения', () => {
  // Селекторы для элементов интерфейса
  const noBunSelector1 = `[data-cy=no_bun_text_1]`; // Текст "Выберите булки" (верх)
  const noBunSelector2 = `[data-cy=no_bun_text_2]`; // Текст "Выберите булки" (низ)
  const noIngredientsSelector = `[data-cy=no_ingredients_text]`; // Текст "Выберите начинку"
  const bunSelector = `[data-cy=bun_0]`; // Первая булка в списке
  const ingredientSelector = `[data-cy=ingredient_0]`; // Первый ингредиент в списке

  // Тест на добавление ингредиентов в конструктор
  it('есть возможность добавлять булку и ингридиенты', () => {
    // Получаем элементы по селекторам и даем им псевдонимы
    cy.get(noBunSelector1).as('noBunText1');
    cy.get(noBunSelector2).as('noBunText2');
    cy.get(noIngredientsSelector).as('noIngredientsText');
    cy.get(bunSelector + ` button`).as('bun'); // Кнопка добавления булки
    cy.get(ingredientSelector + ` button`).as('ingredient'); // Кнопка добавления ингредиента

    // Проверяем начальное состояние (пустой конструктор)
    cy.get('@noBunText1').contains('Выберите булки');
    cy.get('@noBunText2').contains('Выберите булки');
    cy.get('@noIngredientsText').contains('Выберите начинку');

    // Добавляем булку и ингредиент
    cy.get('@bun').click();
    cy.get('@ingredient').click({ multiple: true });

    // Проверяем, что элементы появились в конструкторе
    cy.get(`[data-cy=constructor_section]`).contains('булка');
    cy.get(`[data-cy=ingredient_element]`);
  });

  // Тест модального окна ингредиента
  it('проверка открытия и закрытия модального окна ингридиента', () => {
    // Кликаем по ингредиенту
    const ingredient = cy.get(bunSelector);
    ingredient.click();

    // Проверяем, что модальное окно открылось
    cy.get(`[data-cy=ingredient_modal]`);

    // Закрываем модальное окно
    cy.get(`[data-cy=close_modal_btn]`).click();
  });

  // Тест создания нового заказа
  it('проверка нового заказа', () => {
    // Получаем элементы для добавления
    const bun = cy.get(bunSelector + ` button`);
    const ingredient = cy.get(ingredientSelector + ` button`);

    // Добавляем булку и ингредиент
    bun.click();
    ingredient.click({ multiple: true });

    // Мокаем ответ API для создания заказа
    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept(
        {
          method: 'POST',
          url: `${API_URL}/orders`
        },
        newOrder
      ).as('newOrder');

      // Кликаем кнопку оформления заказа
    cy.get(`[data-cy=new_order_total] button`).click();

      // Проверяем номер заказа в модальном окне
      cy.get(`[data-cy=new_order_number]`).contains(newOrder.order.number);

      // Закрываем модальное окно
      cy.get(`[data-cy=close_modal_btn]`).click();

      // Проверяем, что конструктор очистился после создания заказа
      cy.get(noBunSelector1).as('noBunText1');
      cy.get(noBunSelector2).as('noBunText2');
      cy.get(noIngredientsSelector).as('noIngredientsText');

      cy.get('@noBunText1').contains('Выберите булки');
      cy.get('@noBunText2').contains('Выберите булки');
      cy.get('@noIngredientsText').contains('Выберите начинку');
    });
  });
});

// // Глобальные настройки
// const API_URL = Cypress.env('BURGER_API_URL');

// // Селекторы
// const SELECTORS = {
//   NO_BUN_1: '[data-cy=no_bun_text_1]', // Текст "Выберите булки" (верх)
//   NO_BUN_2: '[data-cy=no_bun_text_2]', // Текст "Выберите булки" (низ)
//   NO_INGREDIENTS: '[data-cy=no_ingredients_text]', // Текст "Выберите начинку"
//   BUN: '[data-cy=bun_0] button', // Кнопка добавления булки
//   INGREDIENT: '[data-cy=ingredient_0] button', // Кнопка добавления ингредиента
//   CONSTRUCTOR: '[data-cy=constructor_section]', // Конструктор
//   INGREDIENT_ELEMENT: '[data-cy=ingredient_element]', //Элемент ингридиента
//   INGREDIENT_MODAL: '[data-cy=ingredient_modal]', //Модалка с ингридиентом
//   MODAL_CLOSE: '[data-cy=close_modal_btn]', //Кнопка крестик модалки
//   ORDER_BUTTON: '[data-cy=new_order_total] button', // Кнопка оформления заказа
//   ORDER_NUMBER: '[data-cy=new_order_number]' //номер заказа в модальном окне
// };

// Cypress.on('uncaught:exception', () => false);

// // Настройки перед каждым тестом
// beforeEach(() => {
//   window.localStorage.setItem('refreshToken', 'testRefreshToken');
//   cy.setCookie('accessToken', 'testAccessToken');

 // Мок для запроса ингредиентов
//   cy.fixture('ingredients.json').then((ingredients) => {
//     cy.intercept('GET', `${API_URL}/ingredients`, ingredients).as(
//       'getIngredients'
//     );
//   });

// Мок для запроса списка заказов
//   cy.fixture('orders.json').then((orders) => {
//     cy.intercept('GET', `${API_URL}/orders/all`, orders).as('getOrders');
//   });

// Мок для запроса данных пользователя
//   cy.fixture('user.json').then((user) => {
//     cy.intercept('GET', `${API_URL}/auth/user`, user).as('getUser');
//   });

 // Посещаем главную страницу
//   cy.visit('/');
// Ожидаем завершения запроса ингредиентов
//   cy.wait('@getIngredients');
// });

//Очистка после каждого теста
// afterEach(() => {
//   cy.clearAllCookies();
//   cy.clearAllLocalStorage();
// });

// describe('Проверка работоспособности приложения', () => {
//   it('есть возможность добавлять булку и ингредиенты', () => {
//     // Проверяем начальное состояние
//     cy.get(SELECTORS.NO_BUN_1).should('contain', 'Выберите булки');
//     cy.get(SELECTORS.NO_BUN_2).should('contain', 'Выберите булки');
//     cy.get(SELECTORS.NO_INGREDIENTS).should('contain', 'Выберите начинку');

//     // Добавляем булку и ингредиент
//     cy.get(SELECTORS.BUN).click();
//     cy.get(SELECTORS.INGREDIENT).click();

//     // Проверяем изменения
//     cy.get(SELECTORS.CONSTRUCTOR).should('contain', 'булка');
//     cy.get(SELECTORS.INGREDIENT_ELEMENT).should('exist');
//   });

//   it('проверка открытия и закрытия модального окна ингредиента', () => {
//     cy.get(SELECTORS.BUN.replace(' button', '')).click();
//     cy.get(SELECTORS.INGREDIENT_MODAL).should('be.visible');
//     cy.get(SELECTORS.MODAL_CLOSE).click();
//     cy.get(SELECTORS.INGREDIENT_MODAL).should('not.exist');
//   });

//   it('проверка нового заказа', () => {
//     // Подготовка мока перед действиями
//     cy.fixture('newOrder.json').then((newOrder) => {
//       cy.intercept('POST', `${API_URL}/orders`, newOrder).as('newOrder');
//     });

//     // Добавляем ингредиенты
//     cy.get(SELECTORS.BUN).click();
//     cy.get(SELECTORS.INGREDIENT).click();

//     // Оформляем заказ
//     cy.get(SELECTORS.ORDER_BUTTON).click();

//     // Ждем выполнения запроса
//     cy.wait('@newOrder').then((interception) => {
//       const orderNumber = interception.response?.body.order.number;
//       cy.get(SELECTORS.ORDER_NUMBER).should('contain', orderNumber);
//     });

//     // Закрываем модальное окно
//     cy.get(SELECTORS.MODAL_CLOSE).click();

//     // Проверяем сброс конструктора
//     cy.get(SELECTORS.NO_BUN_1).should('contain', 'Выберите булки');
//     cy.get(SELECTORS.NO_BUN_2).should('contain', 'Выберите булки');
//     cy.get(SELECTORS.NO_INGREDIENTS).should('contain', 'Выберите начинку');
//   });
// });
