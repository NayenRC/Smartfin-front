/**
 * DashboardPage - Page Object para la página de Dashboard
 * 
 * Este archivo mapea todos los elementos del dashboard
 * y proporciona métodos para interactuar con ellos.
 */
class DashboardPage {
  // ==========================================
  // SELECTORES (IDs, CSS, XPaths)
  // ==========================================
  
  // KPIs / Resumen
  get incomeCard() {
    return cy.contains('Ingresos Totales').parent();
  }

  get expensesCard() {
    return cy.contains('Gastos Totales').parent();
  }

  get balanceCard() {
    return cy.contains('Balance Actual').parent();
  }

  // Gráficos
  get expensesChart() {
    return cy.contains('Gastos por Categoría').parent();
  }

  get balanceChart() {
    return cy.contains('Balance Mensual').parent();
  }

  // Navegación
  get categoriesLink() {
    return cy.contains('a', 'Categorías');
  }

  get dashboardLink() {
    return cy.contains('a', 'Dashboard');
  }

  get logoutButton() {
    // El botón puede tener texto "Salir" (desktop) o "Cerrar Sesión" (mobile)
    return cy.contains('button', /Salir|Cerrar Sesión/i);
  }

  // Header
  get userMenu() {
    return cy.get('[data-testid="user-menu"]');
  }

  get logo() {
    return cy.contains('Smartfin');
  }

  // Actividad reciente
  get recentActivity() {
    return cy.contains('Actividad Reciente').parent();
  }

  // Loading
  get loadingSpinner() {
    return cy.contains('Cargando');
  }

  // ==========================================
  // ACCIONES
  // ==========================================

  /**
   * Navegar al dashboard (requiere estar autenticado)
   */
  visit() {
    cy.visit('/dashboard');
    // Esperar a que el dashboard cargue
    cy.url().should('include', '/dashboard');
  }

  /**
   * Esperar a que el dashboard cargue completamente
   */
  waitForLoad() {
    // Esperar a que desaparezca el loading o aparezcan los KPIs
    cy.get('body').should('be.visible');
    // Dar tiempo para que React renderice
    cy.wait(500);
  }

  /**
   * Hacer clic en categorías
   */
  clickCategories() {
    this.categoriesLink.click();
  }

  /**
   * Cerrar sesión
   */
  logout() {
    this.logoutButton.click();
  }

  // ==========================================
  // VALIDACIONES / ASSERTS
  // ==========================================

  /**
   * Verificar que el dashboard está visible
   */
  shouldBeVisible() {
    cy.url().should('include', '/dashboard');
    this.incomeCard.should('be.visible');
    this.expensesCard.should('be.visible');
    this.balanceCard.should('be.visible');
  }

  /**
   * Verificar que los KPIs muestran valores
   */
  shouldShowKPIs() {
    this.incomeCard.should('contain', '$');
    this.expensesCard.should('contain', '$');
    this.balanceCard.should('contain', '$');
  }

  /**
   * Verificar que los gráficos están visibles
   */
  shouldShowCharts() {
    this.expensesChart.should('be.visible');
    this.balanceChart.should('be.visible');
  }

  /**
   * Verificar que el usuario está autenticado
   */
  shouldBeAuthenticated() {
    cy.window().its('localStorage.token').should('exist');
  }

  /**
   * Verificar que el usuario NO está autenticado
   */
  shouldNotBeAuthenticated() {
    cy.window().its('localStorage.token').should('not.exist');
  }
}

export default new DashboardPage();
