import { useEffect } from "react";

function KakaoLoginButton() {
  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("dummy-kakao-key"); // 더미 키로 초기화 (필수)
    }
  }, []);

  const loginWithKakao = () => {
    if (!window.Kakao || !window.Kakao.Auth) {
      alert("카카오 SDK가 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: "http://3.35.9.157:8003/oauth/kakao/callback",
    });
  };

  return (
    <button
      style={{
        width: 480,
        margin: "0 auto",
        border: 0,
        backgroundColor: "yellow",
        height: 56,
        borderRadius: 9,
      }}
      onClick={loginWithKakao}
    >
      카카오로 간편 로그인
    </button>
  );
}

export default KakaoLoginButton;
