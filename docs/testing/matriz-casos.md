# Matriz de Casos de Prueba - SmartFin

## Información General

| Campo | Valor |
|-------|-------|
| Proyecto | SmartFin |
| Versión | 1.0.0 |
| Última actualización | 4 de febrero de 2026 |
| Total de casos | 35 |

---

## Leyenda

### Tipos de Prueba
- **F** = Funcional
- **NF** = No Funcional

### Niveles
- **U** = Unitaria
- **INT** = Integración
- **E2E** = End-to-End

### Prioridad
- **P0** = Crítico (100% PASS requerido)
- **P1** = Importante (≥90% PASS)
- **P2** = Deseable (≥80% PASS)

### Estado
- ⏳ Pendiente
- 🔄 En Progreso
- ✅ PASS
- ❌ FAIL
- ⏸️ Bloqueado

---

## Módulo: Autenticación

### HU-01: Como usuario, quiero registrarme en el sistema para acceder a mis finanzas

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-AUTH-001 | El formulario debe validar email correcto | F | U | P0 | Página de registro cargada | 1. Ir a /register<br>2. Ingresar email inválido<br>3. Intentar enviar | Muestra error "Email inválido" | 100% match | ⏳ | - |
| F-AUTH-002 | La contraseña debe tener mínimo 6 caracteres | F | U | P0 | Página de registro cargada | 1. Ir a /register<br>2. Ingresar contraseña corta<br>3. Intentar enviar | Muestra error de validación | 100% match | ⏳ | - |
| F-AUTH-003 | Registro exitoso crea usuario y redirige | F | E2E | P0 | Email no registrado | 1. Ir a /register<br>2. Completar formulario válido<br>3. Click en registrar | Usuario creado, redirige a /dashboard | 100% match | ⏳ | - |
| F-AUTH-004 | Registro con email duplicado muestra error | F | INT | P0 | Email ya registrado | 1. Intentar registro con email existente | Muestra "El usuario ya existe" | 100% match | ⏳ | - |
| F-AUTH-005 | El campo nombre es obligatorio | F | U | P1 | Página de registro cargada | 1. Dejar nombre vacío<br>2. Completar resto<br>3. Intentar enviar | Muestra error de campo requerido | 100% match | ⏳ | - |

### HU-02: Como usuario, quiero iniciar sesión para acceder a mi cuenta

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-AUTH-006 | Login exitoso con credenciales válidas | F | E2E | P0 | Usuario registrado | 1. Ir a /login<br>2. Ingresar credenciales válidas<br>3. Click login | Redirige a /dashboard, muestra nombre | 100% match | ⏳ | - |
| F-AUTH-007 | Login fallido muestra mensaje de error | F | INT | P0 | - | 1. Ir a /login<br>2. Ingresar credenciales inválidas | Muestra "Credenciales incorrectas" | 100% match | ⏳ | - |
| F-AUTH-008 | Sesión persiste al recargar página | F | INT | P0 | Usuario logueado | 1. Login exitoso<br>2. Recargar página | Usuario sigue autenticado | 100% match | ⏳ | - |
| F-AUTH-009 | Campos vacíos muestran validación | F | U | P1 | Página login cargada | 1. Click login sin llenar campos | Muestra errores de campos requeridos | 100% match | ⏳ | - |

### HU-03: Como usuario, quiero cerrar sesión de forma segura

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-AUTH-010 | Logout limpia sesión y redirige | F | E2E | P0 | Usuario logueado | 1. Click en logout | Redirige a /login, token eliminado | 100% match | ⏳ | - |
| F-AUTH-011 | No se puede acceder a rutas protegidas sin sesión | F | INT | P0 | Sin sesión | 1. Intentar acceder a /dashboard directo | Redirige a /login | 100% match | ⏳ | - |

### HU-04: Como usuario, quiero recuperar mi contraseña si la olvido

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-AUTH-012 | Solicitud de recuperación envía email | F | INT | P1 | Email registrado | 1. Ir a /forgot-password<br>2. Ingresar email<br>3. Enviar | Muestra confirmación de envío | 100% match | ⏳ | - |
| F-AUTH-013 | Reset password con token válido funciona | F | E2E | P1 | Token válido | 1. Acceder a link de reset<br>2. Ingresar nueva contraseña | Contraseña actualizada | 100% match | ⏳ | - |

---

## Módulo: Dashboard

