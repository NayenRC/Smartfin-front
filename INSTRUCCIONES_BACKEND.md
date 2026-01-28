# Guía de Actualización para el Backend

Para que el frontend y el bot de Telegram funcionen en perfecta sintonía, sigue estos pasos en tu proyecto de **backend**.

## 1. Corrección de Base de Datos (Migración)

Hay un error de tipos en la tabla `categorias` (y potencialmente en `gasto` e `ingreso`) donde el campo `user_id` espera un número pero el sistema usa IDs de texto (UUID).

**Acción**: Crea una nueva migración en tu backend:
`npx knex migrate:make fix_finance_schema`

Copia este contenido en el archivo generado:

```javascript
export const up = async function (knex) {
    // Corregir Categorias
    await knex.schema.alterTable('categorias', (table) => {
        try { table.dropForeign('user_id'); } catch (e) {}
        table.uuid('user_id').alter().references('user_id').inTable('usuario').onDelete('CASCADE');
    });

    // Corregir Gasto
    const hasGasto = await knex.schema.hasTable('gasto');
    if (hasGasto) {
        await knex.schema.alterTable('gasto', (table) => {
            try { table.dropForeign('user_id'); } catch (e) {}
            table.uuid('user_id').alter().references('user_id').inTable('usuario').onDelete('CASCADE');
        });
    }

    // Corregir Ingreso
    const hasIngreso = await knex.schema.hasTable('ingreso');
    if (hasIngreso) {
        await knex.schema.alterTable('ingreso', (table) => {
            try { table.dropForeign('user_id'); } catch (e) {}
            table.uuid('user_id').alter().references('user_id').inTable('usuario').onDelete('CASCADE');
        });
    }
};

export const down = function (knex) {
    return Promise.resolve();
};
```

Luego ejecuta: `npm run db:migrate`

---

## 2. Vincular Dashboard con los datos del Bot

Para que los gráficos del Dashboard muestren lo que registras en Telegram, debes usar el servicio `supabaseService` en el controlador.

**Archivo**: `src/controllers/DashboardController.js`

Reemplaza todo el contenido por este:

```javascript
import supabaseService from "../services/supabaseService.js";

export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id || req.user.user_id;

    // 1. Obtener sumas desde el servicio que usa el Bot
    const incomeSummary = await supabaseService.getIncomeSummary(userId);
    const expenseSummary = await supabaseService.getExpenseSummary(userId);
    const expensesByCategory = await supabaseService.getExpensesByCategory(userId);

    const incomeTotal = Number(incomeSummary?.total_monto || 0);
    const expenseTotal = Number(expenseSummary?.total_monto || 0);

    // 2. Responder con el formato que espera el Frontend
    res.json({
      income: incomeTotal,
      expenses: expenseTotal,
      balance: incomeTotal - expenseTotal,
      expensesByCategory: expensesByCategory.map((g) => ({
        category: g.categoria,
        amount: Number(g.total || 0),
      })),
    });
  } catch (error) {
    console.error("❌ DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Error al cargar el dashboard" });
  }
};
```

---

## 3. Resumen de cambios en Frontend (Ya aplicados)

Para tu información, estos son los cambios que ya hice en tu **frontend**:
- **SmartChat**: Ahora el menú y los botones de ayuda abren directamente Telegram (`t.me/Smartfin27_bot`) en una pestaña nueva.
- **Categorías**: Ya envían los datos mapeados (`nombre`, `tipo`) para que el backend los entienda.
- **Dashboard**: Ya intenta consumir este nuevo formato de datos.

> [!TIP]
> Una vez apliques los cambios de esta guía en tu backend, reinicia el servidor y ¡todo estará conectado!
