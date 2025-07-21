import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import './style.css';

function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId");
  const paymentKey = params.get("paymentKey");
  const amount = params.get("amount");
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = useState(false);

  console.log("✅ 결제 파라미터 확인:", { orderId, paymentKey, amount });

  const handleConfirm = async () => {
    try {
      const res = await fetch("/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, paymentKey, amount, method: "카드" }),
      });

      if (!res.ok) throw new Error("결제 확인 실패");
      alert("결제가 성공적으로 완료되었습니다!");
      setConfirmed(true);
      navigate("/mypage");
    } catch (err) {
      console.error(err);
      alert("결제 처리 중 오류 발생");
    }
  };

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:150 }}>
      <p
        style={{
          paddingBottom: 5,
          borderBottom: "1px solid #eee",
          marginBottom: 30,
        }}
      >
        Success
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
            <img style={{ width: 19, height: 23, marginRight: 20 }} src="/img/order-icon02-1.png" alt="" />
            <p style={{ margin: 0, color: "#8d8d8d" }}>02. 주문서 작성</p>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img style={{ width: 23, height: 23, marginRight: 20 }} src="/img/order-icon03-1.png" alt="" />
            <p style={{ margin: 0 }}>03. 주문완료</p>
          </div>
        </div>
      </div>
      <div style={{margin:'0 auto'}}>
      <p>주문번호: {orderId}</p>
      <p>결제금액: {amount}원</p>

      {!confirmed && (
        <button style={{margin:'0 auto', width:100, borderRadius:0}} className="btn btn-dark" onClick={handleConfirm}>
          확인
        </button>
      )}
      </div>
    </div>
  );
}

export default PaymentSuccess;
