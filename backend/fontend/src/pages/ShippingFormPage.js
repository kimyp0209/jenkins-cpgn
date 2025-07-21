import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../api";
import './style.css';

function ShippingFormPage() {
  const [user, setUser] = useState(null);
  const [useMyInfo, setUseMyInfo] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const items = location.state?.items || (location.state?.singleItem ? [location.state.singleItem] : []);
  const amount = location.state?.amount;

  const [name, setName] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");

  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");

  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("custom");

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        const u = res.data;
        setUser(u);
        setName(u.username || "");
        if (u.email) {
          const [idPart, domainPart] = u.email.split("@");
          setEmailId(idPart);
          setEmailDomain(domainPart);
          setSelectedDomain("custom");
        }
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패", err);
      });
  }, []);




  const handleSubmitAndRedirect = async () => {
    if (!name || !address ) {
      alert("배송 정보를 모두 입력해 주세요.");
      return;
    }

    if (!phone1 || !phone2 || !phone3) {
      alert("전화번호를 모두 입력해주세요");
      return;
    }

    const fullAddress = `${address} ${detailAddress}`;
    const fullPhone = `${phone1}${phone2}${phone3}`;

    try {
      const res = await axios.post(
  "/api/orders/prepare",
  {
    items: items,
    name: receiverName,
    phone: fullPhone,
    address: fullAddress,
  },
  { withCredentials: true }
);

      const { orderId, amount } = res.data;

      navigate("/pay", {
        state: {
          orderId,
          amount,
        },
      });
    } catch (err) {
      alert("요청 실패");
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom: 100 }}>
      <p
        style={{
          paddingBottom: 5,
          borderBottom: "1px solid #eee",
          marginBottom: 30,
        }}
      >
        ORDER
      </p>
      <div className="order-steps" style={{
  width: "100%",
  backgroundColor: "#f8f8f8",
  height: "auto",
  fontSize: 18,
  marginBottom: 50,
  padding: "20px 0"
}}>
  <div className="steps-wrapper" style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 95,
    flexWrap: "wrap"
  }}>
    <div style={{ display: "flex", alignItems: "center" }}>
      <img style={{ width: 21, height: 23, marginRight: 20 }} src="/img/order-icon01-1.png" alt="" />
      <p style={{ margin: 0, color: "#8d8d8d" }}>01. 장바구니</p>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <img style={{ width: 19, height: 23, marginRight: 20 }} src="/img/order-icon02.png" alt="" />
      <p style={{ margin: 0 }}>02. 주문서 작성</p>
    </div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <img style={{ width: 23, height: 23, marginRight: 20 }} src="/img/order-icon03-1.png" alt="" />
      <p style={{ margin: 0, color: "#8d8d8d" }}>03. 주문완료</p>
    </div>
  </div>
