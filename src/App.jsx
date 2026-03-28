import React, { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';
import { IoCodeSlash } from 'react-icons/io5';
import { PiPlanetLight } from 'react-icons/pi';
import { TbBrandPython, TbMessageChatbot } from 'react-icons/tb';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const App = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isResponceScreen, setIsResponceScreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hitRequest = () => {
    if (message.trim()) {
      generateResponse(message);
    }
  };

  const generateResponse = async (msg) => {
    setMessages(prev => [...prev, { type: "userMsg", text: msg }]);
    setMessage("");
    setIsResponceScreen(true);
    setLoading(true);

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "AssistMe"
        },
        body: JSON.stringify({
          model: "google/gemma-3-4b-it:free",
          messages: [{ role: "user", content: msg }]
        })
      });

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content || "No response from AI.GEN AI API Key Expired";
      setMessages(prev => [...prev, { type: "responseMsg", text: responseText }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: "responseMsg", text: "⚠️ Something went wrong. Try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const newChat = () => {
    setIsResponceScreen(false);
    setMessages([]);
  };

  const suggestions = [
    { text: "What is programming and how do I get started?", icon: <IoCodeSlash /> },
    { text: "Why is Mars called the Red Planet?", icon: <PiPlanetLight /> },
    { text: "When and how was Python created?", icon: <TbBrandPython /> },
    { text: "How can AI be used in real-life applications?", icon: <TbMessageChatbot /> },
  ];

  return (
    <div className="w-screen min-h-screen bg-[#0a0a0a] text-white flex flex-col">

      {/* navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">A</div>
          <span className="text-lg font-semibold tracking-wide">AssistMe</span>
        </div>
        {isResponceScreen && (
          <button
            onClick={newChat}
            className="text-sm px-4 py-1.5 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            New Chat
          </button>
        )}
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {!isResponceScreen ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent mb-3">
                Hey there 👋
              </h1>
              <p className="text-white/50 text-base sm:text-lg">Ask me anything. I'm here to help.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {suggestions.map((card, i) => (
                <div
                  key={i}
                  onClick={() => generateResponse(card.text)}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 cursor-pointer transition flex items-start gap-3 group"
                >
                  <div className="text-violet-400 text-xl mt-0.5 group-hover:scale-110 transition">{card.icon}</div>
                  <p className="text-sm text-white/70 leading-relaxed">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto flex flex-col gap-5 pb-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.type === "userMsg" ? "justify-end" : "justify-start"}`}
              >
                {msg.type === "responseMsg" && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0">A</div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    msg.type === "userMsg"
                      ? "bg-violet-600 text-white rounded-br-sm"
                      : "bg-white/8 border border-white/10 text-white/90 rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0">A</div>
                <div className="bg-white/8 border border-white/10 px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* input */}
      <div className="sticky bottom-0 px-4 py-4 bg-[#0a0a0a]/90 backdrop-blur-md border-t border-white/10">
        <div className="max-w-3xl mx-auto flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-4 py-3">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) hitRequest();
            }}
            type="text"
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-white placeholder-white/30 text-sm"
          />
          <button
            onClick={hitRequest}
            disabled={!message.trim() || loading}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition ${
              message.trim() && !loading
                ? "bg-violet-600 hover:bg-violet-500 text-white"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            <IoSend size={14} />
          </button>
        </div>
        <p className="text-center text-white/20 text-xs mt-2">🚀 Developed by Fahim</p>
      </div>
    </div>
  );
};

export default App;
