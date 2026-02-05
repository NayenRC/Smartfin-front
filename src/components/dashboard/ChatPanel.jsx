import { useEffect, useState } from "react";
import { getChatHistory } from "../../services/chatService";

const ChatPanel = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadChat() {
      try {
        const data = await getChatHistory();
        setMessages(data);
      } catch (e) {
        console.error("Error cargando chat", e);
      } finally {
        setLoading(false);
      }
    }

    loadChat();
  }, []);

  if (loading) {
    return <p className="text-gray-400">Cargando conversación...</p>;
  }

  return (
    <div className="dashboard-section flex flex-col h-full">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">
        Conversación con SmartBot
      </h3>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id_chat}
              className={`p-3 rounded-lg max-w-[85%] ${
                msg.rol === "user"
                  ? "ml-auto bg-neon-green/10 border border-neon-green/20 text-right"
                  : "mr-auto bg-white/5 border border-white/10"
              }`}
            >
              <p className="text-sm text-white">{msg.mensaje}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(msg.creado_en).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            Aún no has hablado con el bot 🤖
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
