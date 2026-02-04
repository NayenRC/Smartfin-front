# language: es
@login
Característica: Inicio de Sesión en SmartFin
  Como usuario de SmartFin
  Quiero poder iniciar sesión con mi cuenta
  Para acceder a mi dashboard financiero

  Antecedentes:
    Dado que estoy en la página de login

  @smoke @critical
  Escenario: Login exitoso con credenciales válidas
    Cuando ingreso el email "usuario@test.com"
    Y ingreso la contraseña "password123"
    Y hago clic en el botón de ingresar
    Entonces debería ver el dashboard

  @negative
  Escenario: Login fallido con credenciales inválidas
    Cuando ingreso el email "usuario@test.com"
    Y ingreso la contraseña "passwordincorrecto"
    Y hago clic en el botón de ingresar
    Entonces debería ver un mensaje de error

  @validation
  Escenario: Validación de campos vacíos
    Cuando hago clic en el botón de ingresar sin llenar los campos
    Entonces debería ver validación de campos requeridos

  @navigation
  Escenario: Navegación a registro
    Cuando hago clic en el enlace de registro
    Entonces debería ver la página de registro
