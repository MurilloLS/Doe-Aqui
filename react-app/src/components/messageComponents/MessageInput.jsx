import { useRef, useState } from "react";
import { useChatStore } from "../../store/useChatStore";

function MessageInput() {
  const [text, setText] = useState("");
  const { sendMessage } = useChatStore();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    sendMessage({
      text: text.trim()
    });
    setText("");
  };

  return (
    <div className="p-4 border-t border-slate-700/50">

      <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto flex space-x-4">
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4"
          placeholder="Escreva sua mensagem"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-4 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
        </button>
      </form>
    </div>
  );
}
export default MessageInput;