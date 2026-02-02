import { useState } from "react";

import { Send } from "lucide-react";

const ChatInput = ({ onSend }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-border bg-card/50 backdrop-blur-md p-4 flex gap-3 pb-8 sm:pb-4"
        >
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-background text-gray-100 rounded-xl px-4 py-3 outline-none border border-border focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all placeholder-gray-500"
                placeholder="Escribe tu mensaje..."
            />

            <button
                type="submit"
                disabled={!text.trim()}
                className="bg-neon-purple/20 hover:bg-neon-purple/40 text-neon-purple border border-neon-purple/50 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
    );
};

export default ChatInput;
