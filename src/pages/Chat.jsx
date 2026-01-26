import { useState } from "react";
import ChatWindow from "../components/chat/ChatWindow";
import ChatInput from "../components/chat/ChatInput";
import { sendMessageToBot } from "../services/chatService";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { getToken } = useAuth();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hola 👋 Soy tu asistente financiero. ¿En qué te ayudo hoy?",
    },
  ]);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: text }]);

    try {
      const token = await getToken();
      const data = await sendMessageToBot(text, token);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "Mensaje procesado ✅",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Error al procesar el mensaje",
        },
      ]);
    }
  };


  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default Chat;
