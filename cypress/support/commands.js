// ***********************************************************
// Cypress Custom Commands
// 
// Comandos personalizados reutilizables
// ***********************************************************

/**
 * Comando para hacer login programático (sin UI)
 * Más rápido que hacer login a través de la interfaz
 */
Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('apiUrl')}/api/auth/login`,
    body: { email, password },
    failOnStatusCode: false
  }).then((response) => {
    if (response.status === 200 && response.body.token) {
      window.localStorage.setItem('token', response.body.token);
      window.localStorage.setItem('user', JSON.stringify(response.body.user));
    }
  });
});

/**
 * Comando para hacer logout
 */
Cypress.Commands.add('logout', () => {
  cy.clearLocalStorage('token');
  cy.clearLocalStorage('user');
});

/**
 * Comando para verificar que un elemento está visible y tiene texto
 */
Cypress.Commands.add('shouldContainText', { prevSubject: true }, (subject, text) => {
  cy.wrap(subject).should('be.visible').and('contain.text', text);
});

/**
 * Comando para esperar a que la página cargue completamente
 */
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document.readyState').should('eq', 'complete');
});

/**
 * Comando para hacer login con usuario de fixture
 */
Cypress.Commands.add('loginWithFixture', (userType = 'validUser') => {
  cy.fixture('users').then((users) => {
    const user = users[userType];
    cy.login(user.email, user.password);
  });
});
