// src/pages/Dashboard.jsx
import { useEffect, useState, lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";
import {
  MoveRight,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
} from "lucide-react";

import "../styles/dashboard.css";

// Services
import { getDashboardResumen } from "../services/dashboardService";
import { getRecentTransactions } from "../services/transactionService";

// Lazy components
const ChatPanel = lazy(() => import("../components/dashboard/ChatPanel"));
const ExpensesChart = lazy(() => import("../components/dashboard/ExpensesChart"));
const BalanceChart = lazy(() => import("../components/dashboard/BalanceChart"));
const SavingsGoals = lazy(() => import("../components/dashboard/SavingsGoals"));

// Skeleton
const ChartSkeleton = () => (
  <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 h-full animate-pulse">
    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4" />
    <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mt-10" />
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();

  const [resumen, setResumen] = useState({ ingresos: 0, gastos: 0, balance: 0 });
  const [gastosCategoria, setGastosCategoria] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [ingresos, setIngresos] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [data, transactions] = await Promise.all([
          getDashboardResumen(),
          getRecentTransactions(),
        ]);

        setResumen({
          ingresos: data.ingresos ?? 0,
          gastos: data.gastos ?? 0,
          balance: data.balance ?? 0,
        });

        setGastosCategoria(data.por_categoria ?? []);
        setRecentTransactions(transactions);

        setIngresos(transactions.filter((t) => t.type === "income"));
        setGastos(transactions.filter((t) => t.type === "expense"));
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

  const expensesChartData = gastosCategoria.map((i) => ({
    category: i.nombre,
    amount: Number(i.total),
  }));

  return (
    <div className="dashboard space-y-10">

      {/* HEADER */}
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
          href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-6 py-3 bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-full hover:bg-neon-green/20 transition group font-medium"
        >
          Hablar con SmartBot
          <MoveRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition" />
        </a>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPI title="Ingresos Totales" value={resumen.ingresos} icon={<TrendingUp />} color="text-neon-green" />
        <KPI title="Gastos Totales" value={resumen.gastos} icon={<TrendingDown />} color="text-red-500" />
        <KPI title="Balance Actual" value={resumen.balance} icon={<DollarSign />} color="text-neon-purple" />

        <div className="info-card p-6">
          <Percent className="absolute top-4 right-4 w-10 h-10 text-yellow-500 opacity-20" />
          <p className="text-gray-400 text-sm uppercase">% Gastos vs Ingresos</p>
          <h3 className="text-3xl font-bold text-white">
            {resumen.ingresos > 0
              ? `${((resumen.gastos / resumen.ingresos) * 100).toFixed(1)}%`
              : "0%"}
          </h3>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section title="Gastos por Categoría">
          <Suspense fallback={<ChartSkeleton />}>
            <ExpensesChart data={expensesChartData} />
          </Suspense>
        </Section>

        <Section title="Balance Mensual">
          <Suspense fallback={<ChartSkeleton />}>
            <BalanceChart income={resumen.ingresos} expenses={resumen.gastos} />
          </Suspense>
        </Section>
      </div>

      {/* METAS + ACTIVIDAD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Section>
          <Suspense fallback={<ChartSkeleton />}>
            <SavingsGoals />
          </Suspense>
        </Section>

        <Section className="lg:col-span-2" title="Actividad Reciente">
          <div className="space-y-3 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
            {recentTransactions.map((tx, i) => (
              <div key={i} className="flex justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                <span className="text-white">{tx.descripcion}</span>
                <span className={tx.type === "income" ? "text-neon-green" : "text-red-500"}>
                  {tx.type === "income" ? "+" : "-"}${Number(tx.monto).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* SEPARADOR */}
      <div className="border-t border-white/10 my-10" />

      {/* CHAT */}
      <div className="max-w-5xl mx-auto bg-card/70 backdrop-blur border border-border rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border flex justify-between">
          <h3 className="text-lg font-semibold text-white">💬 SmartBot</h3>
          <span className="text-xs text-gray-500">Registro y consultas rápidas</span>
        </div>

        <div className="h-[420px]">
          <Suspense fallback={<ChartSkeleton />}>
            <ChatPanel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

/* COMPONENTES AUX */
function KPI({ title, value, icon, color }) {
  return (
    <div className="info-card p-6">
      <div className={`absolute top-4 right-4 w-10 h-10 opacity-20 ${color}`}>
        {icon}
      </div>
      <p className="text-gray-400 text-sm uppercase">{title}</p>
      <h3 className="text-3xl font-bold text-white">${value.toLocaleString()}</h3>
    </div>
  );
}

function Section({ title, children, className = "" }) {
  return (
    <div className={`dashboard-section ${className}`}>
      {title && <h3 className="text-lg font-semibold text-gray-200 mb-4">{title}</h3>}
      {children}
    </div>
  );
}
