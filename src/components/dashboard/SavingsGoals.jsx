import { useEffect, useState } from "react";
import { Trophy, Target } from "lucide-react";
import api from "../../services/api";
import "../../styles/dashboard.css";

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     Cargar metas (solo lectura)
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
        <Trophy size={18} className="text-neon-purple" />
        <h3 className="text-lg font-semibold text-white">
          Metas de Ahorro
        </h3>
      </div>

      {/* Contenido */}
      <div className="flex-1">
        {loading ? (
          <p className="expenses-empty">Cargando metas...</p>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4 text-gray-400">
            <div className="p-4 rounded-full bg-neon-purple/10">
              <Target size={32} className="text-neon-purple" />
            </div>

            <p className="text-lg font-medium text-white">
              No tienes metas activas
            </p>

            <p className="text-sm max-w-xs">
              Crea y gestiona tus metas desde{" "}
              <span className="text-neon-green font-medium">
                SmartBot en Telegram
              </span>{" "}
              y aquí podrás ver tu progreso.
            </p>

            <a
              href={`https://t.me/${import.meta.env.VITE_TELEGRAM_BOT_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-5 py-2 rounded-full bg-neon-green/10 border border-neon-green/30 text-neon-green hover:bg-neon-green/20 transition"
            >
              Ir a Telegram →
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => {
              const pct = progress(
                Number(goal.monto_actual || 0),
                Number(goal.monto_objetivo)
              );

              return (
                <div
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                  key={goal.id_meta}
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-white">{goal.nombre}</p>
                    <p className="text-sm text-gray-400">
                      ${Number(goal.monto_actual || 0).toLocaleString()} / $
                      {Number(goal.monto_objetivo).toLocaleString()}
                    </p>
                  </div>

                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-purple transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {pct.toFixed(0)}% completado
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;
