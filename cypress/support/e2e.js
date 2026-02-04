// ***********************************************************
// Cypress Support File - e2e.js
// 
// Archivo de soporte que se ejecuta antes de cada test
// Similar al Hooks.java en Selenium + Cucumber
// ***********************************************************

// Importar comandos personalizados
import './commands';

// Configuración global antes de cada test
beforeEach(() => {
  // Limpiar localStorage antes de cada test
  cy.clearLocalStorage();
  
  // Opcional: Interceptar llamadas al API para logging
  cy.intercept('POST', '**/api/auth/**').as('authRequest');
});

// Manejar excepciones no capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignorar errores de ResizeObserver que no afectan los tests
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});
