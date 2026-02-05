const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Usado por Chat.jsx
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

  const data = await res.json();

  // 🔑 Normalizamos la respuesta
  return {
    response: data.response || data.reply || "",
  };
}

// 🔹 Usado por Dashboard
export async function getChatHistory() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/api/chat/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Error obteniendo historial de chat");
  }

  return res.json();
}

