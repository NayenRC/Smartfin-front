// src/pages/Dashboard.jsx
import { useEffect, useState, lazy, Suspense } from "react";
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
import { getRecentTransactions } from "../services/transactionService";

// Lazy loading de componentes pesados (Recharts)
const ExpensesChart = lazy(() => import("../components/dashboard/ExpensesChart"));
const BalanceChart = lazy(() => import("../components/dashboard/BalanceChart"));
const SavingsGoals = lazy(() => import("../components/dashboard/SavingsGoals"));

// Skeleton de carga para gráficos
const ChartSkeleton = () => (
  <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="flex-1 flex items-center justify-center">
      <div className="w-32 h-32 bg-gray-700 rounded-full"></div>
    </div>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();

  const [resumen, setResumen] = useState({
    ingresos: 0,
    gastos: 0,
    balance: 0,
  });

  const [gastosCategoria, setGastosCategoria] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [data, transactions] = await Promise.all([
          getDashboardResumen(),
          getRecentTransactions()
        ]);

        console.log("📊 Dashboard resumen:", data);
        console.log("🕒 Recent transactions:", transactions);

        setResumen({
          ingresos: data.ingresos ?? 0,
          gastos: data.gastos ?? 0,
          balance: data.balance ?? 0,
        });

        setGastosCategoria(data.por_categoria ?? []);
        setRecentTransactions(transactions);
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
              {user?.nombre || user?.email?.split("@")[0] || "Viajero"}
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

      {/* Charts - Con lazy loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-section">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">
            Gastos por Categoría
          </h3>
          <Suspense fallback={<ChartSkeleton />}>
            <ExpensesChart data={expensesChartData} />
          </Suspense>
        </div>

        <div className="dashboard-section">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">
            Balance Mensual
          </h3>
          <Suspense fallback={<ChartSkeleton />}>
            <BalanceChart
              income={resumen.ingresos}
              expenses={resumen.gastos}
            />
          </Suspense>
        </div>
      </div>

      {/* Metas y Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 min-h-[400px]">
          <Suspense fallback={<ChartSkeleton />}>
            <SavingsGoals />
          </Suspense>
        </div>

        <div className="lg:col-span-2 min-h-[400px] dashboard-section">
          <h3 className="text-lg font-semibold text-gray-200 mb-6">Actividad Reciente</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {recentTransactions.map((tx, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${tx.type === 'income' ? 'bg-neon-green/10' : 'bg-red-500/10'}`}>
                      {tx.type === 'income' ?
                        <TrendingUp className="w-5 h-5 text-neon-green" /> :
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      }
                    </div>
                    <div>
                      <p className="font-medium text-white">{tx.descripcion || 'Sin descripción'}</p>
                      <p className="text-xs text-gray-500">{new Date(tx.fecha).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${tx.type === 'income' ? 'text-neon-green' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}${Number(tx.monto).toLocaleString()}
                    </p>
                    {tx.categoria && <p className="text-xs text-gray-400">{tx.categoria.nombre}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
              <DollarSign className="w-12 h-12 opacity-20" />
              <p>No hay transacciones recientes</p>
              <p className="text-xs">¡Empieza a hablar con el bot para ver tus datos aquí!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
