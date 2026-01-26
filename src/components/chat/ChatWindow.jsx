import MessageBubble from "./MessageBubble";

const ChatWindow = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
      <div className="flex-1 overflow-y-auto p-6 bg-bg">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
      </div>
    </div>
  );
};

export default ChatWindow;