</div>

      <p style={{ fontSize: 20, marginBottom: 10 }}>주문자 정보</p>
      <div style={{ borderTop: "1px solid #ddd" }}></div>
      <table className="table" style={{ marginTop: 20, verticalAlign: "middle" }}>
        <tbody>
          <tr>
            <td style={{ width: "120px" }}>
              아이디
            </td>
            <td>{name}</td>
          </tr>
          <tr>
            <td style={{ width: 120 }}>이메일</td>
            <td>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* 이메일 아이디 */}
                <input
                  className="form-control"
                  value={emailId}
                  readOnly
                  style={{ borderRadius: 0, maxWidth: 250, height: 50 }}
                />
                <span>@</span>

                {/* 도메인 */}
                <input
                  className="form-control"
                  value={emailDomain}
                  onChange={(e) => setEmailDomain(e.target.value)}
                  disabled={selectedDomain !== "custom"} // "직접입력"만 활성
                  style={{ borderRadius: 0, maxWidth: 250, height: 50 }}
                />

                {/* 선택 박스 */}
                <select
                  className="form-control"
                  value={selectedDomain}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedDomain(val);
                    if (val !== "custom") setEmailDomain(val);
                  }}
                  style={{ borderRadius: 0, maxWidth: 250, height: 50 }}
                >
                  <option value="custom">직접입력</option>
                  <option value="naver.com">naver.com</option>
                  <option value="gmail.com">gmail.com</option>
                  <option value="daum.net">daum.net</option>
                </select>
              </div>
            </td>
          </tr>

        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop:100 }}>
        <p style={{ fontSize: 20, margin: 0 }}>배송지 정보</p>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="useMyInfo"
            checked={useMyInfo}
            onChange={(e) => {
  const checked = e.target.checked;
  setUseMyInfo(checked);
  if (checked && user) {
  setReceiverName(user.name || "");

  // 전화번호 처리 (숫자만 추출해서 나누기)
  const cleaned = (user.tel || "").replace(/[^0-9]/g, "");
  if (cleaned.length >= 10) {
    setPhone1(cleaned.substring(0, 3));
    setPhone2(cleaned.substring(3, cleaned.length - 4));
    setPhone3(cleaned.substring(cleaned.length - 4));
  } else {
    setPhone1(""); setPhone2(""); setPhone3("");
  }

  // 주소 처리
  const [mainAddr, detailAddr] = (user.address || "").split("|");
  setAddress((mainAddr || "").trim());
  setDetailAddress((detailAddr || "").trim());
}
 else {
  // 체크 해제되었을 때 → 입력값 초기화
  setReceiverName("");
  setPhone1(""); setPhone2(""); setPhone3("");
  setAddress("");
  setDetailAddress("");
}
}}

          />
          <label className="form-check-label" htmlFor="useMyInfo">
            내 정보로 배송지 입력
          </label>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #ddd" }}></div>
      <table
        className="table"
        style={{ marginTop: 20, verticalAlign: "middle" }}
      >
        <tbody>
          <tr>
            <td style={{ width: "120px" }}>
              이름<span style={{ color: "red" }}>*</span>
            </td>
            <td>
              <input
                className="form-control"
                value={receiverName}
                onChange={(e) => setReceiverName(e.target.value)}
                required
                style={{ height: 50, maxWidth: 250, borderRadius: 0 }}
              />
            </td>
          </tr>

          <tr>
            <td>
              연락처<span style={{ color: "red" }}>*</span>
            </td>
            <td>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <select
                  className="form-control"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  style={{ maxWidth: 150, height: 50, borderRadius: 0 }}
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
                  style={{ maxWidth: 150, height: 50, borderRadius: 0 }}
                />

                <span>-</span>

                <input
                  className="form-control"
                  value={phone3}
                  onChange={(e) => setPhone3(e.target.value)}
                  maxLength={4}
                  style={{ maxWidth: 150, height: 50, borderRadius: 0 }}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td style={{ verticalAlign: "top", paddingTop: 10 }}>
              주소<span style={{ color: "red" }}>*</span>
            </td>
            <td>
              <div style={{ display: "flex", maxWidth: 498, marginBottom: 10 }}>
                <input
                  className="form-control"
                  value={address}
                  readOnly
                  required
                  style={{ height: 50, borderRadius: 0 }}
                />
                <button
                  type="button"
                  className="btn "
                  style={{
                    width: 150,
                    border: "1px solid #000",
                    borderRadius: 0,
                    marginLeft: 5,
                  }}
                  onClick={() => {
                    new window.daum.Postcode({
                      oncomplete: (data) => {
                        let fullAddr = data.address;
                        if (data.addressType === "R") {
                          if (data.bname) fullAddr += ` ${data.bname}`;
                          if (data.buildingName)
                            fullAddr += ` (${data.buildingName})`;
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
                style={{ height: 50, maxWidth: 498, borderRadius: 0 }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-5">
        <button style={{ borderRadius: 0, maxWidth: 200, width: '100%' }} className="btn btn-dark" onClick={handleSubmitAndRedirect}>
          결제하기
        </button>
      </div>
    </div>
  );
}

export default ShippingFormPage;
