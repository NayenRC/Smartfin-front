export async function sendMessageToBot(message, token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    body: JSON.stringify({
      message,
      source: "chat", // 👈 importante para backend
    }),
  });

  if (!res.ok) {
    throw new Error("Error al comunicarse con el bot");
  }

  return res.json();
}
