import { useEffect, useState } from "react";

import { Plus, Target, Trash2, Trophy } from "lucide-react";
import api from "../../services/api";
import "../../styles/dashboard.css";

const SavingsGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newGoal, setNewGoal] = useState({
    nombre: "",
    monto_objetivo: "",
  });

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

  /* =========================
     Crear meta
  ========================= */
  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/metas", {
        nombre: newGoal.nombre,
        monto_objetivo: Number(newGoal.monto_objetivo),
      });

      setNewGoal({ nombre: "", monto_objetivo: "" });
      setShowForm(false);
      loadGoals();
    } catch (error) {
      console.error("❌ Error creando meta:", error);
      alert("No se pudo crear la meta");
    }
  };

  /* =========================
     Eliminar meta
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta meta?")) return;

    try {
      await api.delete(`/metas/${id}`);
      loadGoals();
    } catch (error) {
      console.error("❌ Error eliminando meta:", error);
    }
  };

  const progress = (actual, objetivo) => {
    if (!objetivo) return 0;
    return Math.min((actual / objetivo) * 100, 100);
  };

  return (
    <div className="dashboard-section h-full flex flex-col">
      {/* Header */}
      <div className="savings-header">
        <h3 className="savings-title-header">
          <Trophy size={18} />
          Metas de Ahorro
        </h3>

        <button
          className="savings-add-btn"
          onClick={() => setShowForm(!showForm)}
          title="Nueva meta"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form className="savings-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Nombre de la meta"
            value={newGoal.nombre}
            onChange={(e) =>
              setNewGoal({ ...newGoal, nombre: e.target.value })
            }
            required
          />

          <input
            type="number"
            placeholder="Monto objetivo"
            value={newGoal.monto_objetivo}
            onChange={(e) =>
              setNewGoal({
                ...newGoal,
                monto_objetivo: e.target.value,
              })
            }
            required
          />

          <div className="savings-form-actions">
            <button type="submit">Crear</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Contenido */}
      <div className="savings-container">
        {loading ? (
          <p className="expenses-empty">Cargando metas...</p>
        ) : goals.length === 0 ? (
          <div className="savings-empty">
            <Target size={32} />
            <p>No tienes metas activas</p>
          </div>
        ) : (
          goals.map((goal) => {
            const pct = progress(
              Number(goal.monto_actual || 0),
              Number(goal.monto_objetivo)
            );

            return (
              <div className="savings-card" key={goal.id_meta}>
                <div className="savings-card-header">
                  <div>
                    <p className="savings-title">{goal.nombre}</p>
                    <p className="savings-amount">
                      ${Number(goal.monto_actual || 0).toLocaleString()} / $
                      {Number(goal.monto_objetivo).toLocaleString()}
                    </p>
                  </div>

                  <button
                    className="savings-delete"
                    onClick={() => handleDelete(goal.id_meta)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <p className="savings-progress-text">
                  {pct.toFixed(0)}% completado
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SavingsGoals;
