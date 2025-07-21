import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function PayPage() {
  const location = useLocation();
  const { orderId, amount } = location.state || {};

useEffect(() => {
  if (!orderId || !amount) return;

  const interval = setInterval(() => {
    if (window.TossPayments) {
      clearInterval(interval); // ✅ 중복 실행 방지

      const toss = window.TossPayments(
  process.env.REACT_APP_TOSS_CLIENT_KEY,
  "test"
);

      toss.requestPayment("카드", {
        orderId,
        amount,
        orderName: "선택 상품 결제",
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    }
  }, 100); // 100ms 간격 체크

  return () => clearInterval(interval);
}, [orderId, amount]);


  return (
    <div className="container mt-5">
    </div>
  );
}

export default PayPage;
