// Глобальные настройки
const API_URL = Cypress.env('BURGER_API_URL');

// Селекторы
const SELECTORS = {
  NO_BUN_1: `[data-cy=no_bun_text_1]`, // Текст "Выберите булки" (верх)
  NO_BUN_2: `[data-cy=no_bun_text_2]`, // Текст "Выберите булки" (низ)
  NO_INGREDIENTS: `[data-cy=no_ingredients_text]`, // Текст "Выберите начинку"
  BUN: `[data-cy=bun_0] button`, // Кнопка добавления булки
  INGREDIENT: `[data-cy=ingredient_0] button`, // Кнопка добавления ингредиента
  CONSTRUCTOR: `[data-cy=constructor_section]`, // Конструктор
  INGREDIENT_ELEMENT: `[data-cy=ingredient_element]`, //Элемент ингридиента
  INGREDIENT_MODAL: `[data-cy=ingredient_modal]`, //Модалка с ингридиентом
  MODAL_CLOSE: `[data-cy=close_modal_btn]`, //Кнопка крестик модалки
  ORDER_BUTTON: `[data-cy=new_order_total] button`, // Кнопка оформления заказа
  ORDER_NUMBER: `[data-cy=new_order_number]` //номер заказа в модальном окне
};

Cypress.on('uncaught:exception', () => false);

// Настройки перед каждым тестом
beforeEach(() => {
  // Очистка перед тестом
  cy.clearAllCookies();
  cy.clearAllLocalStorage();

  window.localStorage.setItem('refreshToken', 'testRefreshToken');
  cy.setCookie('accessToken', 'testAccessToken');

  //Мок для запроса ингредиентов
  cy.fixture('ingredients.json').then((ingredients) => {
    cy.intercept('GET', `${API_URL}/ingredients`, ingredients).as(
      'getIngredients'
    );
  });

  //Мок для запроса списка заказов
  cy.fixture('orders.json').then((orders) => {
    cy.intercept('GET', `${API_URL}/orders/all`, orders).as('getOrders');
  });

  //Мок для запроса данных пользователя
  cy.fixture('user.json').then((user) => {
    cy.intercept('GET', `${API_URL}/auth/user`, user).as('getUser');
  });

  //Посещаем главную страницу
  cy.visit('/');
  //Ожидаем завершения запроса ингредиентов
  cy.wait('@getIngredients');
});

//Очистка после каждого теста
afterEach(() => {
  cy.clearAllCookies();
  cy.clearAllLocalStorage();
});

describe('Проверка работоспособности приложения', () => {
  it('проверка добавления булки и ингредиента', () => {
    // Проверяем начальное состояние
    cy.get(SELECTORS.NO_BUN_1).should('contain', 'Выберите булки');
    cy.get(SELECTORS.NO_BUN_2).should('contain', 'Выберите булки');
    cy.get(SELECTORS.NO_INGREDIENTS).should('contain', 'Выберите начинку');

    // Добавляем булку и ингредиент
    cy.get(SELECTORS.BUN).click();
    cy.get(SELECTORS.INGREDIENT).click({ multiple: true });

    // Проверяем изменения
    cy.get(SELECTORS.CONSTRUCTOR).should('contain', 'булка');
    cy.get(SELECTORS.INGREDIENT_ELEMENT).should('exist');
  });

  it('проверка открытия и закрытия модального окна ингредиента', () => {
    cy.get(SELECTORS.BUN.replace(' button', '')).click();
    cy.get(SELECTORS.INGREDIENT_MODAL).should('be.visible');
    cy.get(SELECTORS.MODAL_CLOSE).click();
    cy.get(SELECTORS.INGREDIENT_MODAL).should('not.exist');
  });

  it('проверка нового заказа', () => {
    // Подготовка мока перед действиями
    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept('POST', `${API_URL}/orders`, newOrder).as('newOrder');
    });

    // Добавляем ингредиенты
    cy.get(SELECTORS.BUN).click();
    cy.get(SELECTORS.INGREDIENT).click({ multiple: true });

    // Оформляем заказ
    cy.get(SELECTORS.ORDER_BUTTON).click();

    // Ждем выполнения запроса
    cy.wait('@newOrder').then((interception) => {
      const orderNumber = interception.response?.body.order.number;
      cy.get(SELECTORS.ORDER_NUMBER).should('contain', orderNumber);
    });

    // Закрываем модальное окно
    cy.get(SELECTORS.MODAL_CLOSE).click();

    // Проверяем сброс конструктора
    cy.get(SELECTORS.NO_BUN_1).should('contain', 'Выберите булки');
    cy.get(SELECTORS.NO_BUN_2).should('contain', 'Выберите булки');
    cy.get(SELECTORS.NO_INGREDIENTS).should('contain', 'Выберите начинку');
  });
});
