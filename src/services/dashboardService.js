import api from "./api";

export async function getDashboardSummary() {
  const response = await api.get("/dashboard/summary");
  return response.data;
}

export async function getDashboardResumen() {
  const response = await api.get("/dashboard/resumen");
  return response.data;
}
