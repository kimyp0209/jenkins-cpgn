import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import GoogleLoginButton from './GoogleLoginButton';
import KakaoLoginButton from './KakaoLoginButton';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [saveId, setSaveId] = useState(false);
  const [isKakaoLogin, setIsKakaoLogin] = useState(false);

  useEffect(() => {
  const savedId = localStorage.getItem("savedUsername");
  if (savedId) {
    setForm(prev => ({ ...prev, username: savedId }));
    setSaveId(true);
  }
}, []);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (isKakaoLogin) return; // ✅ 카카오 로그인이면 일반 로그인 처리 안 함

  try {
    const res = await axios.get(`/api/users/check-social?email=${form.username}`);
    if (res.data.social) {
      alert("해당 계정은 구글/카카오 로그인 전용입니다.");
      return;
    }

    await axios.post('/api/users/login', form, { withCredentials: true });

    if (saveId) {
      localStorage.setItem("savedUsername", form.username);
    } else {
      localStorage.removeItem("savedUsername");
    }

    alert("로그인 성공");
    window.location.href = "/";
  } catch (err) {
    alert("로그인 실패");
  }
};

  


  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:100 }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 50, fontSize: 34 }}>LOGIN</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 480, margin: "0 auto", padding: 0 }}>
        <div style={{ marginBottom: 32 }}>
          <label htmlFor="username" className="form-label" style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 0 }}>아이디</label>
          <input
            id="username"
            className="form-control"
            placeholder="예) cpgn"
            value={form.username}
            style={{
              border: 0,
              borderRadius: 0,
              borderBottom: '1px solid #CBCBCB',
              padding: '10px 0',
              color: '#151415',
              fontSize: 18
            }}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label htmlFor="password" className="form-label" style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 0 }}>비밀번호</label>
          <input
            style={{
              border: 0,
              borderRadius: 0,
              borderBottom: '1px solid #CBCBCB',
              padding: '10px 0',
              color: '#151415',
              fontSize: 18
            }}
            id="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div className="login__utils" style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
          <div className="utils__checkbox">
            <input
  type="checkbox"
  id="saveId"
  name="saveId"
  checked={saveId}
  onChange={(e) => setSaveId(e.target.checked)}
/>
<label htmlFor="saveId">아이디 저장하기</label>
          </div>
          <ul>
            <li><a style={{fontSize:15, textDecoration:'underline'}} className="utils__link" href="/register">회원가입</a></li>
          </ul>
        </div>

        <button type="submit" style={{ height: 56, marginTop:20 }} className="btn btn-dark w-100">
          로그인
        </button>

        <GoogleLoginButton />
        
      </form>
      <div style={{margin:'0 auto', maxWidth:480, marginTop:10}}>
        {/* <KakaoLoginButton onSuccess={() => setIsKakaoLogin(true)} /> */}
        </div>
    </div>
  );
}
