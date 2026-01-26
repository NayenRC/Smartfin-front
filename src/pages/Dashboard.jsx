import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDashboardSummary } from "../services/dashboardService";
import StatCard from "../components/dashboard/StatCard";
import ExpensesChart from "../components/dashboard/ExpensesChart";
import BalanceChart from "../components/dashboard/BalanceChart";

const Dashboard = () => {
  const { getToken } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      const summary = await getDashboardSummary(token);
      setData(summary);
    }
    load();
  }, []);

  if (!data) {
    return <p className="p-6">Cargando dashboard...</p>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Resumen financiero</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Ingresos" value={`$${data.income}`} />
        <StatCard title="Gastos" value={`$${data.expenses}`} />
        <StatCard title="Balance" value={`$${data.balance}`} />
      </div>
    </div>
  );
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <ExpensesChart data={data.expensesByCategory} />
  <BalanceChart
    income={data.income}
    expenses={data.expenses}
  />
</div>

};

export default Dashboard;

