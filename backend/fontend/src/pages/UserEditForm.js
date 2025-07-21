import { useEffect, useState } from "react";
import axios from "axios";
import { deleteUser } from "../api";

function UserEditForm({ user, refreshUser, setActiveTab }) {
  const [form, setForm] = useState({ name: "", tel: "", address: "" });
  const [newEmail, setNewEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [code, setCode] = useState("");

  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  useEffect(() => {
  if (user) {
    // 전화번호 숫자만 추출 후 잘라내기
    const telClean = (user.tel || "").replace(/[^0-9]/g, "");
    if (telClean.length >= 10) {
      setPhone1(telClean.substring(0, 3));
      setPhone2(telClean.substring(3, telClean.length - 4));
      setPhone3(telClean.substring(telClean.length - 4));
    } else {
      setPhone1(""); setPhone2(""); setPhone3("");
    }

    // 주소 분해
    const [mainAddr, detailAddr] = (user.address || "").split("|");
    setAddress((mainAddr || "").trim());
    setDetailAddress((detailAddr || "").trim());

    setForm({
      name: user.name,
      tel: user.tel,
      address: user.address
    });

    setNewEmail(user.email);
  }
}, [user]);


  const handleSendCode = async () => {
    try {
      await axios.post("/api/email/send", { email: newEmail });
      alert("인증 코드가 전송되었습니다.");
    } catch {
      alert("이메일 전송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axios.post("/api/email/verify", {
        email: newEmail,
        code: code
      });
      if (res.data === "인증 성공") {
        setEmailVerified(true);
        alert("이메일 인증 성공");
      } else {
        alert("인증 실패");
      }
    } catch {
      alert("인증 실패");
    }
  };

  const handleUpdate = async () => {
    const fullTel = `${phone1}${phone2}${phone3}`;
    const fullAddr = `${address} ${detailAddress}`;
    const payload = {
      name: form.name,
      tel: fullTel,
      address: fullAddr,
    };

    if (newEmail !== user.email) {
      if (!emailVerified) {
        alert("이메일 변경 시 인증이 필요합니다.");
        return;
      }
      payload.email = newEmail;
    } else {
      payload.email = user.email;
    }

    try {
  await axios.put("/api/users/me", payload, { withCredentials: true });
  alert("회원정보가 수정되었습니다.");
  if (refreshUser) refreshUser();
if (setActiveTab) setActiveTab("edit");
} catch (err) {
  alert("수정 실패");
}
};

  const handleDeleteUser = async () => {
  if (window.confirm("정말 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.")) {
    try {
      await deleteUser();
      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/"; // 홈으로 이동
    } catch (err) {
      alert("회원 탈퇴에 실패했습니다.");
      console.error(err);
    }
  }
};

  return (
    <div style={{  }}>
      <h3 style={{fontWeight:'bold', borderBottom:'2px solid #000', paddingBottom:10}}>회원정보 수정</h3>
      {/* 이름 */}
      <div className="mb-3 mt-4">
        <label className="form-label">이름</label>
        <input
          className="form-control"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{borderRadius:0, height:50}}
        />
      </div>

      {/* 이메일 */}
      <div className="mb-3">
        <label className="form-label">이메일</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            className="form-control"
            value={newEmail}
            onChange={(e) => {
              setNewEmail(e.target.value);
              setEmailVerified(false);
            }}
            style={{borderRadius:0, height:50}}
          />
          <button style={{borderRadius:0, height:50, whiteSpace: 'nowrap'}} className="btn btn-outline-dark" onClick={handleSendCode}>
            코드전송
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            className="form-control"
            placeholder="인증 코드"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{borderRadius:0, height:50}}
          />
          <button style={{borderRadius:0, height:50, whiteSpace: 'nowrap'}} className="btn btn-outline-dark" onClick={handleVerifyCode}>
            인증확인
          </button>
        </div>
        {emailVerified && <p style={{ color: "green" }}>인증 완료된 이메일입니다.</p>}
      </div>

      {/* 연락처 */}
      <div className="mb-3">
        <label className="form-label">연락처</label>
        <div style={{ display: "flex", gap: 8, height:50, }}>
          <select value={phone1} onChange={(e) => setPhone1(e.target.value)} className="form-control" style={{ width: 150, borderRadius:0, height:50 }}>
            <option value="010">010</option>
            <option value="011">011</option>
          </select>
          <input value={phone2} onChange={(e) => setPhone2(e.target.value)} className="form-control" style={{ width: 150, borderRadius:0, height:50 }} />
          <input value={phone3} onChange={(e) => setPhone3(e.target.value)} className="form-control" style={{ width: 150, borderRadius:0, height:50 }} />
        </div>
      </div>

      {/* 주소 */}
      <div className="mb-3">
        <label className="form-label">주소</label>
        <div style={{ display: "flex", gap: 8, marginBottom:10 }}>
          <input
            className="form-control"
            value={address}
            readOnly
            placeholder="주소를 검색하세요"
            style={{borderRadius:0, height:50}}
          />
          <button style={{borderRadius:0, height:50, whiteSpace: 'nowrap'}} type="button" className="btn btn-outline-dark" onClick={() => {
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
          }}>우편번호</button>
        </div>
        <input
          className="form-control"
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          placeholder="상세주소 입력"
          style={{borderRadius:0, height:50}}
        />
      </div>
      <div style={{display:"flex", gap:10}}>
      <button onClick={handleUpdate} className="btn btn-dark w-100" style={{borderRadius:0}}>
        수정하기
      </button>
      <button onClick={handleDeleteUser} className="btn btn-danger w-100" style={{borderRadius:0}}>
  회원 탈퇴
</button>
    </div>
    </div>
  );
}

export default UserEditForm;
