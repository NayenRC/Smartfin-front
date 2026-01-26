export async function getDashboardSummary(token) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/dashboard/summary`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Error al cargar dashboard");
  }

  return res.json();
}
