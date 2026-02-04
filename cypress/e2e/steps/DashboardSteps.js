/**
 * DashboardSteps - Step Definitions para Dashboard.feature
 * 
 * Conecta los pasos en lenguaje humano con el código ejecutable
 */
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';

// ==========================================
// GIVEN - Precondiciones
// ==========================================

Given('que estoy logueado en la aplicación', () => {
  // Simular login estableciendo token y usuario en localStorage
  // No hacemos llamada real al API para evitar dependencia del backend
  const mockUser = {
    id: 1,
    name: 'Usuario Test',
    email: 'test@smartfin.com'
  };
  const mockToken = 'mock-jwt-token-for-testing';
  
  cy.window().then((win) => {
    win.localStorage.setItem('token', mockToken);
    win.localStorage.setItem('user', JSON.stringify(mockUser));
  });
  
  // Interceptar llamadas al API para mockear respuestas
  cy.intercept('GET', '**/api/dashboard/**', {
    statusCode: 200,
    body: {
      ingresos: 5000,
      gastos: 2500,
      balance: 2500,
      por_categoria: []
    }
  }).as('getDashboard');
  
  cy.intercept('GET', '**/api/transactions/**', {
    statusCode: 200,
    body: []
  }).as('getTransactions');
  
  // Interceptar rutas de gastos e ingresos
  cy.intercept('GET', '**/api/gastos*', {
    statusCode: 200,
    body: []
  }).as('getGastos');
  
  cy.intercept('GET', '**/api/ingresos*', {
    statusCode: 200,
    body: []
  }).as('getIngresos');
  
  // Interceptar metas (con y sin parámetros)
  cy.intercept('GET', '**/api/metas*', {
    statusCode: 200,
    body: []
  }).as('getMetas');
  
  cy.intercept('GET', '**/api/auth/profile', {
    statusCode: 200,
    body: { user: mockUser }
  }).as('getProfile');
  
  DashboardPage.visit();
});

// ==========================================
// WHEN - Acciones
// ==========================================

When('estoy en el dashboard', () => {
  DashboardPage.waitForLoad();
});

When('hago clic en el menú de categorías', () => {
  DashboardPage.clickCategories();
});

When('hago clic en el botón de cerrar sesión', () => {
  DashboardPage.logout();
});

// ==========================================
// THEN - Validaciones
// ==========================================

Then('debería ver el resumen de ingresos', () => {
  DashboardPage.incomeCard.should('be.visible');
});

Then('debería ver el resumen de gastos', () => {
  DashboardPage.expensesCard.should('be.visible');
});

Then('debería ver el balance actual', () => {
  DashboardPage.balanceCard.should('be.visible');
});

Then('debería ver el gráfico de gastos por categoría', () => {
  DashboardPage.expensesChart.should('be.visible');
});

Then('debería ver el gráfico de balance mensual', () => {
  DashboardPage.balanceChart.should('be.visible');
});

Then('debería ver la página de categorías', () => {
  cy.url().should('include', '/categories');
});

// Step 'debería ser redirigido al login' está definido en RegisterSteps.js (compartido globalmente)

Then('no debería tener acceso al dashboard', () => {
  DashboardPage.shouldNotBeAuthenticated();
  cy.visit('/dashboard');
  cy.url().should('eq', Cypress.config().baseUrl + '/');
});
