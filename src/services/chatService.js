const API_URL = import.meta.env.VITE_API_URL;

export async function getChatHistory() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/chat/history`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error al obtener historial de chat");
  }

  return res.json();
}
