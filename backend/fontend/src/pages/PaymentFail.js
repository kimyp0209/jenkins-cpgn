import { useSearchParams } from "react-router-dom";

function PaymentFail() {
  const [params] = useSearchParams();
  const message = params.get("message") || "알 수 없는 오류";

  return (
    <div className="container" style={{paddingTop:150}}>
      <h3>❌ 결제 실패</h3>
      <p>사유: {message}</p>
    </div>
  );
}

export default PaymentFail;
