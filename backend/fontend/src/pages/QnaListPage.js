import { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchMyQnaList } from '../api';
import QnaForm from './QnaForm';
import { Link } from 'react-router-dom';

export default function QnaListPage() {
  const [qnas, setQnas] = useState([]);
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  useEffect(() => {
  if (!showForm) {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => setName(res.data.name))
      .catch(err => {
        if (err.response?.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        }
      });

    fetchMyQnaList(page, 10)
      .then(res => {
        setQnas(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => {
        console.error("Q&A 불러오기 실패", err);
      });
  }
}, [showForm, page]);

  const handleFormComplete = () => {
    setShowForm(false);
    setPage(0); // 등록 후 첫 페이지로
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: '2px solid #000' }}>
        <h3 style={{ fontWeight: 'bold' }}>문의내역</h3>
        <button
          onClick={() => setShowForm(prev => !prev)}
          style={{ borderRadius: 0, fontSize: 12, marginBottom: 10 }}
          className="btn btn-outline-dark"
        >
          {showForm ? "← 목록으로" : "1:1 문의하기"}
        </button>
      </div>

      {showForm ? (
        <QnaForm onComplete={handleFormComplete} />
      ) : qnas.length === 0 ? (
        <div className="text-center text-muted mt-3">문의 내역이 없습니다.</div>
      ) : (
        <>
          <table className="table" style={{ fontSize: 14 }}>
            <thead className="table-dark">
              <tr className="text-center">
                <th style={{ width: "10%" }}>번호</th>
                <th style={{ width: "60%" }}>제목</th>
                <th style={{ width: "15%" }}>작성일</th>
                <th style={{ width: "15%" }}>답변 상태</th>
              </tr>
            </thead>
            <tbody>
              {qnas.map((qna) => (
                <tr key={qna.id} className="text-center align-middle">
                  <td>{qna.id}</td>
                  <td className="text-start">
                    <Link to={`/qna/${qna.id}`} className="text-decoration-none text-dark">
                      {qna.questionTitle}
                    </Link>
                  </td>
                  <td>{qna.questionCreated?.substring(0, 10)}</td>
                  <td>
                    <span className={`badge ${qna.answerContent ? "bg-success" : "bg-secondary"}`}>
                      {qna.answerContent ? "답변 완료" : "미답변"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 */}
          <nav className="d-flex justify-content-center mt-3">
    <ul className="pagination">
      {[...Array(totalPages)].map((_, i) => (
        <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
          <button className="page-link" onClick={() => setPage(i)}>
            {i + 1}
          </button>
        </li>
      ))}
    </ul>
  </nav>
        </>
      )}
    </div>
  );
}
