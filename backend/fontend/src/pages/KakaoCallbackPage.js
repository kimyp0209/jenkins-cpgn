import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { kakaoLogin, getCurrentUser } from "../api";

function KakaoCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    if (code) {
      kakaoLogin(code)
        .then(async () => {
          const res = await getCurrentUser(); // ✅ 로그인 성공 후 유저 정보 요청
          if (res.data) {
            // 예: 전역 user 상태가 있다면 여기에 저장
            // setUser(res.data); 또는 Context/Redux 사용 시 dispatch
          }

          alert("카카오 로그인 성공!");
          window.location.href = "/";
        })
        .catch((err) => {
          console.error("카카오 로그인 실패", err.response?.data || err.message);
          alert("로그인 실패");
        });
    }
  }, []);

  return <div>로그인 중...</div>;
}

export default KakaoCallbackPage;
