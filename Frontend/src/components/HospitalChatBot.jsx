import { useState, useRef, useEffect } from "react";

/**
 * HospitalChatbot — Floating AI chatbot widget for Ratnadeep Hospital.
 *
 * Connects to the Spring Boot backend at http://localhost:8081/api/chat
 * which in turn calls the Groq AI API with the hospital system prompt.
 *
 * Request format:  POST /api/chat  { "message": "user question here" }
 * Response format: { "reply": "AI response here" }
 */

// Quick-reply buttons shown when the chat is first opened.
// Clicking one sends it as a message instantly — no typing needed.
const QUICK_QUESTIONS = [
  "What are OPD timings?",
  "How to book an appointment?",
  "What departments are available?",
  "Emergency contact numbers?",
  "Is insurance accepted?",
];

// Backend API URL — points to our Spring Boot server.
const API_URL = "http://localhost:8081/api/chat";

export default function HospitalChatbot() {
  // Controls whether the chat window is open or closed
  const [open, setOpen] = useState(false);

  
  // Starts with the bot's greeting message
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! 👋 I'm the Ratnadeep Hospital Assistant. How can I help you today?\n\nYou can ask me about OPD timings, appointments, departments, or emergency contacts.`,
    },
  ]);

  // Tracks the current value of the text input field
  const [input, setInput] = useState("");

  // True while waiting for the backend/AI response — disables input and shows typing dots
  const [loading, setLoading] = useState(false);

  // Ref used to auto-scroll to the latest message whenever new ones arrive
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom whenever messages change or chat opens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  /**
   * sendMessage — Sends a message to the backend and appends the AI reply.
   *
   * @param {string} text - Optional text to send (used by quick-reply buttons).
   *                        If not provided, uses the current input field value.
   */
  const sendMessage = async (text) => {
    const userText = text || input.trim();

    // Don't send if empty or already waiting for a response
    if (!userText || loading) return;

    setInput("");

    // Add the user's message to the chat immediately (optimistic update)
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      // Extract reply from backend response — fallback if reply is missing
      const reply =
        data.reply ||
        "Sorry, I couldn't get a response. Please call 1800-222-108.";

      // Append the AI's reply to the conversation
      setMessages([...newMessages, { role: "assistant", content: reply }]);

    } catch {
      // Network error, backend down, or CORS issue — show helpful fallback
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting. For urgent help, call: 1800-222-108 or ambulance: 102.",
        },
      ]);
    } finally {
      // Always re-enable input whether request succeeded or failed
      setLoading(false);
    }
  };

  // Send message on Enter key (but allow Shift+Enter for newlines)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Floating toggle button (bottom-right corner) ───────────────── */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed", bottom: "28px", right: "28px",
          width: "60px", height: "60px", borderRadius: "50%",
          background: "linear-gradient(135deg, #0d6e8f, #0a5a7a)",
          border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(13,110,143,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 9999, transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        aria-label="Open hospital assistant"
      >
        {/* Show X when open, chat bubble icon when closed */}
        {open ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <circle cx="9" cy="10" r="1" fill="white" stroke="none" />
            <circle cx="12" cy="10" r="1" fill="white" stroke="none" />
            <circle cx="15" cy="10" r="1" fill="white" stroke="none" />
          </svg>
        )}

        {/* Pulsing ring animation shown only when chat is closed */}
        {!open && (
          <span style={{
            position: "absolute", width: "60px", height: "60px",
            borderRadius: "50%", border: "2px solid rgba(13,110,143,0.5)",
            animation: "pulse 2s infinite",
          }} />
        )}
      </button>

      {/* ── Chat window (visible only when open === true) ──────────────── */}
      {open && (
        <div style={{
          position: "fixed", bottom: "100px", right: "28px",
          width: "360px", maxHeight: "520px", background: "#fff",
          borderRadius: "16px", boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", zIndex: 9998,
          overflow: "hidden", fontFamily: "'Segoe UI', sans-serif",
        }}>

          {/* ── Header bar ─────────────────────────────────────────────── */}
          <div style={{
            background: "linear-gradient(135deg, #0d6e8f, #0a5a7a)",
            padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px",
          }}>
            {/* Bot avatar icon */}
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>

            {/* Bot name and online status */}
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
                Ratnadeep Assistant
              </div>
              <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px", display: "flex", alignItems: "center", gap: "4px" }}>
                {/* Green online dot */}
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
                Online · Here to help
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.8)", padding: "2px" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* ── Messages area ───────────────────────────────────────────── */}
          <div style={{
            flex: 1, overflowY: "auto", padding: "14px",
            display: "flex", flexDirection: "column", gap: "10px",
            background: "#f8fafc", maxHeight: "320px",
          }}>
            {/* Render each message bubble */}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}
              >
                <div style={{
                  maxWidth: "82%", padding: "9px 12px",
                  // User messages: rounded top-right, flat bottom-right
                  // Bot messages: rounded top-left, flat bottom-left
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #0d6e8f, #0a5a7a)"
                    : "#fff",
                  color: msg.role === "user" ? "#fff" : "#1e293b",
                  fontSize: "13px", lineHeight: "1.5",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator — shown while waiting for AI response */}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 14px", borderRadius: "14px 14px 14px 4px",
                  background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  display: "flex", gap: "4px", alignItems: "center",
                }}>
                  {/* Three bouncing dots */}
                  {[0, 1, 2].map((d) => (
                    <span key={d} style={{
                      width: "7px", height: "7px", borderRadius: "50%",
                      background: "#0d6e8f", display: "inline-block",
                      animation: `bounce 1.2s ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Invisible anchor div — scrolled into view to keep chat at bottom */}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick question buttons (shown only at start of conversation) ── */}
          {messages.length <= 1 && (
            <div style={{
              padding: "8px 12px", background: "#f8fafc",
              display: "flex", flexWrap: "wrap", gap: "6px",
            }}>
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  style={{
                    fontSize: "11px", padding: "5px 10px", borderRadius: "20px",
                    border: "1px solid #b3d8e8", background: "#e8f4f8",
                    color: "#0a5a7a", cursor: "pointer",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#c8e8f4"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#e8f4f8"}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Input bar ───────────────────────────────────────────────── */}
          <div style={{
            padding: "10px 12px", borderTop: "1px solid #e2e8f0",
            display: "flex", gap: "8px", background: "#fff",
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              disabled={loading}
              style={{
                flex: 1, border: "1px solid #cbd5e1", borderRadius: "22px",
                padding: "8px 14px", fontSize: "13px", outline: "none",
                background: "#f8fafc", color: "#1e293b",
              }}
              onFocus={(e) => e.target.style.borderColor = "#0d6e8f"}
              onBlur={(e) => e.target.style.borderColor = "#cbd5e1"}
            />

            {/* Send button — highlighted only when there is text to send */}
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #0d6e8f, #0a5a7a)"
                  : "#e2e8f0",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={input.trim() && !loading ? "white" : "#94a3b8"}
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>

        </div>
      )}

      {/* ── CSS Animations ──────────────────────────────────────────────── */}
      <style>{`
        /* Pulsing ring on the floating button when chat is closed */
        @keyframes pulse {
          0%   { transform: scale(1); opacity: 0.7; }
          70%  { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        /* Bouncing dots in the typing indicator */
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}