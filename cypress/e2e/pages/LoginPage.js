/**
 * LoginPage - Page Object para la página de Login
 * 
 * Este archivo mapea todos los elementos de la página de login
 * y proporciona métodos para interactuar con ellos.
 */
class LoginPage {
  // ==========================================
  // SELECTORES (IDs, CSS, XPaths)
  // ==========================================
  
  // Campos del formulario
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
  get registerLink() {
    return cy.contains('a', 'Regístrate');
  }

  get forgotPasswordLink() {
    return cy.contains('a', '¿Olvidaste tu contraseña?');
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
    return cy.contains('Bienvenid@');
  }

  // ==========================================
  // ACCIONES
  // ==========================================

  /**
   * Navegar a la página de login
   */
  visit() {
    cy.visit('/');
  }

  /**
   * Ingresar email en el campo correspondiente
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
   * Hacer clic en el botón de submit
   */
  clickSubmit() {
    this.submitButton.click();
  }

  /**
   * Realizar login completo
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   */
  login(email, password) {
    this.typeEmail(email);
    this.typePassword(password);
    this.clickSubmit();
  }

  /**
   * Hacer clic en el enlace de registro
   */
  clickRegisterLink() {
    this.registerLink.click();
  }

  // ==========================================
  // VALIDACIONES / ASSERTS
  // ==========================================

  /**
   * Verificar que la página de login está visible
   */
  shouldBeVisible() {
    this.logo.should('be.visible');
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
   * Verificar que se muestra un mensaje específico de error
   * @param {string} message - Mensaje esperado
   */
  shouldShowErrorMessage(message) {
    this.errorMessage.should('contain.text', message);
  }

  /**
   * Verificar que los campos tienen validación required
   */
  shouldShowRequiredValidation() {
    this.emailInput.then($el => {
      expect($el[0].validity.valueMissing).to.be.true;
    });
  }
}

export default new LoginPage();
