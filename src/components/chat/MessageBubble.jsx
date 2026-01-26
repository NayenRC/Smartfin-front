const MessageBubble = ({ message }) => {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm ${
          isUser
            ? "bg-primary text-white rounded-br-none"
            : "bg-card text-gray-200 rounded-bl-none border border-border"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default MessageBubble;
