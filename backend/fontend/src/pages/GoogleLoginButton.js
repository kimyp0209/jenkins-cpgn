import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function GoogleLoginRedirectButton() {
  const login = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (codeResponse) => {
      try {
        const { code } = codeResponse;
        const redirectUri = window.location.origin;  // 예: http://localhost:3000 또는 배포 도메인

        // 백엔드에 auth code 전송
        await axios.post("/api/oauth/google", {
          code,
          redirectUri,
        }, {
          withCredentials: true,
        });

        alert("구글 로그인에 성공했습니다.");
        window.location.href = "/";
      } catch (err) {
        console.error("Google OAuth 처리 중 오류 발생", err);
        alert("구글 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    },
    onError: (errorResponse) => {
      console.error("Google 로그인 실패", errorResponse);
      alert("구글 로그인에 실패했습니다.");
    },
  });

  return (
    <button
      type="button"
      onClick={() => {
        try {
          login();
        } catch (err) {
          console.error("로그인 트리거 오류", err);
          alert("로그인 실행 중 문제가 발생했습니다.");
        }
      }}
      className="btn btn-outline-secondary w-100"
      style={{ height: 56, marginTop: 10 }}
    >
      <img style={{ width: 60 }} src="/img/Google_logo.png" alt="Google" />
      로 로그인
    </button>
  );
}

export default GoogleLoginRedirectButton;
