import api from "./api";

/**
 * Resumen principal del dashboard
 */
export async function getDashboardResumen() {
  const response = await api.get("/dashboard/resumen");
  return response.data;
}

/**
 * Gastos por categoría (si decides separarlo)
 */
export async function getGastosPorCategoria() {
  const response = await api.get("/dashboard/gastos-por-categoria");
  return response.data;
}
