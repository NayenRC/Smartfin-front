const API_URL = import.meta.env.VITE_API_URL;

// 🔹 FUNCIÓN EXISTENTE QUE YA USA Chat.jsx
export async function sendMessageToBot(message) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/chat/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("Error enviando mensaje al bot");
  }

  return res.json();
}

// 🔹 FUNCIÓN NUEVA PARA EL DASHBOARD
export async function getChatHistory() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/chat/history`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error obteniendo historial de chat");
  }

  return res.json();
}
