# Plan de Pruebas - SmartFin

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Proyecto** | SmartFin - Chatbot Financiero Personal |
| **Versión** | 1.0.0 |
| **Fecha** | 4 de febrero de 2026 |
| **Tecnologías** | React + Vite (Frontend), Node.js + Express (Backend), Supabase (BD) |
| **Repositorio** | Smartfin-front |

---

## 1. Introducción

### 1.1 Propósito
Este documento define la estrategia, alcance, recursos y cronograma de las actividades de prueba para el sistema SmartFin, una aplicación web de gestión financiera personal con chatbot integrado.

### 1.2 Alcance del Sistema
SmartFin es una aplicación que permite a los usuarios:
- Gestionar sus finanzas personales (ingresos y gastos)
- Categorizar transacciones
- Visualizar dashboards con resúmenes financieros
- Establecer metas de ahorro
- Interactuar con un chatbot financiero inteligente
- Integración con Telegram

---

## 2. Alcance de las Pruebas

### 2.1 Funcionalidades en Alcance

| Módulo | Funcionalidades | Prioridad |
|--------|-----------------|-----------|
| **Autenticación** | Login, Registro, Logout, Recuperar contraseña, Reset contraseña | P0 |
| **Dashboard** | Visualización de resumen financiero, gráficos de gastos/balance | P0 |
| **Categorías** | CRUD de categorías de transacciones | P1 |
| **Chat** | Interacción con chatbot financiero | P1 |
| **Metas de Ahorro** | CRUD de metas, seguimiento de progreso | P1 |
| **Transacciones** | Registro y listado de ingresos/gastos | P0 |
| **Integración Telegram** | Redirección y vinculación de cuenta | P2 |

### 2.2 Funcionalidades Fuera de Alcance

- Pruebas de penetración avanzadas (pentesting profundo)
- Pruebas con múltiples idiomas
- Certificaciones formales de seguridad
- Pruebas de carga extrema (>1000 usuarios)

---

## 3. Estrategia de Pruebas

### 3.1 Pirámide de Pruebas

```
        ┌─────────┐
        │   E2E   │  ← Pocos tests, flujos críticos
        ├─────────┤
        │  Integ  │  ← Tests de integración API/componentes
        ├─────────┤
        │ Unitarias│  ← Muchos tests, rápidos
        └─────────┘
```

### 3.2 Tipos de Prueba

| Tipo | Nivel | Herramientas | Responsable |
|------|-------|--------------|-------------|
| Unitarias Frontend | Componente | Vitest + React Testing Library | Equipo Dev |
| Unitarias Backend | Función/Servicio | Vitest/Jest + Supertest | Equipo Dev |
| Integración | API + Componentes | MSW + Vitest | Equipo Dev |
| E2E | Sistema completo | Cypress/Playwright | QA |
| Performance | Sistema | k6 / Lighthouse | QA |
| Seguridad | Sistema | npm audit, OWASP ZAP | QA |
| Accesibilidad | UI | Lighthouse | QA |

### 3.3 Niveles de Prioridad

| Prioridad | Descripción | Cobertura Requerida |
|-----------|-------------|---------------------|
| **P0** | Crítico - Sistema no funciona sin esto | 100% PASS |
| **P1** | Importante - Funcionalidad core | ≥ 90% PASS |
| **P2** | Deseable - Mejora UX | ≥ 80% PASS |

---

## 4. Ambiente de Pruebas

### 4.1 Ambientes

| Ambiente | URL | Propósito |
|----------|-----|-----------|
| **DEV** | localhost:5173 | Desarrollo y pruebas unitarias |
| **TEST/UAT** | localhost:5176 | Pruebas de integración y E2E |
| **PROD** | (Railway) | Solo smoke tests |

### 4.2 Datos de Prueba

| Tipo Usuario | Email | Password | Rol |
|--------------|-------|----------|-----|
| Usuario Normal | test@example.com | Test123! | user |
| Usuario Admin | admin@smartfin.com | Admin123! | admin |
| Usuario Nuevo | nuevo@test.com | Nuevo123! | user |

### 4.3 Configuración del Entorno

