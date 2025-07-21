import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
  fetchChattingMessages,
  sendChattingMessage,
  getCurrentUser,
} from "../api";

function AdminChattingRoomPage() {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState(null);
  const messagesEndRef = useRef(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    getCurrentUser()
      .then((res) => setUserId(res.data.userId))
      .catch((err) => {
        console.error("사용자 정보를 불러오지 못했습니다.", err);
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
      });
  }, []);

  useEffect(() => {
    if (roomId) {
      loadMessages(); // 초기 로딩
      const interval = setInterval(loadMessages, 2000); // 2초마다 반복 호출
      return () => clearInterval(interval); // 컴포넌트 언마운트 시 clear
    }
  }, [roomId]);

  const scrollToBottom = () => {
  const el = chatBoxRef.current;
  if (isAutoScroll && el) {
    el.scrollTop = el.scrollHeight;
  }
};

  const loadMessages = async () => {
  const res = await fetchChattingMessages(roomId);
  setMessages(res.data);

  // ✅ 여기 조건 추가
  if (isAutoScroll) {
    scrollToBottom();
  }
};

  const handleSend = async () => {
    if (!content.trim() || !userId) return;

    try {
      await sendChattingMessage(roomId, userId, content);
      setContent("");
      loadMessages();
    } catch (err) {
      console.error("메시지 전송 실패", err);
      alert("메시지 전송 중 오류 발생");
    }
  };

  useEffect(() => {
  if (isAutoScroll) {
    scrollToBottom();
  }
}, [messages]);


  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom: 100 }}>
      <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 50 }}>
        채팅방 {roomId}
      </h2>

      <div
  ref={chatBoxRef}
  className="border p-3 mb-3"
  style={{
    height: "300px",
    overflowY: "auto",
    backgroundColor: "#f9f9f9",
  }}
  onScroll={() => {
  const el = chatBoxRef.current;
  if (!el) return;

  // 정확하게 거의 바닥일 때만 true
  const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5;
  setIsAutoScroll(isNearBottom);
}}
>
        {messages.map((msg) => {
          const isMine = msg.sender.id === userId; // 본인이 보낸 메시지인지 확인
          return (
            <div
              key={msg.id}
              className={`mb-2 d-flex ${
                isMine ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <div className="p-2" style={{ maxWidth: "70%" }}>
                <div
                  className={`${
                    isMine ? "text-primary text-end" : "text-dark"
                  }`}
                  style={{ fontSize: 12, fontWeight: "bold" }}
                >
                  {msg.sender.username}
                </div>
                <div style={{ fontSize: 14, whiteSpace: "pre-line" }}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      

      <div className="input-group" style={{ borderRadius: 0 }}>
        <textarea
          className="form-control"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="메시지를 입력하세요"
          rows={1}
          style={{ borderRadius: 0, resize: "none" }}
        />
        <button
          style={{ borderRadius: 0 }}
          className="btn btn-dark"
          onClick={handleSend}
        >
          전송
        </button>
      </div>
    </div>
  );
}

export default AdminChattingRoomPage;
