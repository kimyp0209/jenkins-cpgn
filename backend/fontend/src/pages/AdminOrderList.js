import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = () => {
  axios.get(`/api/admin/orders?page=${page}&size=10`, { withCredentials: true })
    .then(res => {
      console.log("📦 주문 응답:", res.data);
      setOrders(res.data.content || []);         // ✅ 배열만 저장
      setTotalPages(res.data.page?.totalPages || 0);
    })
    .catch(err => {
      console.error("❌ 주문 목록 불러오기 실패", err);
      alert("주문 목록 불러오기 실패");
      setOrders([]);  // 💥 map 에러 방지
    });
};

  useEffect(() => {
    fetchOrders();
  }, [page]);

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <h2 className="" style={{ fontWeight: 'bold' }}>주문 관리</h2>
      <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>주문자</th>
            <th>총 금액</th>
            <th>상태</th>
            <th>주문일</th>
            <th>상세</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.username || 'N/A'}</td>
              <td>{order.totalAmount.toLocaleString()}원</td>
              <td>{order.status}</td>
              <td>{order.createdAt?.split("T")[0].replace(/-/g, ".") + "."}</td>
              <td>
                <Link
                  style={{ borderRadius: 0 }}
                  to={`/admin/orders/${order.id}`}
                  className="btn btn-sm btn-outline-primary"
                >
                  보기
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* ✅ 페이지네이션 */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
