# language: es
@dashboard
Característica: Dashboard de SmartFin
  Como usuario autenticado
  Quiero ver mi dashboard financiero
  Para conocer el estado de mis finanzas

  Antecedentes:
    Dado que estoy logueado en la aplicación

  @smoke
  Escenario: Visualización de resumen financiero
    Cuando estoy en el dashboard
    Entonces debería ver el resumen de ingresos
    Y debería ver el resumen de gastos
    Y debería ver el balance actual

  @charts
  Escenario: Visualización de gráficos
    Cuando estoy en el dashboard
    Entonces debería ver el gráfico de gastos por categoría
    Y debería ver el gráfico de balance mensual

  @navigation
  Escenario: Navegación a categorías
    Cuando hago clic en el menú de categorías
    Entonces debería ver la página de categorías

  @logout
  Escenario: Cerrar sesión
    Cuando hago clic en el botón de cerrar sesión
    Entonces debería ser redirigido al login
    Y no debería tener acceso al dashboard
