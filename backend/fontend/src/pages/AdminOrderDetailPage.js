import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminOrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await axios.get(
  `/api/orders/admin/${id}`,
  { withCredentials: true }
);
        setOrder(res.data);
      } catch (err) {
        console.error("주문 상세 불러오기 실패", err);
        alert("주문 상세 가져오기 실패");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) return <div className="text-center mt-5">🔄 주문 정보를 불러오는 중...</div>;
  if (!order) return <div className="text-center text-danger mt-5">❌ 주문 정보를 찾을 수 없습니다.</div>;

  const {
    id: orderPk,
    name,
    phone,
    address,
    totalAmount,
    items,
    createdAt,
    status,
    orderId: realOrderId,
    username,
  } = order;

  function formatPhoneNumber(phone) {
    if (!phone) return "";

    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2,3})(\d{3,4})(\d{4})/, "$1-$2-$3");
    }

    return phone;
  }

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:100 }}>
      <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: 50 }}>관리자 주문 상세</h2>

      <div className="card mb-4" style={{ borderRadius: 0 }}>
        <div className="p-4">
          <h5 className="mb-3 border-bottom pb-2">주문 정보</h5>
          <p><strong>주문번호:</strong> {realOrderId}</p>
          <p><strong>주문일시:</strong> {new Date(createdAt).toLocaleString()}</p>
          <p style={{ margin: 0 }}><strong>주문 상태:</strong> <span className="badge bg-secondary">{status}</span></p>
        </div>
        <hr style={{ margin: 0 }}></hr>
        <div className="p-4">
          <h5 className="mb-3 border-bottom pb-2">배송 정보</h5>
          <p><strong>받는 사람:</strong> {name}</p>
          <p><strong>전화번호:</strong> {formatPhoneNumber(phone)}</p>
          <p style={{ margin: 0 }}><strong>주소:</strong> {address}</p>
        </div>
      </div>

      <div className="card p-4 mb-4" style={{ borderRadius: 0 }}>
        <h5 className="mb-3 border-bottom pb-2">주문 상품</h5>
        <div className="table-responsive">
          <table className="table align-middle" style={{ textAlign: 'center' }}>
            <thead className="table-dark">
              <tr>
                <th>이미지</th>
                <th>상품명</th>
                <th>가격</th>
                <th>수량</th>
                <th>합계</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><img src={item.thumbnailimg} alt="" width="60" style={{ cursor: "pointer" }}
          onClick={() => navigate(`/products/${item.productId}`)}/></td>
                  <td style={{ textAlign: 'left', cursor: "pointer"}}
          onClick={() => navigate(`/products/${item.productId}`)}>{item.productName}</td>
                  <td>{item.price.toLocaleString()}원</td>
                  <td>{item.quantity}</td>
                  <td>{(item.price * item.quantity).toLocaleString()}원</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{display:'flex', justifyContent: "space-between"}}>
        <div className="">
          <button
            className="btn btn-outline-secondary"
            style={{ borderRadius: 0 }}
            onClick={() => navigate(-1)}
          >
            ← 목록으로
          </button>
        </div>
        <div className="fs-5 fw-bold">
          총 결제금액: <span className="text-danger">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}

export default AdminOrderDetailPage;
