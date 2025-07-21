import React, { useEffect, useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import axios from "axios";
import { fetchAdminProducts } from "../api";
import AdminReviewAudioGenerator from "./AdminReviewAudioGenerator";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetchAdminProducts(page);
      console.log("📦 상품 응답 데이터:", res.data);

      const content = Array.isArray(res.data.content) ? res.data.content : [];
      const total =
        typeof res.data.page?.totalPages === "number"
          ? res.data.page.totalPages
          : 0;

      setProducts(content);
      setTotalPages(total); // 🔧 여기!!
    } catch (error) {
      console.error("❌ 상품 목록 불러오기 실패:", error);
      alert("상품 목록을 불러오지 못했습니다.");
      setProducts([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/products/${id}`, { withCredentials: true });
      alert("삭제 완료");
      fetchProducts(); // 삭제 후 갱신
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container none" style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h2 className="" style={{ fontWeight: "bold" }}>상품 관리</h2>
  <div className="d-flex align-items-center" style={{ gap: 8 }}>
    <input
      type="text"
      className="form-control"
      placeholder="상품명 검색"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{maxWidth: 200, border:0, borderBottom:'2px solid #000', borderRadius:0, marginBottom:8 }}
    />
    <Link
      to="/products/new"
      className="btn btn-dark"
      style={{ borderRadius: 0, whiteSpace: "nowrap", marginBottom:8 }}
    >
      상품 등록
    </Link>
  </div>
</div>
      <div className="table-responsive" style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table
          className="table table-bordered text-center"
          style={{ verticalAlign: "middle" }}
        >
          <thead className="table-dark" style={{minWidth: "1000px"}}>
            <tr style={{ whiteSpace: "nowrap" }}>
              <th>#</th>
              <th>썸네일</th>
              <th>상품명</th>
              <th>원가</th>
              <th>할인율</th>
              <th>할인가</th>
              <th>관리</th>
              <th>리뷰 요약</th>
            </tr>
          </thead>
          <tbody>
  {filteredProducts.length === 0 ? (
    <tr>
      <td colSpan="8" className="text-center text-muted">
        상품이 없습니다.
      </td>
    </tr>
  ) : (
    filteredProducts.map((prod) => (
      <tr key={prod.id}>
        <td>{prod.id}</td>
        <td>
          {prod.thumbnailimg ? (
            <img
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/products/${prod.id}`)}
              src={prod.thumbnailimg}
              alt="상품 썸네일"
              width="60"
            />
          ) : (
            "없음"
          )}
        </td>
        <td
          style={{ cursor: "pointer" }}
          onClick={() => navigate(`/products/${prod.id}`)}
        >
          {prod.name}
        </td>
        <td>{prod.price.toLocaleString()}원</td>
        <td>{prod.percent}%</td>
        <td>
          {(prod.price * (1 - prod.percent / 100)).toLocaleString()}원
        </td>
        <td style={{ whiteSpace: "nowrap" }}>
          <Link
            to={`/products/edit/${prod.id}`}
            className="btn btn-sm btn-outline-secondary me-2"
            style={{ borderRadius: 0 }}
          >
            수정
          </Link>
          <button
            onClick={() => handleDelete(prod.id)}
            className="btn btn-sm btn-outline-danger"
            style={{ borderRadius: 0 }}
          >
            삭제
          </button>
        </td>
        <td>
          <AdminReviewAudioGenerator productId={prod.id} />
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>
      {/* ✅ 페이지네이션 */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
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
