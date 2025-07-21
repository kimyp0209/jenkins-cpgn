import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, createCustomerChattingRoom } from "../api";

function ChattingButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

    useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        setUser(res.data);
      } catch (err) {
        console.error("❌ 로그인 사용자 정보 불러오기 실패", err);
      }
    };

    fetchUser();
  }, []);

  const handleClick = async () => {
  if (!user || !user.userId) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const res = await createCustomerChattingRoom(user.userId);
    console.log("✅ 채팅방 생성 결과:", res.data);

    if (!res.data || !res.data.id) {
      throw new Error("채팅방 생성 실패: 응답이 이상합니다");
    }

    const roomId = res.data.id;

    // ✅ 팝업으로 열기
    window.open(
      `/chatting/${roomId}`, // React 라우터 경로
      "ChatPopup",
      `width=400,height=600,left=${window.innerWidth - 420},top=${window.innerHeight - 640},resizable=no`
    );
  } catch (err) {
    console.error("❌ 채팅방 생성 에러:", err);
    alert("채팅방 생성 중 문제가 발생했습니다.");
  }
};



  return (
    <button
      onClick={handleClick}
      style={{
        position: "fixed",
        bottom: "90px", // 챗봇 버튼 위에 배치
        right: "20px",
        width: "50px",
        height: "50px",
        borderRadius: "25px",
        backgroundColor: "#0d6efd",
        color: "white",
        fontSize: "20px",
        border: "none",
        boxShadow: "0 0 8px rgba(0,0,0,0.3)",
        cursor: "pointer",
        zIndex:9999
      }}
    >
      1:1
    </button>
  );
}

export default ChattingButton;
