describe('Конструктор бургера', () => {
  beforeEach(() => {
    // общий сетап
    // если не точно известно, к какому домену в текущий момент должен отправляться
    // запрос, в URL запроса можно указывать звёздочки '**/api/ingredients'
    cy.intercept('GET', '/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Базовая загрузка', () => {
    it('приложение запустилось', () => {
      cy.contains('Соберите бургер').should('exist');
    });
  });

  describe('Добавление ингредиентов', () => {
    it('добавление булки', () => {
      cy.get('[data-cy="burger-ingredient"][data-cy-type="bun"]')
        .first()
        .as('bun');
      cy.get('@bun').within(() => {
        cy.contains('Добавить').click();
      });
      // булки чекаем по имени, т.к. нет возможности поставить data-cy-id у библиотечного ConstructorElement
      cy.fixture('ingredients.json').then((ingredients) => {
        const bun = ingredients.data.find((item: any) => item.type === 'bun');
        cy.get('[data-cy="constructor-bun-top"]').should(
          'contain.text',
          bun.name // 'Краторная булка N-200i'
        );
        cy.get('[data-cy="constructor-bun-bottom"]').should(
          'contain.text',
          bun.name // 'Краторная булка N-200i'
        );
      });
    });

    it('добавление начинки', () => {
      cy.get('[data-cy="burger-ingredient"][data-cy-type="main"]')
        .first()
        .as('mainIngredient');
      cy.get('@mainIngredient').within(() => {
        cy.contains('Добавить').click();
      });
      cy.get('@mainIngredient')
        .invoke('attr', 'data-cy-id')
        .then((id) => {
          cy.get('[data-cy="constructor-fillings"]').within(() => {
            cy.get(`[data-cy-id="${id}"]`).should('exist');
          });
        });
    });

    it('добавление соуса', () => {
      cy.get('[data-cy="burger-ingredient"][data-cy-type="sauce"]')
        .first()
        .as('sauceIngredient');
      cy.get('@sauceIngredient').within(() => {
        cy.contains('Добавить').click();
      });
      cy.get('@sauceIngredient')
        .invoke('attr', 'data-cy-id')
        .then((id) => {
          cy.get('[data-cy="constructor-fillings"]').within(() => {
            cy.get(`[data-cy-id="${id}"]`).should('exist');
          });
        });
    });
  });

  describe('Модалка ингредиента', () => {
    it('открытие модалки ингредиента', () => {
      cy.get('[data-cy="burger-ingredient"]').first().as('ingredient');
      cy.get('@ingredient')
        .find('[data-cy="ingredient-name"]')
        .invoke('text')
        .then((name) => {
          cy.get('@ingredient').find('a').click();
          cy.get('[data-cy="modal"]').should('be.visible');
          cy.get('[data-cy="modal"]').contains(name.trim());
          // cy.get('[data-cy="modal-close"]').click();
          // cy.get('[data-cy="modal"]').should('not.exist');
        });
    });

    it('закрытие по крестику', () => {
      cy.get('[data-cy="burger-ingredient"]').first().as('ingredient');
      cy.get('@ingredient').find('a').click();
      cy.get('[data-cy="modal"]').should('be.visible');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('закрытие по оверлею', () => {
      cy.get('[data-cy="burger-ingredient"]').first().as('ingredient');
      cy.get('@ingredient').find('a').click();
      cy.get('[data-cy="modal"]').should('be.visible');
      // cy.get('[data-cy="modal-overlay"]').click('topLeft');
      cy.get('[data-cy="modal-overlay"]').click({ force: true }); // костыль чтобы не лезть в верстку
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(() => {
      // локальный сетап
      cy.intercept('GET', '/api/auth/user', {
        fixture: 'user.json'
      }).as('getUser');
      cy.intercept('POST', '/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');
      // зачем (по заданию) мокать токены, если мы сразу даем сайпресу юзера
      // (у меня функционал блокировщика чекает именно юзера, а тот уже завязан на токенах)
      cy.setCookie('accessToken', 'test-access-token');
      cy.visit('/');
      cy.window().then((win) => {
        win.localStorage.setItem('refreshToken', 'test-refresh-token');
      });
      cy.wait('@getIngredients');
      cy.wait('@getUser');
    });
    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.window().then((win) => {
        win.localStorage.removeItem('refreshToken');
      });
    });

    it('создание и оформление заказа', () => {
      // сборка бургера
      cy.get('[data-cy="burger-ingredient"][data-cy-type="bun"]')
        .first()
        .as('bun');
      cy.get('@bun').within(() => {
        cy.contains('Добавить').click();
      });
      // по идее достаточно только булки для данного теста
      cy.get('[data-cy="burger-ingredient"][data-cy-type="main"]')
        .first()
        .as('main');
      cy.get('@main').within(() => {
        cy.contains('Добавить').click();
      });
      cy.get('[data-cy="burger-ingredient"][data-cy-type="sauce"]')
        .first()
        .as('sauce');
      cy.get('@sauce').within(() => {
        cy.contains('Добавить').click();
      });

      // оформление заказа
      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');
      cy.get('[data-cy="modal"]').should('be.visible');
      // cy.get('[data-cy="modal"]').contains('123456');
      cy.fixture('order.json').then((order) => {
        cy.get('[data-cy="modal"]').contains(order.order.number.toString());
      });

      // закрытие модалки заказа
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      // проверка что конструктор очищен
      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
      cy.get('[data-cy="constructor-fillings"]')
        .find('[data-cy="constructor-filling"]')
        .should('not.exist');
    });
  });
});
