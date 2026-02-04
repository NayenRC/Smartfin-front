/**
 * LoginSteps - Step Definitions para Login.feature
 * 
 * Conecta los pasos en lenguaje humano con el código ejecutable
 */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';

// ==========================================
// GIVEN - Precondiciones
// ==========================================

Given('que estoy en la página de login', () => {
  // Interceptar llamadas al API para mockear respuestas
  cy.intercept('POST', '**/api/auth/login', (req) => {
    // Simular login exitoso para credenciales específicas
    if (req.body.email === 'usuario@test.com' && req.body.password === 'password123') {
      req.reply({
        statusCode: 200,
        body: {
          token: 'mock-jwt-token',
          user: { id: 1, name: 'Usuario Test', email: 'usuario@test.com' }
        }
      });
    } else {
      // Simular login fallido
      req.reply({
        statusCode: 401,
        body: { message: 'Email o contraseña incorrectos' }
      });
    }
  }).as('loginRequest');
  
  // Interceptar llamadas del dashboard
  cy.intercept('GET', '**/api/dashboard/**', {
    statusCode: 200,
    body: { ingresos: 5000, gastos: 2500, balance: 2500 }
  });
  
  cy.intercept('GET', '**/api/transactions/**', { statusCode: 200, body: [] });
  cy.intercept('GET', '**/api/gastos*', { statusCode: 200, body: [] });
  cy.intercept('GET', '**/api/ingresos*', { statusCode: 200, body: [] });
  cy.intercept('GET', '**/api/metas*', { statusCode: 200, body: [] });
  cy.intercept('GET', '**/api/auth/profile', {
    statusCode: 200,
    body: { user: { id: 1, name: 'Usuario Test', email: 'usuario@test.com' } }
  });
  
  LoginPage.visit();
  LoginPage.shouldBeVisible();
});

// ==========================================
// WHEN - Acciones
// ==========================================

When('ingreso el email {string}', (email) => {
  LoginPage.typeEmail(email);
});

When('ingreso la contraseña {string}', (password) => {
  LoginPage.typePassword(password);
});

When('hago clic en el botón de ingresar', () => {
  LoginPage.clickSubmit();
});

When('hago clic en el botón de ingresar sin llenar los campos', () => {
  // No llenamos campos, solo hacemos clic
  LoginPage.clickSubmit();
});

When('hago clic en el enlace de registro', () => {
  LoginPage.clickRegisterLink();
});

// ==========================================
// THEN - Validaciones
// ==========================================

Then('debería ver el dashboard', () => {
  DashboardPage.shouldBeVisible();
});

Then('debería ver un mensaje de error', () => {
  LoginPage.shouldShowError();
});

Then('debería ver validación de campos requeridos', () => {
  LoginPage.shouldShowRequiredValidation();
});

Then('debería ver la página de registro', () => {
  cy.url().should('include', '/register');
});
