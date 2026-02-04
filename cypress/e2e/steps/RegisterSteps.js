/**
 * RegisterSteps - Step Definitions para Register.feature
 * 
 * Conecta los pasos en lenguaje humano con el código ejecutable
 */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';

// ==========================================
// GIVEN - Precondiciones
// ==========================================

Given('que estoy en la página de registro', () => {
  // Interceptar llamadas al API para mockear respuestas
  cy.intercept('POST', '**/api/auth/register', (req) => {
    // Simular registro exitoso para nuevos usuarios
    if (req.body.email === 'existente@test.com') {
      req.reply({
        statusCode: 400,
        body: { message: 'El usuario ya existe' }
      });
    } else {
      req.reply({
        statusCode: 201,
        body: { message: 'Usuario creado exitosamente' }
      });
    }
  }).as('registerRequest');
  
  RegisterPage.visit();
  RegisterPage.shouldBeVisible();
});

// ==========================================
// WHEN - Acciones
// ==========================================

When('ingreso el nombre {string}', (name) => {
  RegisterPage.typeName(name);
});

// Reutilizamos los steps de email y password del login
// pero para registro necesitamos nuevos steps específicos
When('ingreso el email de registro {string}', (email) => {
  RegisterPage.typeEmail(email);
});

When('ingreso la contraseña de registro {string}', (password) => {
  RegisterPage.typePassword(password);
});

When('hago clic en el botón de registrarse', () => {
  RegisterPage.clickSubmit();
});

When('hago clic en el enlace de iniciar sesión', () => {
  RegisterPage.clickLoginLink();
});

// ==========================================
// THEN - Validaciones
// ==========================================

Then('debería ver un mensaje de éxito', () => {
  // Después del registro exitoso, se redirige al login con mensaje
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});

Then('debería ser redirigido al login', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  LoginPage.shouldBeVisible();
});

Then('debería ver un mensaje de error de usuario existente', () => {
  RegisterPage.shouldShowErrorMessage('ya existe');
});

Then('debería ver un error de formato de email', () => {
  // Validación HTML5 del navegador
  RegisterPage.emailInput.then($el => {
    expect($el[0].validity.typeMismatch).to.be.true;
  });
});

Then('debería ver la página de login', () => {
  cy.url().should('eq', Cypress.config().baseUrl + '/');
  LoginPage.shouldBeVisible();
});
