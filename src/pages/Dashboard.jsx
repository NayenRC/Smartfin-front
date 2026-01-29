import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MoveRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../services/dashboardService";

// Components
import ExpensesChart from "../components/dashboard/ExpensesChart";
import BalanceChart from "../components/dashboard/BalanceChart";
import SavingsGoals from "../components/dashboard/SavingsGoals";

const Dashboard = () => {
  const { user, getToken } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const summary = await getDashboardSummary();
        setData(summary);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400 animate-pulse">
        Cargando tus finanzas...
      </div>
    );
  }

  // Si no hay data por error de conexión
  if (!data) {
    return (
      <div className="p-6 text-red-400 text-center">
        No se pudo obtener la información del servidor. Revisa tu conexión.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hola, <span className="text-neon-green">{user?.email?.split('@')[0] || 'Viajero'}</span> 👋
          </h1>
          <p className="text-gray-400 mt-1">Este es el estado actual de tus finanzas</p>
        </div>

        <a
          href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME || 'Smartfin27_bot'}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full hover:bg-neon-green/20 transition-all group font-medium"
        >
          <span className="mr-2">Hablar con SmartBot</span>
          <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* DVDs / KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="info-card p-6 rounded-2xl bg-card border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp className="w-16 h-16 text-neon-green" />
          </div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Ingresos Totales</p>
          <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-neon-green transition-colors">
            ${data.income?.toLocaleString() || 0}
          </h3>
          <div className="mt-4 flex items-center text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded w-fit">
            <TrendingUp className="w-3 h-3 mr-1" /> +12% vs mes anterior
          </div>
        </div>

        <div className="info-card p-6 rounded-2xl bg-card border border-border relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingDown className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Gastos Totales</p>
          <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-red-400 transition-colors">
            ${data.expenses?.toLocaleString() || 0}
          </h3>
          <div className="mt-4 flex items-center text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded w-fit">
            <TrendingDown className="w-3 h-3 mr-1" /> +5% vs mes anterior
          </div>
        </div>

        <div className="info-card p-6 rounded-2xl bg-card border border-border relative overflow-hidden group shadow-glow">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-16 h-16 text-neon-purple" />
          </div>
          <p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Balance Actual</p>
          <h3 className="text-3xl font-extrabold text-white mt-1 group-hover:text-neon-purple transition-colors">
            ${data.balance?.toLocaleString() || 0}
          </h3>
          <div className="mt-4 text-xs text-gray-500">
            Disponible para ahorrar o invertir
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-neon-purple mr-2"></span>
            Gastos por Categoría
          </h3>
          <ExpensesChart data={data.expensesByCategory || []} />
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-200 mb-6 flex items-center">
            <span className="w-2 h-2 rounded-full bg-neon-green mr-2"></span>
            Balance Mensual
          </h3>
          <BalanceChart income={data.income || 0} expenses={data.expenses || 0} />
        </div>
      </div>

      {/* Secondary Section - Savings & History (Future) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <SavingsGoals />
        </div>
        {/* Placeholder for future components or chat history summary */}
        <div className="lg:col-span-2 h-[400px] bg-card/30 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex items-center justify-center text-gray-500">
          <p>Historial de transacciones (Próximamente)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
