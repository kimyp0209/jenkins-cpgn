// AdminQnaList.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchAdminQnas } from '../api';

export default function AdminQnaList() {
  const [qnas, setQnas] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [onlyUnanswered, setOnlyUnanswered] = useState(false);

  const filteredQnas = onlyUnanswered
  ? qnas.filter(qna => !qna.answerContent)
  : qnas;

  const fetchQnas = async () => {
  try {
    const res = await fetchAdminQnas(page);
    console.log("📝 QnA 전체 응답:", res.data);

    const content = Array.isArray(res.data.content) ? res.data.content : [];
    const total = typeof res.data.page?.totalPages === 'number' ? res.data.page.totalPages : 0;

    setQnas(content);
    setTotalPages(total);
  } catch (error) {
    console.error("❌ Q&A 목록 불러오기 실패:", error);
    alert("Q&A 목록을 불러오지 못했습니다.");
    setQnas([]);
    setTotalPages(0);
  }
};

  useEffect(() => {
  fetchQnas(); // ✅ 이 함수만 사용
}, [page]);

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <div className="d-flex justify-content-between align-items-center">
  <h2 className="" style={{ fontWeight: 'bold' }}>Q&A 관리</h2>
  <label style={{ fontSize: 14 }}>
    <input
      type="checkbox"
      checked={onlyUnanswered}
      onChange={() => setOnlyUnanswered(!onlyUnanswered)}
      style={{ marginRight: 6 }}
    />
    답변 미완료만 보기
  </label>
</div>
      <div className="table-responsive">
      <table className="table table-bordered text-center">
        <thead className="table-dark">
          <tr style={{whiteSpace: "nowrap"}}>
            <th>#</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>답변 여부</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
  {filteredQnas.length === 0 ? (
    <tr>
      <td colSpan="6" className="text-center text-muted">
        등록된 Q&A가 없습니다.
      </td>
    </tr>
  ) : (
    filteredQnas.map(qna => (
      <tr key={qna.id}>
        <td>{qna.id}</td>
        <td>{qna.questionTitle}</td>
        <td>{qna.questionUser?.username || "알 수 없음"}</td>
        <td>{new Date(qna.questionCreated).toLocaleDateString()}</td>
        <td>{qna.answerContent ? '✅' : '❌'}</td>
        <td>
          <Link
            to={`/qna/${qna.id}`}
            className="btn btn-sm btn-outline-primary"
            style={{ borderRadius: 0, whiteSpace: "nowrap" }}
          >
            상세
          </Link>
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
