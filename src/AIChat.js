import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const isSendDisabled = loading || !prompt.trim();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/ask-ai", {
        prompt,
      });
      const aiMsg = { role: "assistant", content: response.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: " + error.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0a] text-white font-[Poppins]">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full animate-pulse delay-300" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl h-[80vh] bg-white/10 backdrop-blur-2xl border border-white/20 
                   rounded-3xl shadow-[0_0_30px_rgba(79,70,229,0.25)] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-5 px-6 bg-gradient-to-r from-indigo-700/20 via-purple-700/20 to-transparent border-b border-white/20 text-center"
        >
          <h1 className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            AI Chatbot
          </h1>
          <p className="text-sm text-gray-400 mt-1">Your Smart Assistant 🤖</p>
        </motion.div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: msg.role === "user" ? 30 : -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant Avatar */}
              {msg.role === "assistant" && (
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white">
                  🤖
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl leading-relaxed shadow-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 text-white rounded-br-none"
                    : "bg-gray-100/90 text-gray-900 rounded-bl-none border border-gray-300/40"
                }`}
              >
                {msg.content}
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  🧑
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-2 text-gray-400 italic"
            >
             <div className="flex space-x-1 items-center">
  <span className="typing-dot"></span>
  <span className="typing-dot"></span>
  <span className="typing-dot"></span>
  <p className="text-gray-400 ml-2">AI is thinking...</p>
</div>

            </motion.div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input area */}
       {/* Input area */}
<div className="relative flex items-center p-6 bg-[#111827]/70 backdrop-blur-md border-t border-white/10">
  <textarea
    className="flex-grow bg-[#0f172a]/60 text-white placeholder-gray-400 rounded-2xl 
               p-4 resize-none border border-gray-700/50 focus:ring-2 
               focus:ring-indigo-500 focus:outline-none transition-all shadow-inner text-[1rem] min-h-[80px]"
    rows="2"
    placeholder="Ask anything..."
    value={prompt}
    onChange={(e) => setPrompt(e.target.value)}
    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
  />
  <Button
    variant="contained"
    endIcon={<SendIcon />}
    onClick={handleSend}
    disabled={isSendDisabled}
    title={isSendDisabled ? "Type a message or wait..." : "Send message"}
    sx={{ borderRadius: 9999, px: 3, py: 1.25, ml: 2 }}
  >
    {loading ? "Sending..." : "Send"}
  </Button>

</div>

      </motion.div>
    </div>
  );
}