```bash
# Variables de entorno para pruebas
VITE_API_URL=https://backend-finanzas-chatbot-production.up.railway.app
```

---

## 5. Criterios de Aceptación

### 5.1 Criterios de Entrada (para iniciar pruebas)
- ✅ Código compilado sin errores
- ✅ Tests unitarios pasando (>80%)
- ✅ Backend desplegado y accesible
- ✅ Base de datos con datos de prueba

### 5.2 Criterios de Salida (para aprobar release)

| Categoría | Métrica | Umbral Mínimo |
|-----------|---------|---------------|
| Funcional P0 | Pass rate | 100% |
| Funcional P1 | Pass rate | ≥ 90% |
| Performance API | p95 respuesta | ≤ 800 ms |
| Performance API | Error rate | < 1% |
| UI Performance | Lighthouse Score | ≥ 70 |
| Accesibilidad | Lighthouse A11y | ≥ 80 |
| Seguridad | Vulnerabilidades críticas | 0 |
| Defectos | Críticos/Altos abiertos | 0 |

---

## 6. Herramientas

### 6.1 Frontend (React + Vite)

| Herramienta | Propósito | Versión |
|-------------|-----------|---------|
| Vitest | Tests unitarios | 4.0.x |
| React Testing Library | Tests de componentes | 16.x |
| MSW | Mock de API | 2.x |
| Cypress | E2E | 13.x |
| Lighthouse | Performance/A11y | Chrome DevTools |

### 6.2 Backend (Node.js)

| Herramienta | Propósito |
|-------------|-----------|
| Supertest | Tests de endpoints |
| Postman/Newman | Colecciones API |
| k6 | Pruebas de carga |
| npm audit | Seguridad dependencias |

---

## 7. Gestión de Defectos

### 7.1 Severidades

| Severidad | Descripción | SLA Resolución |
|-----------|-------------|----------------|
| **Crítica** | Sistema no funciona, pérdida de datos | 24 horas |
| **Alta** | Funcionalidad core afectada | 48 horas |
| **Media** | Funcionalidad secundaria afectada | 1 semana |
| **Baja** | Cosmético, mejora menor | Backlog |

### 7.2 Ciclo de Vida del Defecto

```
Nuevo → Asignado → En Progreso → Resuelto → Verificado → Cerrado
                                    ↓
                                 Reabierto
```

---

## 8. Cronograma

| Fase | Actividad | Duración | Responsable |
|------|-----------|----------|-------------|
| 1 | Diseño de casos de prueba | 2 días | QA |
| 2 | Pruebas unitarias | Continuo | Dev |
| 3 | Pruebas de integración | 3 días | Dev + QA |
| 4 | Pruebas E2E | 2 días | QA |
| 5 | Pruebas no funcionales | 2 días | QA |
| 6 | Corrección de defectos | 3 días | Dev |
| 7 | Re-testing y cierre | 1 día | QA |

---

## 9. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Backend no disponible | Media | Alto | Mock de API con MSW |
| Falta de tiempo | Alta | Alto | Priorizar P0 y P1 |
| Dependencias vulnerables | Media | Media | npm audit semanal |
| Cambios de último momento | Media | Medio | Freeze de código antes de QA |

---

## 10. Entregables

| Entregable | Ubicación | Formato |
|------------|-----------|---------|
| Plan de Pruebas | `/docs/testing/plan-de-pruebas.md` | Markdown |
| Matriz de Casos | `/docs/testing/matriz-casos.md` | Markdown/CSV |
| Reporte de Ejecución | `/docs/testing/reporte-ejecucion.md` | Markdown |
| Evidencias | `/docs/testing/evidencias/` | PNG, HTML, JSON |
| Cobertura de Código | `/coverage/` | HTML |

---

## 11. Aprobaciones

| Rol | Nombre | Fecha | Firma |
|-----|--------|-------|-------|
| QA Lead | Ricardo | 04/02/2026 | ✅ |
| Dev Lead | - | - | - |
| Product Owner | - | - | - |

---

## Anexos

- [Matriz de Casos de Prueba](./matriz-casos.md)
- [Reporte de Ejecución](./reporte-ejecucion.md)
- [Carpeta de Evidencias](./evidencias/)
