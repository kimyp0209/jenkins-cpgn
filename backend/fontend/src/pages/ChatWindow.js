import { useState, useEffect, useRef } from "react";
import { sendChat } from "../api";
import { FaArrowUp } from "react-icons/fa";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  

  const defaultQuestions = [
    "배송은 얼마나 걸리나요?",
    "교환/반품은 어떻게 하나요?",
    "비회원도 주문할 수 있나요?",
  ];

  useEffect(() => {
  setMessages([
    { role: "bot", content: `안녕하세요!😊\n무엇을 도와드릴까요?` },
    { type: "suggestion" }, // 질문 박스 삽입
  ]);
}, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (questionText = input) => {
  if (!questionText.trim()) return;

  setInput(""); // 입력창 초기화

  const newMessages = [...messages, 
    { role: "user", content: questionText },
    { role: "bot", content: "⏳ 응답 생성 중...", temp: true }
  ];

  setMessages(newMessages);

  try {
    const res = await sendChat({ message: questionText });
    setMessages(prev => {
      const updated = [...prev];
      const tempIndex = updated.findIndex(m => m.temp);
      if (tempIndex !== -1) {
        updated[tempIndex] = {
          role: "bot",
          content: res.data.reply,
        };
      }
      return updated;
    });
  } catch {
    setMessages(prev => {
      const updated = [...prev];
      const tempIndex = updated.findIndex(m => m.temp);
      if (tempIndex !== -1) {
        updated[tempIndex] = {
          role: "bot",
          content: "⚠️ 오류가 발생했습니다.",
        };
      }
      return updated;
    });
  }
};


  return (
    <div style={{ padding: 0, backgroundColor: "#f6f3f2", height: "100%" }}>
      <div style={{ height: "390px", overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => {
  // ✅ 질문 박스 렌더링
  if (msg.type === "suggestion") {
    return (
      <div
        key={`suggestion-${index}`}
        style={{
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "16px",
          marginBottom: "12px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          maxWidth: "90%",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 12, color: "#333" }}>
          📌 자주 묻는 질문
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {defaultQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(q)}
              style={{
                fontSize: "14px",
                backgroundColor: "#f9f9f9",
                border: "1px solid #ccc",
                borderRadius: "6px",
                padding: "10px 14px",
                cursor: "pointer",
                transition: "all 0.2s",
                flex: "1 0 auto",
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = "#f1f1f1";
                e.target.style.borderColor = "#bbb";
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = "#f9f9f9";
                e.target.style.borderColor = "#ccc";
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ✅ 일반 메시지 렌더링
  const isUser = msg.role === "user";
  return (
    <div
      key={index}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: 10,
      }}
    >
      {!isUser && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
          <img
            src="/img/favicon.ico"
            alt="bot"
            style={{ width: 20, height: 20, marginRight: 6 }}
          />
          <span style={{ fontWeight: "bold", fontSize: 13, color: "#444" }}>
            꼼파뇨봇
          </span>
        </div>
      )}
      <div
        style={{
          backgroundColor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 16,
          padding: "8px 12px",
          maxWidth: "75%",
          fontSize: 13,
          whiteSpace: "pre-wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          alignSelf: isUser ? "flex-end" : "flex-start",
        }}
      >
        {msg.content}
      </div>
    </div>
  );
})}




        {loading && <div className="text-muted">⏳ 응답 생성 중...</div>}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "5px",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "8px 12px",
            flex: 1,
            border: "1px solid #ccc",
          }}
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="무엇을 도와드릴까요?"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: "13px",
              color: "#444",
              resize: "none",
            }}
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={loading}
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "50%",
            width: "37.5px",
            height: "37.5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaArrowUp size={14} color="#777" />
        </button>
      </div>
    </div>
  );
}
