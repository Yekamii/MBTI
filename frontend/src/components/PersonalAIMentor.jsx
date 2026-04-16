// PersonalAIMentor.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./PersonalAIMentor.css";

const firstMessages = {
  INTP: "გამარჯობა 😊 მოდი ერთად გავაანალიზოთ შენი ძლიერი მხარეები.",
  ENFP: "გამარჯობა 🌟 როგორ შემიძლია დაგეხმარო უკეთ გაიცნო შენი შესაძლებლობები?",
  ESFJ: "გამარჯობა 💛 გინდა ვისაუბროთ შენს ურთიერთობებზე და მიზნებზე?",
  ENTP: "გამარჯობა 💡 მოდი ვიფიქროთ კრეატიულად შენს იდეებზე!",
  DEFAULT: "გამარჯობა 😊 როგორ შემიძლია დაგეხმარო?"
};

export default function PersonalAIMentor({ userType, memory }) {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMBTI, setCurrentMBTI] = useState(userType || "DEFAULT");

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const token = user?.token || localStorage.getItem("token");
  const safeUserId = user?.id;

  const scrollToBottom = () => {
    const container = messagesEndRef.current?.parentElement;
    if (!container) return;
    container.scrollTop = container.scrollHeight;
  };

  // ================= HISTORY =================
  useEffect(() => {
    if (!safeUserId || !token) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/chat-reply/history",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const data = await res.json();
        const history = data.history || [];

        if (!history.length) {
          const greeting =
            firstMessages[currentMBTI] || firstMessages.DEFAULT;
          setMessages([{ role: "ai", text: greeting }]);
        } else {
          setMessages(history.map(m => ({ role: m.role, text: m.text })));
        }

        scrollToBottom();
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [safeUserId, token]);

  // ================= SEND =================
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");

    setMessages(prev => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/chat-reply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            message: text,
            type: currentMBTI
          })
        }
      );

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "ai", text: data.reply }
      ]);

      scrollToBottom();
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "AI დროებით მიუწვდომელია 😔" }
      ]);
    }

    setLoading(false);
  };

  if (!safeUserId)
    return <div className="ai-mentor">გთხოვ გაიარე ავტორიზაცია 😊</div>;

  return (
    <div className="ai-mentor">
      <div className="ai-header">
        Personal AI Mentor ({currentMBTI})
      </div>

      <div className="ai-messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.text}
          </div>
        ))}
        {loading && <div className="msg ai">AI წერს...</div>}
        <div ref={messagesEndRef}></div>
      </div>

      <div className="ai-input">
        <textarea
          ref={textareaRef}
          value={input}
          placeholder="მომწერე..."
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button onClick={sendMessage}>გაგზავნა</button>
      </div>
    </div>
  );
}