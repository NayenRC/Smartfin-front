/**
 * RegisterPage - Page Object para la página de Registro
 * 
 * Este archivo mapea todos los elementos de la página de registro
 * y proporciona métodos para interactuar con ellos.
 */
class RegisterPage {
  // ==========================================
  // SELECTORES (IDs, CSS, XPaths)
  // ==========================================
  
  // Campos del formulario
  get nameInput() {
    return cy.get('input#name');
  }

  get emailInput() {
    return cy.get('input#email');
  }

  get passwordInput() {
    return cy.get('input#password');
  }

  get submitButton() {
    return cy.get('button[type="submit"]');
  }

  // Enlaces
  get loginLink() {
    return cy.contains('a', 'Inicia sesión');
  }

  // Mensajes
  get errorMessage() {
    return cy.get('.text-red-400, .text-red-500');
  }

  get successMessage() {
    return cy.get('.text-green-400, .text-green-500');
  }

  // Branding
  get logo() {
    return cy.contains('Crear cuenta');
  }

  // ==========================================
  // ACCIONES
  // ==========================================

  /**
   * Navegar a la página de registro
   */
  visit() {
    cy.visit('/register');
  }

  /**
   * Ingresar nombre
   * @param {string} name - Nombre del usuario
   */
  typeName(name) {
    this.nameInput.clear().type(name);
  }

  /**
   * Ingresar email
   * @param {string} email - Email del usuario
   */
  typeEmail(email) {
    this.emailInput.clear().type(email);
  }

  /**
   * Ingresar contraseña
   * @param {string} password - Contraseña del usuario
   */
  typePassword(password) {
    this.passwordInput.clear().type(password);
  }

  /**
   * Hacer clic en el botón de registro
   */
  clickSubmit() {
    this.submitButton.click();
  }

  /**
   * Realizar registro completo
   * @param {string} name - Nombre del usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  register(name, email, password) {
    this.typeName(name);
    this.typeEmail(email);
    this.typePassword(password);
    this.clickSubmit();
  }

  /**
   * Hacer clic en el enlace de login
   */
  clickLoginLink() {
    this.loginLink.click();
  }

  // ==========================================
  // VALIDACIONES / ASSERTS
  // ==========================================

  /**
   * Verificar que la página de registro está visible
   */
  shouldBeVisible() {
    this.logo.should('be.visible');
    this.nameInput.should('be.visible');
    this.emailInput.should('be.visible');
    this.passwordInput.should('be.visible');
  }

  /**
   * Verificar que se muestra un mensaje de error
   */
  shouldShowError() {
    this.errorMessage.should('be.visible');
  }

  /**
   * Verificar mensaje de error específico
   * @param {string} message - Mensaje esperado
   */
  shouldShowErrorMessage(message) {
    this.errorMessage.should('contain.text', message);
  }
}

export default new RegisterPage();
