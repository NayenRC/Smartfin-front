import { useState, useEffect } from "react";
import { Plus, Target, Trash2, Trophy } from "lucide-react";
import api from "../../services/api";

const SavingsGoals = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newGoal, setNewGoal] = useState({ nombre: "", monto_objetivo: "", fecha_limite: "" });

    useEffect(() => {
        loadGoals();
    }, []);

    const loadGoals = async () => {
        try {
            const response = await api.get("/metas");
            setGoals(response.data);
        } catch (error) {
            console.error("Error loading goals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post("/metas", newGoal);
            setNewGoal({ nombre: "", monto_objetivo: "", fecha_limite: "" });
            setShowForm(false);
            loadGoals();
        } catch (error) {
            console.error("Error creating goal:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta meta?")) return;
        try {
            await api.delete(`/metas/${id}`);
            loadGoals();
        } catch (error) {
            console.error("Error deleting goal:", error);
        }
    };

    const calculateProgress = (current, target) => {
        if (!target || target === 0) return 0;
        const progress = (current / target) * 100;
        return Math.min(progress, 100);
    };

    return (
        <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 shadow-sm h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-neon-purple" />
                    Metas de Ahorro
                </h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="p-2 hover:bg-neon-purple/20 rounded-full text-neon-purple transition-colors"
                    title="Nueva Meta"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} className="mb-6 bg-background/50 p-4 rounded-xl border border-border animate-fade-in">
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Nombre (ej: Auto Nuevo)"
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-neon-purple focus:outline-none"
                            value={newGoal.nombre}
                            onChange={(e) => setNewGoal({ ...newGoal, nombre: e.target.value })}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Monto Objetivo"
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm text-white focus:border-neon-purple focus:outline-none"
                            value={newGoal.monto_objetivo}
                            onChange={(e) => setNewGoal({ ...newGoal, monto_objetivo: e.target.value })}
                            required
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="flex-1 bg-neon-purple text-white py-2 rounded-lg text-xs font-medium hover:bg-neon-purple/80 transition-colors"
                            >
                                Asignar Meta
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </form>
            )}

            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {loading ? (
                    <div className="text-center text-gray-500 text-sm py-4">Cargando metas...</div>
                ) : goals.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-2 border-2 border-dashed border-gray-700/50 rounded-xl">
                        <Target className="w-8 h-8 opacity-50" />
                        <p className="text-sm">No tienes metas activas</p>
                    </div>
                ) : (
                    goals.map((goal) => {
                        const progress = calculateProgress(goal.monto_actual, goal.monto_objetivo);
                        return (
                            <div key={goal.id_meta} className="group relative bg-background/30 rounded-xl p-4 border border-border/50 hover:border-neon-purple/50 transition-colors">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className="font-medium text-white">{goal.nombre}</h4>
                                        <p className="text-xs text-gray-400">
                                            ${Number(goal.monto_actual || 0).toLocaleString()} / ${Number(goal.monto_objetivo).toLocaleString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(goal.id_meta)}
                                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="relative w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-neon-purple to-pink-500 transition-all duration-1000 ease-out"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="mt-1 text-right text-[10px] text-gray-400">
                                    {progress.toFixed(0)}% completado
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default SavingsGoals;
