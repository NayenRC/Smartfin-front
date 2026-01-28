import api from "./api";

export async function sendMessageToBot(message) {
  const response = await api.post("/chat", {
    mensaje: message, // Backend expects 'mensaje'
  });

  return response.data;
}
