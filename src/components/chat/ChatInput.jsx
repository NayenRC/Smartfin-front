import { useState } from "react";

const ChatInput = ({ onSend }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSend(text);
        setText("");
    };

    return (
        <form className="border-t border-border bg-bg p-4 flex gap-3">
            <input
                className="flex-1 bg-card text-white rounded-xl px-4 py-3 outline-none border border-border focus:ring-2 focus:ring-glow"
                placeholder="Escribe tu mensaje..."
            />

            <button
                type="submit"
                className="bg-primary hover:bg-blue-700 text-white px-6 rounded-xl shadow-glow transition"
            >
                Enviar
            </button>
        </form>

    );
};

export default ChatInput;
