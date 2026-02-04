# language: es
@registro
Característica: Registro de Usuario en SmartFin
  Como nuevo usuario
  Quiero poder crear una cuenta
  Para acceder a las funcionalidades de SmartFin

  Antecedentes:
    Dado que estoy en la página de registro

  @smoke @critical
  Escenario: Registro exitoso con datos válidos
    Cuando ingreso el nombre "Juan Pérez"
    Y ingreso el email "nuevo@test.com"
    Y ingreso la contraseña "password123"
    Y hago clic en el botón de registrarse
    Entonces debería ver un mensaje de éxito
    Y debería ser redirigido al login

  @negative
  Escenario: Registro fallido con email existente
    Cuando ingreso el nombre "Usuario Test"
    Y ingreso el email "existente@test.com"
    Y ingreso la contraseña "password123"
    Y hago clic en el botón de registrarse
    Entonces debería ver un mensaje de error de usuario existente

  @validation
  Escenario: Validación de formato de email
    Cuando ingreso el nombre "Test User"
    Y ingreso el email "emailinvalido"
    Y ingreso la contraseña "password123"
    Y hago clic en el botón de registrarse
    Entonces debería ver un error de formato de email

  @navigation
  Escenario: Navegación a login
    Cuando hago clic en el enlace de iniciar sesión
    Entonces debería ver la página de login
