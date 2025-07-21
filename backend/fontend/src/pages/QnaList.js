import React, { useEffect, useState } from 'react';
import { fetchMyQnaList } from '../api';
import QnaForm from './QnaForm'; // ✅ QnaForm import
import { Link } from 'react-router-dom';

export default function QnaList() {
  const [qnas, setQnas] = useState([]);
  const [showForm, setShowForm] = useState(false); // ✅ 상태 추가

  useEffect(() => {
  if (!showForm) {
    fetchMyQnaList()
      .then(res => setQnas(res.data))
      .catch(err => {
        if (err.response?.status === 401) {
          alert("로그인이 필요합니다.");
          window.location.href = "/login";
        } else {
          console.error("Q&A 목록 불러오기 실패", err);
        }
      });
  }
}, [showForm]);


  const handleFormComplete = () => {
    setShowForm(false); // 폼 등록 완료 시 닫고 목록 리로딩
  };

  return (
    <div className="" style={{ padding: 0 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop:10,
        paddingBottom:5,
        borderBottom: '1px solid #000'
      }}>
        <h2 style={{ fontSize: 20, fontWeight: "bold", margin: 0, padding:0}}>1:1 문의내역</h2>
        <button
          onClick={() => setShowForm(prev => !prev)}
          style={{ borderRadius: 0, fontSize: 12, marginBottom:10 }}
          className="btn btn-outline-dark"
        >
          {showForm ? "← 목록으로" : "1:1 문의하기"}
        </button>
      </div>

      {showForm ? (
        <QnaForm onComplete={handleFormComplete} />
      ) : (
        <ul className="list-group" style={{ width: "100%", border:0, padding:0 }}>
          {qnas.length === 0 ? (
            <li style={{border:0, padding:'10px 0', textAlign:'center'}} className="list-group-item">게시글이 존재하지 않습니다.</li>
          ) : (
            qnas.map(qna => (
              <li
                key={qna.id}
                style={{
                  fontSize: 14,
                  padding: '20px 0',
                  width: '100%',
                  display: 'flex',
                  borderBottom: '1px solid #DEDEDE'
                }}
              >
                <span style={{ width: '10%', textAlign: 'center' }}>{qna.id}</span>
                <Link
                  style={{ width: '70%' }}
                  to={`/qna/${qna.id}`}
                  className="text-decoration-none text-dark"
                >
{qna.questionTitle}
                </Link>
                <span style={{ width: '10%', color: qna.answerContent ? 'green' : 'red' }}>
                  {qna.answerContent ? '답변 완료' : '미답변'}
                </span>
                <span style={{ width: '10%' }}>
                  {qna.questionCreated?.substring(0, 10)}
                </span>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
