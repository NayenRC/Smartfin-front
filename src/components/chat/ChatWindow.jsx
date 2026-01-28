import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
      <div className="max-w-3xl mx-auto space-y-4">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatWindow;
