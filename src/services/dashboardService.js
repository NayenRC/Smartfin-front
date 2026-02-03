import api from "./api";

export async function getDashboardResumen() {
  const res = await api.get("/dashboard/resumen");
  return res.data;
}

/**
 * Gastos por categoría (si decides separarlo)
 */
export async function getGastosPorCategoria() {
  const response = await api.get("/dashboard/gastos-por-categoria");
  return response.data;
}
