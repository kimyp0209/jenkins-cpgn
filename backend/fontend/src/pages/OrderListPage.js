import { useEffect, useState } from "react";
import { deleteReview, fetchOrderList, getCurrentUser, fetchOrderDetail, fetchReviewByOrderAndProduct } from "../api";
import { useNavigate, useLocation } from "react-router-dom";

function OrderListPage() {
  const [orders, setOrders] = useState([]);
  const [name, setName] = useState("");
  const [details, setDetails] = useState({});
  const navigate = useNavigate();
  const [reviewMap, setReviewMap] = useState({});
  const routerLocation = useLocation();
  const refreshTrigger = routerLocation.state?.refresh || false;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [userRes, orderRes] = await Promise.all([
          getCurrentUser(),
          fetchOrderList(),
        ]);
        setName(userRes.data.name);
        setOrders(orderRes.data);
        const currentUserId = userRes.data.userId;

        const detailPromises = orderRes.data.map((order) =>
          fetchOrderDetail(order.orderId || order.id)
        );
        const detailResponses = await Promise.all(detailPromises);
        const detailMap = {};
        detailResponses.forEach((res) => {
          const order = res.data;
          detailMap[order.orderId || order.id] = order;
        });
        setDetails(detailMap);

        const reviewCheckPromises = [];
        detailResponses.forEach((res) => {
          const order = res.data;
          order.items.forEach((item) => {
            reviewCheckPromises.push(
              fetchReviewByOrderAndProduct(order.id, item.productId, currentUserId)
                .then((res) => ({
                  key: `${order.id}_${item.productId}`,
                  review: res.data,
                }))
                .catch(() => null)
            );
          });
        });

        const reviewResults = await Promise.all(reviewCheckPromises);
        const newReviewMap = {};
        reviewResults.forEach((result) => {
          if (result && result.review) {
            newReviewMap[result.key] = result.review;
          }
        });
        setReviewMap(newReviewMap);
      } catch (err) {
        console.error("주문 목록 또는 상세 조회 실패", err);
      }
    };

    loadData();
  }, [refreshTrigger]);

  return (
    <div style={{ padding: 0 }}>
      <h3 style={{ fontWeight: 'bold', borderBottom: '2px solid #000', paddingBottom: 10 }}>주문 조회</h3>

      {orders.length > 0 ? (
        orders.map((order) => {
          const detail = details[order.orderId || order.id];
          if (!detail) return null;

          return (
            <div key={order.orderId || order.id} className="card mb-3" style={{ borderRadius: 0 }}>
              <div className="card-body" style={{ padding: 0 }}>
                <div style={{ display: "flex", borderBottom: "1px solid #e5e5e5", justifyContent: 'space-between' }}>
                  <div style={{ padding: 15, fontWeight: "bold", fontSize: 14 }}>
                    {new Date(detail.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <button
                      style={{ textDecoration: 'underline', padding: 15, fontSize: 13, color: '#555' }}
                      className="btn"
                      onClick={() => navigate(`/orders/${detail.orderId || detail.id}`)}
                    >
                      주문 상세
                    </button>
                  </div>
                </div>

                <div>
                  {detail.items.map((item) => {
                    const key = `${detail.id}_${item.productId}`;
                    const review = reviewMap[key];

                    return (
                      <div key={item.id} className="d-flex align-items-start" style={{ backgroundColor: "#fff", padding: 15 }}>
                        <img
                          src={item.thumbnailimg || "/default.jpg"}
                          alt={item.productName}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 6,
                            marginRight: 16,
                            cursor: "pointer"
                          }}
                          onClick={() => navigate(`/products/${item.productId}`)}
                        />


                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 14, color:'#000', fontWeight: "bold", marginBottom: 4, cursor: 'pointer' }} onClick={() => navigate(`/products/${item.productId}`)}>{item.productName}</div>
                          <div style={{ fontSize: 13, color: "#555" }}>{item.quantity}개</div>
                          <div style={{ fontSize: 13, color: "#555" }}>배송비: 무료</div>
                          <div style={{ fontSize: 15, fontWeight: "bold", marginTop: 4 }}>
                            {(item.price * item.quantity).toLocaleString()}원
                          </div>
                        </div>

                        {review ? (
                          <div className="mt-4 d-flex flex-column gap-2">
                            <button style={{borderRadius:0}}
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate(
                                  `/reviews/write?productId=${item.productId}&orderId=${detail.id}&reviewId=${review.id}`
                                )
                              }
                            >
                              리뷰 수정
                            </button>

                            <button style={{borderRadius:0}}
                              className="btn btn-sm btn-outline-danger"
                              onClick={async () => {
                                if (window.confirm("리뷰를 삭제하시겠습니까?")) {
                                  try {
                                    await deleteReview(review.id, review.userId);
                                    alert("리뷰가 삭제되었습니다.");
                                    navigate('.', { state: { refresh: Date.now() } });
                                  } catch (err) {
                                    alert("리뷰 삭제 중 오류 발생");
                                  }
                                }
                              }}
                            >
                              리뷰 삭제
                            </button>
                          </div>
                        ) : (
                          <button
                            className="mt-4 btn btn-sm btn-outline-danger"
                            style={{ border: "1px solid #ff69b4", color: "#ff69b4", borderRadius:0 }}
                            onClick={() => navigate(`/reviews/write?productId=${item.productId}&orderId=${detail.id}`)}
                          >
                            리뷰 작성
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-center text-muted mt-4">주문 내역이 없습니다.</p>
      )}
    </div>
  );
}

export default OrderListPage;
