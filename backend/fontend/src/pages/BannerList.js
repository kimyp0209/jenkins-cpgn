import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AdminBannerList() {
  const [banners, setBanners] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`/api/banner/list?page=${page}&size=10`, {
        withCredentials: true,
      });
      const content = res.data.content || [];
      const total = res.data.totalPages || 0;

      setBanners(content);
      setTotalPages(total);
    } catch (err) {
      console.error("❌ 배너 불러오기 실패", err);
      setBanners([]);
      setTotalPages(0);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axios.delete(`/api/banner/${id}`, { withCredentials: true });
      alert("삭제 완료");
      fetchBanners();
    } catch (err) {
      alert("삭제 실패");
    }
  };

  return (
    <div className="container none" style={{ paddingBottom: 100 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 className="" style={{ fontWeight: "bold" }}>배너 관리</h2>
        <div className="">
          <Link to="/admin/createbanner" className="btn btn-dark" style={{ borderRadius: 0 }}>
            배너 등록
          </Link>
        </div>
      </div>

      <div className="table-responsive" style={{ overflowX: "auto", maxWidth: "100%" }}>
        <table className="table table-bordered text-center" style={{ verticalAlign: "middle", minWidth: "800px" }}>
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>배너 미리보기</th>
              <th>프롬프트</th>
              <th>등록일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td>{banner.id}</td>
                <td>
  {banner.imageUrl ? (
    <div style={{
      width: "100%",
      maxWidth: "400px",
      height: "120px",
      overflow: "hidden",
      borderRadius: "8px",
    }}>
      <img
        src={banner.imageUrl}
        alt="배너"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </div>
  ) : "없음"}
</td>
                <td style={{ whiteSpace: "pre-wrap", textAlign: "left" }}>{banner.prompt || banner.text}</td>
                <td>{banner.createdAt?.substring(0, 10)}</td>
                <td>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: 0 }}
                  >
                    삭제
                  </button>
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
