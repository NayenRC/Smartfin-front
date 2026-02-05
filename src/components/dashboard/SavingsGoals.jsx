// src/components/dashboard/SavingsGoals.jsx
import { useEffect, useState } from "react";
import { Trophy, Target } from "lucide-react";
import api from "../../services/api";
import "../../styles/dashboard.css";

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     Cargar metas
  ========================= */
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const res = await api.get("/metas");
      setGoals(res.data || []);
    } catch (error) {
      console.error("❌ Error cargando metas:", error);
    } finally {
      setLoading(false);
    }
  };

  const progress = (actual, objetivo) => {
    if (!objetivo) return 0;
    return Math.min((actual / objetivo) * 100, 100);
  };

  return (
    <div className="dashboard-section h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="text-neon-purple" size={20} />
        <h3 className="text-lg font-semibold text-gray-200">
          Metas de Ahorro
        </h3>
      </div>

      {/* Contenido */}
      {loading ? (
        <p className="text-gray-500 text-sm">Cargando metas...</p>
      ) : goals.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center gap-4 text-gray-500">
          <div className="p-4 rounded-full bg-neon-purple/10">
            <Target className="w-10 h-10 text-neon-purple" />
          </div>

          <p className="text-base font-medium text-white">
            No tienes metas activas
          </p>

          <p className="text-sm max-w-xs">
            Crea tus metas directamente desde <b>SmartBot en Telegram</b> y
            verás aquí tu progreso automáticamente.
          </p>

          <a
            href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-5 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/30 text-neon-purple hover:bg-neon-purple/20 transition"
          >
            Crear meta desde Telegram →
          </a>
        </div>
      ) : (
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {goals.map((goal) => {
            const pct = progress(
              Number(goal.monto_actual || 0),
              Number(goal.monto_objetivo)
            );

            return (
              <div
                key={goal.id_meta}
                className="p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{goal.nombre}</p>
                  <p className="text-xs text-gray-400">
                    {pct.toFixed(0)}%
                  </p>
                </div>

                <p className="text-xs text-gray-400 mb-3">
                  ${Number(goal.monto_actual || 0).toLocaleString()} / $
                  {Number(goal.monto_objetivo).toLocaleString()}
                </p>

                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-neon-purple transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {pct >= 100 && (
                  <p className="text-xs text-neon-green mt-2">
                    🎉 Meta completada
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoals;
