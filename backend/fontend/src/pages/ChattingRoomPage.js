import { fetchChattingMessages, sendChattingMessage, getCurrentUser, clearChattingMessages  } from "../api";
import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

function ChattingRoomPage({ roomId }) {
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesEndRef = useRef(null); // ✅ ref 추가
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    getCurrentUser().then(res => {
      setUserId(res.data.userId);
    });
  }, []);

  useEffect(() => {
  if (roomId) {
    const interval = setInterval(loadMessages, 2000); // 2초마다 메시지 갱신
    return () => clearInterval(interval); // 언마운트 시 해제
  }
}, [roomId]);

  const loadMessages = async () => {
    try {
      const res = await fetchChattingMessages(roomId);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ 메시지 불러오기 실패:", err);
    }
  };

  useEffect(() => {
  const el = chatBoxRef.current;
  if (!el) return;

  const handleScroll = () => {
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    setIsAutoScroll(atBottom);
  };

  el.addEventListener("scroll", handleScroll);
  return () => el.removeEventListener("scroll", handleScroll);
}, []);

  const scrollToBottom = () => {
  if (isAutoScroll && messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
};

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!content.trim() || !userId) return;

    try {
      await sendChattingMessage(Number(roomId), userId, content);
      setContent("");
      loadMessages();
    } catch (err) {
      console.error("❌ 메시지 전송 실패:", err);
    }
  };

  if (!roomId) {
    return <div style={{ padding: 20 }}>❗ 채팅방 ID가 없습니다.</div>;
  }

  const handleClearMessages = async () => {
  if (window.confirm("정말 메시지를 모두 삭제하시겠습니까?")) {
    try {
      await clearChattingMessages(roomId);
      setMessages([]); // 프론트도 즉시 반영
    } catch (err) {
      console.error("❌ 메시지 삭제 실패:", err);
      alert("메시지 삭제 중 오류 발생");
    }
  }
};







  return (
    <div style={{ padding: 0, backgroundColor: "#f6f3f2" }}>
      <div ref={chatBoxRef} style={{ height: "390px", overflowY: "scroll", padding: "10px" }}>
        {messages.map((msg) => {
          const isMe = msg.sender?.id === userId;
          return (
            <div
              key={msg.id}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "8px",
                fontSize:13
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  backgroundColor: isMe ? "#d1e7dd" : "#fff",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {!isMe && <b>{msg.sender.username}</b>}
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}

        {/* ✅ 마지막 요소에 ref 부착 */}
        <div ref={messagesEndRef} />
      </div>



      {/* 입력창 영역 */}
      <div style={{ display: "flex", alignItems: "center", gap: "5px", padding: "10px" }}>
        <button
    onClick={handleClearMessages}
    style={{
      background: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#777",
      marginRight: 4
    }}
    title="대화내용 비우기"
  >
    <FaTrash size={16} />
  </button>
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
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="메시지를 입력해주세요."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              flex: 1,
              fontSize: "13px",
              color: "#444",
            }}
          />
        </div>

        <button
          onClick={handleSend}
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

export default ChattingRoomPage;
