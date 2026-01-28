const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 animate-fade-in`}>
      <div
        className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser
            ? "bg-neon-green/10 text-neon-green border border-neon-green/20 rounded-br-none"
            : "bg-card text-gray-200 rounded-bl-none border border-border"
          }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
