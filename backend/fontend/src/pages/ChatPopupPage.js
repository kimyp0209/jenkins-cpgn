import {useRef, useState, useEffect } from "react";
import { createCustomerChattingRoom, fetchLatestNotices } from "../api";
import ChatWindow from "./ChatWindow";
import ChattingRoomPage from "./ChattingRoomPage";

export default function ChatPopupPage({ userId }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("hello");
  const [chatAllowed, setChatAllowed] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [notices, setNotices] = useState([]);
  const popupRef = useRef(null);

  useEffect(() => {
    if (userId) {
      setChatAllowed(true);

      // ✅ 로그인된 경우 1:1 채팅방 생성 또는 조회
      createCustomerChattingRoom(userId)
        .then(res => {
          setRoomId(res.data.id); // 서버에서 반환한 roomId
        })
        .catch(err => {
          console.error("채팅방 생성 오류", err);
        });
    } else {
      setChatAllowed(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchLatestNotices()
      .then(res => setNotices(res.data))
      .catch(err => console.error("공지사항 불러오기 실패", err));
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);

  const buttonStyle = {
    position: "fixed",
    bottom: "40px",
    right: "30px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#f6f3f2",
    color: "white",
    fontSize: "20px",
    border: "1px solid #e5e5e5",
    boxShadow: "0 0 8px rgba(0,0,0,0.3)",
    zIndex: 9999,
    cursor: "pointer",
  };

  const popupStyle = {
    position: "fixed",
    bottom: "80px",
    right: "20px",
    width: "300px",
    height: "500px",
    backgroundColor: "#f6f3f2",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 9999,
  };

  const headerStyle = {
    backgroundColor: "#f6f3f2",
    color: "white",
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };

  const closeButton = {
    background: "transparent",
    border: "none",
    color: "#000",
    fontSize: "20px",
    cursor: "pointer",
  };

  const tabActive = {
    backgroundColor: "transparent",
    color: "#000",
    border: "none",
    padding: "6px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    fontWeight: "bold",
  };

  const tabInactive = {
    backgroundColor: "transparent",
    color: "#555",
    border: "none",
    padding: "6px 12px",
    marginRight: "8px",
    borderRadius: "6px",
    opacity: 0.6,
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={buttonStyle}
      >
        <img style={{ width: 20, height: 20 }} src="/img/favicon.ico"></img>
      </button>
    );
  }

  return (
    <div style={popupStyle} ref={popupRef}>
      {/* Header */}
      <div style={headerStyle}>
  {/* ← 뒤로가기 버튼 */}
  <div style={{ width: 32 }}>
    {activeTab !== "hello" && (
      <button
        onClick={() => setActiveTab("hello")}
        style={{
          background: "transparent",
          border: "none",
          color: "#000",
          fontSize: 16,
          cursor: "pointer",
          marginLeft:10
        }}
        title="홈으로"
      >
        ←
      </button>
    )}
  </div>

  {/* 중앙 타이틀 */}
  <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", pointerEvents: "none" }}>
    <span style={{ fontSize: 14, fontWeight: "bold", color: "#333" }}>
      꼼파뇨
    </span>
  </div>

  {/* ✖ 닫기 버튼 */}
  <div style={{ width: 32, textAlign: "right" }}>
    <button
      onClick={() => setOpen(false)}
      style={{
        background: "transparent",
        border: "none",
        color: "#333",
        fontSize: 18,
        cursor: "pointer",
      }}
      title="닫기"
    >
      ✖
    </button>
  </div>
</div>


      {/* 내용 */}
      <div style={{ flex: 1 }}>
        {activeTab === "hello" &&
          <div>
            <div style={{ margin: '0 auto', width: '90%', backgroundColor: '#fff', borderRadius: 5, paddingBottom: 10 }}>
              <p style={{ fontSize: 12, padding: 10, marginBottom: 0 }}>채팅</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #e5e5e5', margin: 10, padding: 10, borderRadius: 5, marginTop: 0 }}>
                <div>
                  <p style={{ fontSize: 12, margin: 0 }}>꼼파뇨봇 채팅</p>
                  <p style={{ color: '#555', fontSize: 12, margin: 0 }}>챗봇으로 문의하기</p>
                </div>
                <button className="btn btn-sm btn-outline-dark" style={{ border: '1px solid #e5e5e5', borderRadius: 12, fontSize: 12, padding: '0 10px', height: '25px', marginTop: 5 }}
                  onClick={() => setActiveTab("bot")}
                >
                  문의하기
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #e5e5e5', margin: 10, padding: 10, borderRadius: 5, marginTop: 0 }}>
                <div>
                  <p style={{ fontSize: 12, margin: 0 }}>상담원 채팅</p>
                  <p style={{ color: '#555', fontSize: 12, margin: 0 }}>매일 00:00 ~ 24:00</p>
                </div>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="btn btn-sm btn-outline-dark" style={{ border: '1px solid #e5e5e5', borderRadius: 12, fontSize: 12, padding: '0 10px', height: '25px', marginTop: 5 }}
                  disabled={!chatAllowed}
                >
                  문의하기
                </button>
              </div>
            </div>
            <div style={{
  margin: '0 auto',
  width: '90%',
  backgroundColor: '#fff',
  borderRadius: 5,
  paddingBottom: 10,
  marginTop: 10
}}>
  <p style={{ fontSize: 12, padding: 10, marginBottom:0 }}>공지</p>
  <ul style={{ listStyle: 'none', paddingLeft: 10, paddingRight: 10, marginBottom: 10 }}>
    {notices.map(notice => (
      <li key={notice.id} style={{
        fontSize: 12,
        padding: 10,
        border: '1px solid rgb(229, 229, 229)',
        borderRadius: 5,
        marginBottom: 5,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ flex: 1, marginRight: 10 }}>
          <span style={{ fontWeight: 'bold', fontSize:10 }}>{notice.title}</span><br />
          <span style={{ fontSize: 10, color: '#999' }}>
            {notice.createdAt?.substring(0, 10)}
          </span>
        </div>
        <button
          className="btn btn-sm btn-outline-dark"
          style={{ border: '1px solid #e5e5e5', borderRadius: 12, fontSize: 12, padding: '0 10px', height: '25px', marginTop: 5 }}
          onClick={() => window.open(`/notices/${notice.id}`, '_blank')}
        >
          바로가기
        </button>
      </li>
    ))}
  </ul>
</div>

          </div>
        }
        <div style={{ flex: 1, height: '100%' }}>
          {activeTab === "bot" && <ChatWindow />}

          {activeTab === "chat" && chatAllowed && roomId && (
            <ChattingRoomPage roomId={roomId} />
          )}
        </div>
        {activeTab === "chat" && !chatAllowed && (
          <div style={{ padding: 20, color: "gray" }}>
            1:1 채팅은 로그인 후 이용하실 수 있습니다.
          </div>
        )}
      </div>
    </div>
  );
}
