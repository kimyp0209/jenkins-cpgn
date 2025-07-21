import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminDatarooms , deleteDataroom, getDownloadUrl } from '../api';

export default function AdminDataroomList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const loadDatarooms = async () => {
    try {
      const res = await fetchAdminDatarooms(page);
      console.log("📦 자료실 응답", res.data);
      setItems(res.data.content || []);
      setTotalPages(res.data.page?.totalPages || 0);
    } catch (err) {
      console.error("자료 불러오기 실패", err);
      alert("자료실을 불러올 수 없습니다.");
    }
  };

  useEffect(() => {
    loadDatarooms();
  }, [page]);

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteDataroom(id);
        alert("삭제되었습니다.");
        loadDatarooms(); // 삭제 후 갱신
      } catch (err) {
        console.error("삭제 실패", err);
        alert("삭제 중 오류 발생");
      }
    }
  };

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <div className="d-flex justify-content-between align-items-center">
  <h2 className="" style={{ fontWeight: 'bold' }}>자료실 관리</h2>
  <div className="d-flex align-items-center" style={{ gap: 8 }}>
    <input
      type="text"
      className="form-control"
      placeholder="자료명 검색"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ maxWidth: 200, border:0, borderBottom:'2px solid #000', borderRadius:0, marginBottom:8 }}
    />
    <Link style={{ borderRadius: 0, marginBottom:8 }} to="/datarooms/new" className="btn btn-dark">
      자료 등록
    </Link>
  </div>
</div>
      <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>자료명</th>
            <th>다운로드</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
  {filteredItems.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center text-muted">
        자료가 없습니다.
      </td>
    </tr>
  ) : (
    filteredItems.map((item) => (
      <tr key={item.id}>
        <td>{item.id}</td>
        <td className="text-start">{item.title}</td>
        <td>
          {item.filename ? (
            <a href={getDownloadUrl(item.id)}>
              <img src="/img/download.PNG" alt="download" width={24} />
            </a>
          ) : (
            "-"
          )}
        </td>
        <td>
          <Link
            to={`/datarooms/edit/${item.id}`}
            className="btn btn-sm btn-outline-secondary"
            style={{ marginRight: 8, borderRadius: 0 }}
          >
            수정
          </Link>
          <button
            onClick={() => handleDelete(item.id)}
            className="btn btn-sm btn-outline-danger"
            style={{ borderRadius: 0 }}
          >
            삭제
          </button>
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
