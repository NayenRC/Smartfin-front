import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

/*
  ⚠️ ESTA IMPORTACIÓN SE USA SOLO CUANDO
  EL BACKEND ESTÉ LISTO Y APROBADO
*/
// import { getDashboardSummary } from "../services/dashboardService";

import StatCard from "../components/dashboard/StatCard";
import ExpensesChart from "../components/dashboard/ExpensesChart";
import BalanceChart from "../components/dashboard/BalanceChart";

/*
  ================================
  🔹 DATOS MOCK TEMPORALES
  ================================
  ✔ Se usan mientras el PR del backend
    esté pendiente
  ✔ Permite avanzar en UI, gráficos
    y presentación
  ✔ SE ELIMINAN cuando el backend
    esté listo
*/
const MOCK_DATA = {
  income: 1200000,
  expenses: 850000,
  balance: 350000,
  expensesByCategory: [
    { category: "Alimentación", amount: 300000 },
    { category: "Transporte", amount: 150000 },
    { category: "Entretenimiento", amount: 200000 },
    { category: "Servicios", amount: 200000 },
  ],
};

const Dashboard = () => {
  const { getToken } = useAuth();

  /*
    🔹 data:
    - null → backend aún no responde
    - object → datos reales o mock
  */
  const [data, setData] = useState(null);

  /*
    🔹 loading:
    evita pantalla blanca
  */
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        /*
          ===================================
          🚀 CUANDO EL BACKEND ESTÉ LISTO
          ===================================

          const token = await getToken();
          const summary = await getDashboardSummary(token);
          setData(summary);
        */

        /*
          ===================================
          🧪 MODO MOCK (ACTUAL)
          ===================================
        */
        setData(MOCK_DATA);
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  /*
    🔹 Estado de carga
  */
  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard...
      </div>
    );
  }

  /*
    🔹 Fallback de seguridad
  */
  if (!data) {
    return (
      <div className="p-6 text-red-400">
        No hay datos para mostrar
      </div>
    );
  }

  /*
    🔹 Render final del dashboard
  */
  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">
        Resumen financiero
      </h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ingresos" value={`$${data.income}`} />
        <StatCard title="Gastos" value={`$${data.expenses}`} />
        <StatCard title="Balance" value={`$${data.balance}`} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpensesChart data={data.expensesByCategory} />
        <BalanceChart
          income={data.income}
          expenses={data.expenses}
        />
      </div>
    </div>
  );
};

export default Dashboard;