### HU-05: Como usuario, quiero ver un resumen de mis finanzas

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-DASH-001 | Dashboard muestra ingresos totales | F | INT | P0 | Usuario logueado con transacciones | 1. Ir a /dashboard | Muestra tarjeta con total de ingresos | 100% match | ⏳ | - |
| F-DASH-002 | Dashboard muestra gastos totales | F | INT | P0 | Usuario logueado con transacciones | 1. Ir a /dashboard | Muestra tarjeta con total de gastos | 100% match | ⏳ | - |
| F-DASH-003 | Dashboard muestra balance calculado | F | INT | P0 | Usuario logueado con transacciones | 1. Ir a /dashboard | Balance = Ingresos - Gastos | 100% match | ⏳ | - |
| F-DASH-004 | Gráfico de gastos por categoría se renderiza | F | U | P1 | Usuario logueado | 1. Ir a /dashboard | Gráfico visible y con datos | Sin errores JS | ⏳ | - |
| F-DASH-005 | Gráfico de balance histórico se renderiza | F | U | P1 | Usuario logueado | 1. Ir a /dashboard | Gráfico de línea visible | Sin errores JS | ⏳ | - |
| F-DASH-006 | Estado de carga mientras obtiene datos | F | U | P1 | Usuario logueado | 1. Ir a /dashboard | Muestra "Cargando..." inicialmente | 100% match | ⏳ | - |

---

## Módulo: Categorías

### HU-06: Como usuario, quiero gestionar mis categorías de gastos

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-CAT-001 | Listar categorías existentes | F | INT | P1 | Usuario logueado, categorías existen | 1. Ir a /categories | Lista de categorías visible | 100% match | ⏳ | - |
| F-CAT-002 | Crear nueva categoría | F | E2E | P1 | Usuario logueado | 1. Click "Nueva categoría"<br>2. Llenar formulario<br>3. Guardar | Categoría aparece en lista | 100% match | ⏳ | - |
| F-CAT-003 | Editar categoría existente | F | E2E | P1 | Categoría existe | 1. Click editar en categoría<br>2. Modificar nombre<br>3. Guardar | Cambios persistidos | 100% match | ⏳ | - |
| F-CAT-004 | Eliminar categoría con confirmación | F | E2E | P1 | Categoría existe | 1. Click eliminar<br>2. Confirmar | Categoría removida de lista | 100% match | ⏳ | - |
| F-CAT-005 | Validación de nombre requerido | F | U | P1 | Formulario abierto | 1. Intentar guardar sin nombre | Muestra error de validación | 100% match | ⏳ | - |

---

## Módulo: Chat (Chatbot Financiero)

### HU-07: Como usuario, quiero interactuar con un chatbot para consultas financieras

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-CHAT-001 | Enviar mensaje al chatbot | F | INT | P1 | Usuario logueado | 1. Ir a /chat<br>2. Escribir mensaje<br>3. Enviar | Mensaje aparece en conversación | 100% match | ⏳ | - |
| F-CHAT-002 | Recibir respuesta del chatbot | F | INT | P1 | Usuario logueado | 1. Enviar mensaje | Respuesta del bot aparece | Respuesta en <5s | ⏳ | - |
| F-CHAT-003 | Historial de mensajes visible | F | U | P1 | Mensajes previos | 1. Ir a /chat | Mensajes anteriores visibles | 100% match | ⏳ | - |
| F-CHAT-004 | Input deshabilitado mientras procesa | F | U | P2 | - | 1. Enviar mensaje | Input bloqueado hasta respuesta | Sin duplicados | ⏳ | - |

---

## Módulo: Metas de Ahorro

### HU-08: Como usuario, quiero establecer metas de ahorro

| ID | Criterio de Aceptación | Tipo | Nivel | Prioridad | Precondición | Pasos | Resultado Esperado | Umbral | Estado | Evidencia |
|----|------------------------|------|-------|-----------|--------------|-------|-------------------|--------|--------|-----------|
| F-META-001 | Crear nueva meta de ahorro | F | E2E | P1 | Usuario logueado | 1. Ir a metas<br>2. Click nueva meta<br>3. Llenar formulario<br>4. Guardar | Meta creada y visible | 100% match | ⏳ | - |
| F-META-002 | Ver progreso de meta | F | U | P1 | Meta existe con ahorros | 1. Ver lista de metas | Barra de progreso muestra % | Cálculo correcto | ⏳ | - |
| F-META-003 | Editar meta existente | F | E2E | P2 | Meta existe | 1. Click editar<br>2. Modificar<br>3. Guardar | Cambios persistidos | 100% match | ⏳ | - |
| F-META-004 | Eliminar meta | F | E2E | P2 | Meta existe | 1. Click eliminar<br>2. Confirmar | Meta removida | 100% match | ⏳ | - |

---

