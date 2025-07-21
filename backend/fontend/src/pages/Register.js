import { useState } from "react";
import axios from "axios";

// Register.js
function Register() {
  const [form, setForm] = useState({ username: "", password: "", confirmPassword: "", email: "", name: "", phone: "", address: "" });
  const [code, setCode] = useState("");
  const [verified, setVerified] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const handleSendCode = async () => {
    if (!form.email) {
      alert("이메일을 입력하세요.");
      return;
    }

    try {
      const res = await axios.get(`/api/users/check-email`, {
        params: { email: form.email },
      });

      setEmailAvailable(res.data.available); // ✅ 추가

      if (!res.data.available) {
        alert("이미 사용 중인 이메일입니다.");
        return;
      }

      await axios.post("/api/email/send", { email: form.email });
      alert("인증 코드가 전송되었습니다.");
    } catch (err) {
      alert("이메일 전송 실패");
    }
  };



  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("/api/email/verify", {
        email: form.email,
        code: code,
      });
      if (res.data === "인증 성공") {
        setVerified(true);
      } else {
        alert("인증 코드가 올바르지 않습니다.");
      }
    } catch {
      alert("인증 실패");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!usernameAvailable) {
    alert("아이디 중복확인을 해주세요.");
    return;
  }

  if (!verified) {
    alert("이메일 인증을 먼저 완료해 주세요.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const fullPhone = `${phone1}${phone2}${phone3}`;
  const fullAddress = `${address} ${detailAddress}`;

  const userData = {
    ...form,
    tel: fullPhone,
    address: fullAddress,
  };

  try {
    await axios.post("/api/users/register", userData);
    alert("회원가입 완료");
    window.location.href = "/login";
  } catch {
    alert("회원가입 실패");
  }
};


  const checkUsername = async () => {
    if (!form.username) return alert("아이디를 입력하세요.");
    try {
      const res = await axios.get(`/api/users/check-username`, {
        params: { username: form.username },
      });
      setUsernameAvailable(res.data.available);
    } catch {
      alert("아이디 확인 실패");
    }
  };


  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:100 }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 50, fontSize: 34 }}>JOIN US</h2>
      <form
        onSubmit={handleSubmit}
        style={{ maxWidth: 500, margin: "0 auto" }}
      >
        {/* 아이디 */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
            아이디
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="text"
              className="form-control"
              id="Username"
              placeholder="아이디"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
            />
            <button type="button" className="btn btn-outline-dark" style={{ height: 50, borderRadius: 0 }} onClick={checkUsername}>
              중복확인
            </button>
          </div>
          {usernameAvailable === false && <p style={{ color: "red", marginTop: 5, fontSize: 13 }}>이미 사용 중인 아이디입니다</p>}
          {usernameAvailable === true && <p style={{ color: "green", marginTop: 5, fontSize: 13 }}>사용 가능한 아이디입니다</p>}
        </div>


        {/* 비밀번호 */}
<div className="mb-3">
  <label htmlFor="password" className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
    비밀번호
  </label>
  <input
    type="password" // ✅ 비밀번호 안 보이게
    className="form-control"
    id="password"
    placeholder="비밀번호"
    value={form.password}
    onChange={(e) => setForm({ ...form, password: e.target.value })}
    style={inputStyle}
  />
</div>

{/* 비밀번호 확인 */}
<div className="mb-3">
  <label htmlFor="confirmPassword" className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
    비밀번호 확인
  </label>
  <input
    type="password" // ✅ 비밀번호 안 보이게
    className="form-control"
    id="confirmPassword"
    placeholder="비밀번호 확인"
    value={form.confirmPassword}
    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
    style={inputStyle}
  />
  {form.confirmPassword && form.password !== form.confirmPassword && (
    <p style={{ color: "red", fontSize: 13, marginTop: 5 }}>비밀번호가 일치하지 않습니다.</p>
  )}
  {form.confirmPassword && form.password === form.confirmPassword && (
    <p style={{ color: "green", fontSize: 13, marginTop: 5 }}>비밀번호가 일치합니다.</p>
  )}
</div>

        {/* 이메일 */}
        <div className="mb-3">
          <label htmlFor="email" className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
            이메일
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="이메일"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              style={{ ...inputStyle, flex: 1 }}
              required
            />
            <button type="button" className="btn btn-outline-dark" style={{ height: 50, borderRadius: 0 }} onClick={handleSendCode}>
              인증코드 전송
            </button>
          </div>
        </div>

        {/* 인증코드 입력 */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: "10px" }}>
            <input
              type="text"
              placeholder="인증코드 입력"
              className="form-control"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={inputStyle}
            />
            <button type="button" className="btn btn-outline-dark" style={{ whiteSpace: 'nowrap', height: 50, borderRadius: 0 }} onClick={handleVerifyCode}>
              인증확인
            </button>
          </div>
          {verified && <p style={{ color: "green", marginTop: 8 }}>인증 완료</p>}
        </div>

        {/* 이름 */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
            이름
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* 전화번호 */}
        <div className="mb-4">
          <label className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
            연락처
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              className="form-control"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
              style={{ width: 100, borderRadius: 0, height: 50 }}
            >
              <option value="">선택</option>
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
            </select>
            <span>-</span>
            <input
              className="form-control"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
              maxLength={4}
              style={{ width: 100, borderRadius: 0, height: 50 }}
            />
            <span>-</span>
            <input
              className="form-control"
              value={phone3}
              onChange={(e) => setPhone3(e.target.value)}
              maxLength={4}
              style={{ width: 100, borderRadius: 0, height: 50 }}
            />
          </div>
        </div>

        {/* 주소 */}
        <div className="mb-4">
          <label className="form-label" style={{ fontWeight: "bold", fontSize: 14 }}>
            주소
          </label>

          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input
              className="form-control"
              value={address}
              readOnly
              required
              placeholder="주소를 검색하세요"
              style={{ flex: 1, height: 50, borderRadius: 0 }}
            />
            <button
              type="button"
              className="btn btn-outline-dark"
              style={{ height: 50, whiteSpace: "nowrap", borderRadius: 0 }}
              onClick={() => {
                new window.daum.Postcode({
                  oncomplete: (data) => {
                    let fullAddr = data.address;
                    if (data.addressType === "R") {
                      if (data.bname) fullAddr += ` ${data.bname}`;
                      if (data.buildingName) fullAddr += ` (${data.buildingName})`;
                    }
                    setAddress(fullAddr);
                  },
                }).open();
              }}
            >
              우편번호
            </button>
          </div>

          <input
            className="form-control"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            required
            placeholder="상세주소 입력"
            style={{ height: 50, borderRadius: 0 }}
          />
        </div>


        {/* 회원가입 버튼 */}
        <button type="submit" style={{ padding: '10px 0' }} className="btn btn-dark w-100" disabled={!verified}>
          회원가입
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  border: 0,
  borderRadius: 0,
  borderBottom: "1px solid #CBCBCB",
  padding: "10px 0",
  color: "#151415",
  fontSize: 18,
};

export default Register;
