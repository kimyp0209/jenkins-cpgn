import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCart, createTossPayment } from "../api"; // API 참고

function CheckoutPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart().then((res) => setItems(res.data));
  }, []);

  const handlePayment = async () => {
    const res = await createTossPayment(); // backend에서 결제 정보 생성 및 요청 URL 받기
    window.location.href = res.data.paymentUrl;
  };

  return (
    <div className="container mt-5">
      <h3>🧾 결제하기</h3>
      <ul className="list-group mb-3">
        {items.map(item => (
          <li className="list-group-item" key={item.productId}>
            {item.productName} x {item.quantity}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" onClick={handlePayment}>
        결제 진행
      </button>
    </div>
  );
}
export default CheckoutPage;
