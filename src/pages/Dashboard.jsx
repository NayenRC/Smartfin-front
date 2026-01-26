import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/dashboardService";
import StatCard from "../components/dashboard/StatCard";
import ExpensesChart from "../components/dashboard/ExpensesChart";
import BalanceChart from "../components/dashboard/BalanceChart";

const Dashboard = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const summary = await getDashboardSummary(token);
        setData(summary);
      } catch (err) {
        console.error("Error cargando dashboard", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Cargando dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 text-red-400">
        No hay datos para mostrar
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">
        Resumen financiero
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ingresos" value={`$${data.income}`} />
        <StatCard title="Gastos" value={`$${data.expenses}`} />
        <StatCard title="Balance" value={`$${data.balance}`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ExpensesChart data={data.expensesByCategory || []} />
        <BalanceChart
          income={data.income}
          expenses={data.expenses}
        />
      </div>
    </div>
  );
};

export default Dashboard;
