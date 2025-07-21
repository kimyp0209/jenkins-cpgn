import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { deleteNotice } from '../api';

export default function AdminNoticeList() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotices(page);
  }, [page]);

  const fetchNotices = (currentPage) => {
  axios.get(`/api/notices?page=${currentPage}&size=10`, { withCredentials: true })
    .then(res => {
      console.log("✅ 전체 응답 구조:", res.data);

      const content = Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data.page?.totalPages ?? 1;

      setNotices(content);
      setTotalPages(total);
    })
    .catch(err => {
      console.error("❌ 공지 목록 조회 실패", err);
      setNotices([]);
      setTotalPages(0);
    });
};

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteNotice(id);
        alert("삭제되었습니다.");
        fetchNotices(page); // 현재 페이지 다시 로딩
      } catch (err) {
        console.error("공지 삭제 실패", err);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h2 className="" style={{ fontWeight: 'bold' }}>공지 관리</h2>
  <div className="d-flex align-items-center" style={{ gap: 8 }}>
    <input
      type="text"
      className="form-control"
      placeholder="제목 검색"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      style={{ maxWidth: 200, border:0, borderBottom:'2px solid #000', borderRadius:0, marginBottom:8 }}
    />
    <Link to="/admin/notices/new" className="btn btn-dark" style={{ borderRadius: 0, marginBottom:8 }}>
      공지 등록
    </Link>
  </div>
</div>
      <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>제목</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredNotices) && filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <tr key={notice.id}>
                <td>{notice.id}</td>
                <td style={{cursor:'pointer'}} className="text-start" onClick={() => navigate(`/notices/${notice.id}`)}>{notice.title}</td>
                <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link
                    to={`/admin/notices/edit/${notice.id}`}
                    className="btn btn-sm btn-outline-secondary"
                    style={{ marginRight: 8, borderRadius: 0 }}
                  >
                    수정
                  </Link>
                  <button
                    onClick={() => handleDelete(notice.id)}
                    className="btn btn-sm btn-outline-danger"
                    style={{ borderRadius: 0 }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-muted">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
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
