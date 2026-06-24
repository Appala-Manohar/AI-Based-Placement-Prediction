import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  Bot, 
  Send, 
  Sparkles, 
  Settings, 
  Key, 
  Trash2, 
  Plus, 
  MessageSquare,
  ChevronRight,
  Info,
  RefreshCw,
  User
} from "lucide-react";

export default function AIChatbot({ student }) {
  // Load sessions from localStorage or initialize with a default one
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem("placement_chat_sessions");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: "session-1",
        title: "Initial Placement Advice",
        messages: [
          {
            sender: "bot",
            text: student 
              ? `Hello ${student.student_name}! I am your AI Career Guidance Assistant. I have loaded your placement profile details (CGPA: ${student.cgpa}, Readiness: ${student.readiness_score}/100).\n\nHow can I help you prepare for placements today?`
              : "Hello! I am your AI Career Guidance Assistant. Please load a student profile to get personalized advice, or ask me general questions about career readiness, coding practice, and resume building."
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return sessions[0]?.id || "session-1";
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem("gemini_api_key") || "");
  const chatEndRef = useRef(null);

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem("placement_chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages, loading]);

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem("gemini_api_key", apiKey.trim());
    setShowSettings(false);
    alert("Gemini API Key configured and stored locally!");
  };

  const handleCreateNewSession = () => {
    const newId = `session-${Date.now()}`;
    const newSession = {
      id: newId,
      title: `Conversation ${sessions.length + 1}`,
      messages: [
        {
          sender: "bot",
          text: student
            ? `Hi ${student.student_name}! Starting a new counseling session. Ask me anything about ${student.department} careers or interview preparation.`
            : "Starting a new counseling session. How can I help you today?"
        }
      ]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id, e) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // Don't delete last session, just clear it
      handleClearChat();
      return;
    }
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleClearChat = () => {
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [
            {
              sender: "bot",
              text: student
                ? `Chat cleared. Ready for your placement queries, ${student.student_name}!`
                : "Chat cleared. Ready for your placement queries!"
            }
          ]
        };
      }
      return s;
    }));
  };

  const handleSendMessage = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    // 1. Add user message to active session
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        // Auto update title based on first user query
        const title = s.title.startsWith("Conversation ") || s.title === "Initial Placement Advice"
          ? queryText.length > 24 ? queryText.substring(0, 24) + "..." : queryText
          : s.title;
        return {
          ...s,
          title,
          messages: [...s.messages, { sender: "user", text: queryText }]
        };
      }
      return s;
    }));

    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const savedKey = localStorage.getItem("gemini_api_key") || "";
      // Construct conversation history to maintain context
      const chatHistory = activeSession ? activeSession.messages.map(m => ({
        role: m.sender === "bot" ? "model" : "user",
        text: m.text
      })) : [];

      const payload = {
        message: queryText,
        register_no: student ? student.register_no : null,
        api_key: savedKey ? savedKey.trim() : null,
        history: chatHistory
      };

      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Chatbot API failed");

      const data = await res.json();

      // 2. Add bot reply to active session
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { sender: "bot", text: data.response }]
          };
        }
        return s;
      }));
    } catch (err) {
      console.error(err);
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: [...s.messages, { 
              sender: "bot", 
              text: "I am having trouble communicating with the placement backend. Please ensure the backend server is running." 
            }]
          };
        }
        return s;
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const suggestedQuestions = student?.department === "Computer Science" || 
    student?.department === "Information Technology" ||
    student?.department?.includes("Artificial Intelligence") ||
    student?.department?.includes("AIML") ||
    student?.department?.includes("AIDS")
    ? [
        "What software job roles suit a CSE/IT profile?",
        "How can I prepare for coding rounds?",
        "Suggest a resume structure for software internships.",
        "How to improve programming scores?"
      ]
    : student?.department?.includes("Electronics")
      ? [
          "Core vs. software career choices for ECE students?",
          "Important hardware and core skills to learn?",
          "How to prepare for technical interviews?",
          "What is my placement probability?"
        ]
      : [
          "How can I transition into tech roles from non-CS?",
          "What coding skills should a mechanical/civil engineer learn?",
          "How to prepare for aptitude screening tests?",
          "How do I improve my resume score?"
        ];

  return (
    <div className="pt-20 pb-16 px-6 max-w-7xl mx-auto h-[90vh] flex gap-6 relative">
      
      {/* Background Animated Gradient Blobs */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl animate-float-slow -z-10"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-fuchsia-600/5 rounded-full blur-3xl animate-float-medium -z-10"></div>

      {/* Chat Sidebar (Sessions history) */}
      <div className="w-68 flex flex-col justify-between glass-card border border-white/5 p-4 flex-shrink-0 hidden md:flex">
        <div className="space-y-4 overflow-hidden flex flex-col flex-grow">
          {/* New Chat Button */}
          <button
            onClick={handleCreateNewSession}
            className="w-full flex items-center justify-center gap-2 p-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-500/10 cursor-pointer transition duration-150"
          >
            <Plus size={14} /> New Conversation
          </button>

          {/* Sessions List */}
          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 px-2">History</span>
            {sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => setActiveSessionId(s.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition group
                    ${isActive 
                      ? "bg-white/5 text-white border-l-2 border-violet-500" 
                      : "text-gray-400 hover:bg-white/2 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <MessageSquare size={12} className={isActive ? "text-violet-400" : "text-gray-500"} />
                    <span className="truncate">{s.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 rounded transition"
                    title="Delete session"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer (API config toggle) */}
        <div className="pt-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition cursor-pointer
              ${showSettings || apiKey 
                ? "bg-violet-600/10 border-violet-500/25 text-violet-400" 
                : "bg-white/3 border-white/5 text-gray-400 hover:text-white"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <Settings size={14} /> {apiKey ? "Gemini Linked" : "AI Configuration"}
            </span>
            <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Main Conversational Area */}
      <div className="flex-1 flex flex-col justify-between glass-card border border-white/5 overflow-hidden relative">
        {/* Top Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/1">
          <div className="flex items-center gap-2">
            <Bot size={18} className="text-violet-400 animate-pulse" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI placement coach</h4>
              {student && (
                <p className="text-[10px] text-violet-300">
                  Profile loaded: <span className="font-semibold">{student.student_name}</span> ({student.department})
                </p>
              )}
            </div>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearChat}
              className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-xl transition cursor-pointer"
              title="Clear conversation"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition md:hidden cursor-pointer"
              title="API Configuration"
            >
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* API key settings panel */}
        {showSettings && (
          <div className="p-4 border-b border-violet-500/15 bg-violet-600/5 space-y-3 animate-slide-down">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Key size={14} className="text-violet-400" />
              <span>Configure Live Generative AI Response API (Gemini)</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-normal">
              Provide an active Gemini API key to enable full open-domain answers. If left empty, chatbot falls back to the local NLP career parser.
            </p>
            <form onSubmit={handleSaveKey} className="flex gap-2">
              <input
                type="password"
                placeholder="Paste Gemini API Key (AIzaSy...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 glass-input"
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition"
              >
                Save
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setApiKey("");
                    localStorage.removeItem("gemini_api_key");
                    alert("Gemini key cleared.");
                  }}
                  className="bg-red-950/20 border border-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1.5 rounded-lg cursor-pointer hover:bg-red-900/20 transition"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        )}

        {/* Messages Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {activeSession?.messages.length <= 1 ? (
            /* Welcome Panel when session has no user queries yet */
            <div className="h-full flex flex-col justify-center items-center text-center space-y-6 max-w-xl mx-auto py-8">
              <div className="p-4 bg-violet-500/10 border border-violet-500/20 text-violet-400 rounded-full animate-bounce">
                <Bot size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Placement Assistant AI Counselor</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Ask me anything regarding campus placement schedules, core subject preparation, interview structures, coding practices, or resume improvements.
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full pt-4">
                {suggestedQuestions.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(chip)}
                    className="p-3 bg-white/2 hover:bg-white/5 border border-white/5 rounded-xl text-xs text-left text-gray-300 font-medium hover:text-white transition duration-150 cursor-pointer"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Regular Chat History bubbles */
            activeSession.messages.map((m, i) => {
              const isBot = m.sender === "bot";
              return (
                <div 
                  key={i} 
                  className={`flex gap-3 max-w-[85%] ${isBot ? "self-start" : "self-end flex-row-reverse"}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-sm
                    ${isBot 
                      ? "bg-violet-500/10 border border-violet-500/20 text-violet-400" 
                      : "bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400"
                    }
                  `}>
                    {isBot ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div 
                    className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line shadow-md
                      ${isBot 
                        ? "bg-white/3 text-gray-200 border border-white/5 rounded-tl-sm" 
                        : "bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white rounded-tr-sm"
                      }
                    `}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 self-start max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
                <Bot size={14} />
              </div>
              <div className="bg-white/3 border border-white/5 p-3.5 rounded-2xl rounded-tl-sm text-xs font-medium text-gray-400 flex items-center gap-2">
                <div className="flex gap-1.5 items-center px-1">
                  <span className="dot-pulse"></span>
                  <span className="dot-pulse"></span>
                  <span className="dot-pulse"></span>
                </div>
                <span className="text-gray-400 text-[11px] font-semibold">Coach is writing...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/5 bg-white/1 flex items-center gap-3">
          <input
            type="text"
            placeholder={localStorage.getItem("gemini_api_key") 
              ? "Ask Gemini anything (Cloud computing, system design, HR queries)..." 
              : "Type your career or placement question..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="flex-1 text-xs pl-4 pr-4 py-3.5 glass-input"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-500 text-white p-3 rounded-xl cursor-pointer disabled:bg-white/5 disabled:text-gray-500 transition shadow-lg shadow-violet-500/10 flex items-center justify-center"
          >
            <Send size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}
