import React, { useState } from 'react';
import { IoCodeSlash, IoSend } from 'react-icons/io5';
import { PiPlanetLight } from 'react-icons/pi';
import { TbBrandPython, TbMessageChatbot } from 'react-icons/tb';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "Enter your Api" });

const App = () => {
  const [message, setMessage] = useState("");
  const [isResponceScreen, setIsResponceScreen] = useState(false);
  const [messages, setMessages] = useState([]);

  const hitRequest = () => {
    if (message.trim()) {
      generateResponse(message);
    } else {
      alert("Please enter a message.");
    }
  };

  const generateResponse = async (msg) => {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: "user", parts: [{ text: msg }] }],
      });

      const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
      const newMessages = [
        ...messages,
        { type: "userMsg", text: msg },
        { type: "responseMsg", text: responseText },
      ];
      setMessages(newMessages);
      setIsResponceScreen(true);
      setMessage("");
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...messages,
        { type: "userMsg", text: msg },
        { type: "responseMsg", text: "⚠️ Couldn't get a reply. Try again." },
      ]);
    }
  };

  const newChat = () => {
    setIsResponceScreen(false);
    setMessages([]);
  };

  return (
    <div className="w-screen min-h-screen bg-[#0E0E0E] text-white flex flex-col items-center">
      {isResponceScreen ? (
        <div className="w-full h-[80vh] flex flex-col">
          <div className="flex items-center justify-between px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-6 border-b border-gray-700 backdrop-blur-md bg-[#0E0E0E]/80">
            <h2 className="text-2xl font-bold tracking-wide">🧠 AssistMe</h2>
            <button
              onClick={newChat}
              className="bg-[#1F1F1F] hover:bg-[#2a2a2a] transition px-5 py-2 rounded-full text-sm border border-gray-700 cursor-pointer "
            >
              New Chat
            </button>
          </div>

          <div className="flex flex-col gap-4 overflow-y-auto px-6 sm:px-10 md:px-20 lg:px-40 xl:px-60 py-6 flex-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-5 py-3 text-sm whitespace-pre-line rounded-xl shadow-md backdrop-blur-md ${
                  msg.type === "userMsg"
                    ? "self-end bg-gradient-to-tr from-blue-600 to-cyan-500 text-white"
                    : "self-start bg-[#1A1A1A] text-gray-200 border border-gray-700"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh] px-4">
          <h1 className="text-4xl font-bold mb-10 tracking-wider">AssistMe</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full px-4">
            {[
              { text: "What is programming and how do I get started?", icon: <IoCodeSlash /> },
              { text: "Why is Mars called the Red Planet?", icon: <PiPlanetLight /> },
              { text: "When and how was Python programming language created?", icon: <TbBrandPython /> },
              { text: "How can AI be used in real-life applications?", icon: <TbMessageChatbot /> },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-[#181818] hover:bg-[#252525] transition rounded-xl p-5 h-[20vh] flex flex-col justify-between shadow-md border border-gray-700 cursor-pointer"
                onClick={() => {
                  setMessage(card.text);
                  hitRequest();
                }}
              >
                <p className="text-md leading-relaxed">{card.text}</p>
                <div className="text-xl text-gray-400 self-end">{card.icon}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      
      <div className="w-full py-6 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl flex items-center bg-[#181818]/70 rounded-full px-4 py-2 shadow-lg border border-gray-700 backdrop-blur-md">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            placeholder="Ask anything..."
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 p-2 text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim()) {
                hitRequest();
              }
            }}
          />
          {message.trim() && (
            <IoSend
              className="text-green-500 text-xl cursor-pointer hover:scale-110 transition"
              onClick={hitRequest}
            />
          )}
        </div>
        <p className="text-gray-500 text-xs mt-3">🚀 Developed by Fahim</p>
      </div>
    </div>
  );
};

export default App;
