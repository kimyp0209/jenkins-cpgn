import { prepareOrder } from "../api";

function CheckoutButton() {
  const handleCheckout = async () => {
    try {
      const res = await prepareOrder();
      const { orderId, amount, orderName, customerName, error } = res.data;

      if (error) {
        alert(error);
        return;
      }

      const clientKey = process.env.REACT_APP_TOSS_CLIENT_KEY;
      const origin = window.location.origin; // 현재 브라우저 주소 (도메인 자동 반영)

      const tossUrl = `https://checkout.tosspayments.com/payments?clientKey=${clientKey}&orderId=${orderId}&amount=${amount}&orderName=${orderName}&customerName=${customerName}&successUrl=${origin}/payment/success&failUrl=${origin}/payment/fail`;

      window.location.href = tossUrl;
    } catch (e) {
      alert("결제를 시작할 수 없습니다.");
      console.error(e);
    }
  };

  return (
    <button onClick={handleCheckout} className="btn btn-success">
      결제하기
    </button>
  );
}

export default CheckoutButton;
