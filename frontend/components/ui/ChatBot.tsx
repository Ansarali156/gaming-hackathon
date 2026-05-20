"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Send, X, Bot } from "lucide-react";

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Hi! I'm IncuXai AI Assistant. Ask me anything about the hackathon!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble. Please try again." },
      ]);
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-4 z-40 w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      >
        <Bot className="text-background" size={28} />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-24 left-4 z-40 w-80 md:w-96 glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bot className="text-primary" size={24} />
          <span className="font-display font-bold text-text">AI Assistant</span>
        </div>
        <button onClick={() => setOpen(false)} className="text-text-muted hover:text-text">
          <X size={20} />
        </button>
      </div>

      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-primary text-background"
                  : "bg-surface-light text-text"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-light text-text p-3 rounded-lg text-sm">
              Typing...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/5 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 bg-surface-light border border-white/10 rounded-lg text-text text-sm placeholder-text-dim focus:border-primary/50 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="p-2 bg-primary text-background rounded-lg disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </motion.div>
  );
}