## Pruebas No Funcionales

### NF-01: Performance

| ID | Criterio | Tipo | Herramienta | Umbral | Estado | Evidencia |
|----|----------|------|-------------|--------|--------|-----------|
| NF-PERF-001 | API /auth/login responde rápido | NF | k6/Postman | p95 ≤ 800ms | ⏳ | - |
| NF-PERF-002 | API /dashboard/resumen responde rápido | NF | k6/Postman | p95 ≤ 800ms | ⏳ | - |
| NF-PERF-003 | Lighthouse Performance Score | NF | Lighthouse | ≥ 70 | ⏳ | - |
| NF-PERF-004 | Error rate bajo carga | NF | k6 | < 1% | ⏳ | - |

### NF-02: Seguridad

| ID | Criterio | Tipo | Herramienta | Umbral | Estado | Evidencia |
|----|----------|------|-------------|--------|--------|-----------|
| NF-SEC-001 | Sin vulnerabilidades críticas en dependencias | NF | npm audit | 0 críticas | ⏳ | - |
| NF-SEC-002 | Rutas protegidas requieren autenticación | NF | Postman | 401 sin token | ⏳ | - |
| NF-SEC-003 | Tokens no expuestos en logs/respuestas | NF | Manual | No exposición | ⏳ | - |
| NF-SEC-004 | Contraseñas hasheadas en BD | NF | Manual | bcrypt/argon2 | ⏳ | - |

### NF-03: Accesibilidad

| ID | Criterio | Tipo | Herramienta | Umbral | Estado | Evidencia |
|----|----------|------|-------------|--------|--------|-----------|
| NF-A11Y-001 | Lighthouse Accessibility - Login | NF | Lighthouse | ≥ 80 | ⏳ | - |
| NF-A11Y-002 | Lighthouse Accessibility - Dashboard | NF | Lighthouse | ≥ 80 | ⏳ | - |
| NF-A11Y-003 | Navegación por teclado funciona | NF | Manual | Tab funcional | ⏳ | - |

### NF-04: Usabilidad

| ID | Criterio | Tipo | Herramienta | Umbral | Estado | Evidencia |
|----|----------|------|-------------|--------|--------|-----------|
| NF-USA-001 | Registro completable en <2 min | NF | Manual | ≤ 2 min | ⏳ | - |
| NF-USA-002 | Login completable en <30 seg | NF | Manual | ≤ 30 seg | ⏳ | - |
| NF-USA-003 | Mensajes de error claros y descriptivos | NF | Manual | Entendibles | ⏳ | - |

### NF-05: Compatibilidad

| ID | Criterio | Tipo | Herramienta | Umbral | Estado | Evidencia |
|----|----------|------|-------------|--------|--------|-----------|
| NF-COMP-001 | Funciona en Chrome | NF | Manual | Sin errores | ⏳ | - |
| NF-COMP-002 | Funciona en Firefox | NF | Manual | Sin errores | ⏳ | - |
| NF-COMP-003 | Responsive móvil 360x640 | NF | DevTools | UI usable | ⏳ | - |
| NF-COMP-004 | Responsive desktop 1366x768 | NF | DevTools | UI usable | ⏳ | - |

---

## Resumen de Casos

| Módulo | Total | P0 | P1 | P2 |
|--------|-------|----|----|-----|
| Autenticación | 13 | 8 | 4 | 1 |
| Dashboard | 6 | 3 | 3 | 0 |
| Categorías | 5 | 0 | 5 | 0 |
| Chat | 4 | 0 | 3 | 1 |
| Metas de Ahorro | 4 | 0 | 2 | 2 |
| No Funcionales | 15 | 5 | 8 | 2 |
| **TOTAL** | **47** | **16** | **25** | **6** |

---

## Matriz de Trazabilidad (Casos → Tests Automatizados)

| Caso ID | Test Automatizado | Archivo |
|---------|-------------------|---------|
| F-AUTH-003 | renders registration form | Register.test.jsx |
| F-AUTH-006 | renders login form correctly | Login.test.jsx |
| F-AUTH-008 | recovers user from localStorage | AuthContext.test.jsx |
| F-AUTH-010 | handles logout correctly | AuthContext.test.jsx |
| F-DASH-006 | renders dashboard loading state | Dashboard.test.jsx |
| F-CAT-001 | renders categories list | Categories.test.jsx |
| F-CAT-005 | calls onSubmit with form data | CategoryForm.test.jsx |
| F-CHAT-001 | renders chat interface | Chat.test.jsx |
| F-META-001 | handles creating a new goal | SavingsGoals.test.jsx |
