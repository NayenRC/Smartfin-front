// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  MoveRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";

import "../styles/dashboard.css";

// Services
import { getDashboardResumen } from "../services/dashboardService";

// Components
import ExpensesChart from "../components/dashboard/ExpensesChart";
import BalanceChart from "../components/dashboard/BalanceChart";
import SavingsGoals from "../components/dashboard/SavingsGoals";

const Dashboard = () => {
  const { user } = useAuth();

  const [resumen, setResumen] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
  });

  const [gastosCategoria, setGastosCategoria] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await getDashboardResumen();
        console.log("📊 Dashboard resumen:", data);
        console.log("categorías:", data.por_categoria);


        setResumen({
          ingresos: data.ingresos ?? 0,
          gastos: data.gastos ?? 0,
          balance: data.balance ?? 0,
        });


        setGastosCategoria(data.por_categoria ?? []);
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-400 animate-pulse">
        Cargando tus finanzas...
      </div>
    );
  }

  // 🔑 ADAPTADOR PARA EL GRÁFICO
  const expensesChartData = gastosCategoria.map((item) => ({
    category: item.nombre,
    amount: Number(item.total),
  }));

  return (
    <div className="dashboard space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Hola,{" "}
            <span className="text-neon-green">
              {user?.email?.split("@")[0] || "Viajero"}
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-400 mt-1">
            Este es el estado actual de tus finanzas
          </p>
        </div>

        <a
          href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "Smartfin27_bot"
            }`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full hover:bg-neon-green/20 transition-all group font-medium"
        >
          <span className="mr-2">Hablar con SmartBot</span>
          <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="info-card p-6">
          <TrendingUp className="absolute top-4 right-4 w-10 h-10 text-neon-green opacity-20" />
          <p className="text-gray-400 text-sm uppercase">Ingresos Totales</p>
          <h3 className="text-3xl font-bold text-white">
            ${resumen.ingresos.toLocaleString()}
          </h3>
        </div>

        <div className="info-card p-6">
          <TrendingDown className="absolute top-4 right-4 w-10 h-10 text-red-500 opacity-20" />
          <p className="text-gray-400 text-sm uppercase">Gastos Totales</p>
          <h3 className="text-3xl font-bold text-white">
            ${resumen.gastos.toLocaleString()}
          </h3>
        </div>

        <div className="info-card p-6">
          <DollarSign className="absolute top-4 right-4 w-10 h-10 text-neon-purple opacity-20" />
          <p className="text-gray-400 text-sm uppercase">Balance Actual</p>
          <h3 className="text-3xl font-bold text-white">
            ${resumen.balance.toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-section">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">
            Gastos por Categoría
          </h3>
          <ExpensesChart data={expensesChartData} />
        </div>

        <div className="dashboard-section">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">
            Balance Mensual
          </h3>
          <BalanceChart
            income={resumen.ingresos}
            expenses={resumen.gastos}
          />
        </div>
      </div>

      {/* Metas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 h-[400px]">
          <SavingsGoals />
        </div>

        <div className="lg:col-span-2 h-[400px] dashboard-section flex items-center justify-center text-gray-500">
          <p>Historial de transacciones (Próximamente)</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
