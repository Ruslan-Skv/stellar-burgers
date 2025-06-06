// Глобальные настройки
const API_URL = Cypress.env('BURGER_API_URL');

// Селекторы
const SELECTORS = {
  NO_BUN_1: `[data-cy=no_bun_text_1]`, // Текст "Выберите булки" (верх)  (BurgerConstructorUI)
  NO_BUN_2: `[data-cy=no_bun_text_2]`, // Текст "Выберите булки" (низ)  (BurgerConstructorUI)
  NO_INGREDIENTS: `[data-cy=no_ingredients_text]`, // Текст "Выберите начинку" (BurgerConstructorUI)
  ADD_BUN_BUTTON: `[data-cy=bun_0] button`, // Кнопка добавления булки (BurgerIngredientUI)
  ADD_INGREDIENT_BUTTON: `[data-cy=ingredient_0] button`, // Кнопка добавления ингредиента (BurgerIngredientUI)
  CONSTRUCTOR: `[data-cy=constructor_section]`, // Конструктор (BurgerConstructorUI)
  INGREDIENT_ELEMENT: `[data-cy=ingredient_element]`, //Элемент ингридиента (BurgerConstructorElementUI)
  INGREDIENT_MODAL: `[data-cy=ingredient_modal]`, //Модалка с ингридиентом (IngredientDetailsUI)
  MODAL_CLOSE: `[data-cy=close_modal_btn]`, //Кнопка крестик модалки  (ModalUI)
  ORDER_BUTTON: `[data-cy=new_order_total] button`, // Кнопка оформления заказа (BurgerConstructorUI)
  ORDER_NUMBER: `[data-cy=new_order_number]`, //Номер заказа в модальном окне (OrderDetailsUI)
  INGREDIENT_NAME: `[data-cy=ingredient_name]`, // Название ингредиента в списке  (BurgerIngredientUI)
  MODAL_INGREDIENT_NAME: `[data-cy=modal_ingredient_name]`, // Название ингредиента в модальном окне (IngredientDetailsUI)
  INGREDIENT: `[data-cy=ingredient]` // Картинка ингредиента в списке
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
    cy.get(SELECTORS.ADD_BUN_BUTTON).click();
    cy.get(SELECTORS.ADD_INGREDIENT_BUTTON).click({ multiple: true });

    // Проверяем изменения
    cy.get(SELECTORS.CONSTRUCTOR).should('contain', 'булка');
    cy.get(SELECTORS.INGREDIENT_ELEMENT).should('exist');
  });

  it('проверка нового заказа', () => {
    // Подготовка мока перед действиями
    cy.fixture('newOrder.json').then((newOrder) => {
      cy.intercept('POST', `${API_URL}/orders`, newOrder).as('newOrder');
    });

    // Добавляем ингредиенты
    cy.get(SELECTORS.ADD_BUN_BUTTON).click();
    cy.get(SELECTORS.ADD_INGREDIENT_BUTTON).click({ multiple: true });

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

  it('проверка работы модального окна ингредиента', () => {
    // Убедимся, что модальное окно изначально отсутствует
    cy.get(SELECTORS.INGREDIENT_MODAL).should('not.exist');
    // Открываем модальное окно
    cy.get(SELECTORS.INGREDIENT).first().click();
    // Проверяем, что модальное окно открылось
    cy.get(SELECTORS.INGREDIENT_MODAL).should('be.visible');
    // Получаем название ингредиента из списка
    cy.get(SELECTORS.INGREDIENT_NAME)
      .first()
      .then(($listName) => {
        const listIngredientName = $listName.text().trim();
        // Получаем название ингредиента из модального окна
        cy.get(SELECTORS.MODAL_INGREDIENT_NAME).then(($modalName) => {
          const modalIngredientName = $modalName.text().trim();
          // Проверяем совпадение названий
          expect(listIngredientName).to.equal(modalIngredientName);
        });
      });
    // Закрываем модальное окно по клику на крестик
    cy.get(SELECTORS.MODAL_CLOSE).click();
    // Убедимся, что модальное окно закрылось
    cy.get(SELECTORS.INGREDIENT_MODAL).should('not.exist');
  });
});
