import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQnaDetail, deleteQna, submitAnswer, updateAnswer, deleteAnswer } from '../api';

export default function QnaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [qna, setQna] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


useEffect(() => {
  axios.get('/api/users/me', { withCredentials: true })
    .then(res => {
      console.log("✅ QnaDetail 유저 응답:", res.data);
      setCurrentUser(res.data);
    })
    .catch(err => {
      console.error("❌ 유저 정보 가져오기 실패", err);
      setCurrentUser(null);
    });
}, []);

  useEffect(() => {
    fetchQnaDetail(id).then(res => {
      setQna(res.data);
      if (res.data.answerContent) {
        setAnswer(res.data.answerContent);
      }
    });
  }, [id]);

  

  useEffect(() => {
  console.log("✅ currentUser 정보:", currentUser);
}, [currentUser]);

  const handleDelete = async () => {
    await deleteQna(id);
    alert('삭제되었습니다');
    navigate('/qna');
  };

  const handleAnswerSubmit = async () => {
    if (qna.answerContent) {
      await updateAnswer(id, answer);
      alert('답변이 수정되었습니다');
    } else {
      await submitAnswer(id, answer);
      alert('답변이 등록되었습니다');
    }
    setIsEditing(false);
    window.location.reload();
  };

  const handleAnswerDelete = async () => {
    await deleteAnswer(id);
    alert('답변이 삭제되었습니다');
    window.location.reload();
  };

  if (!qna) return <div>로딩 중...</div>;

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:100 }}>
      <h2 style={{textAlign:'center', fontWeight:'bold', marginBottom:50}}>문의 상세</h2>
      <div className="text-end">
        <button className="btn btn-dark mt-3" style={{borderRadius:0, fontSize:10}} onClick={handleDelete}>질문삭제</button>
      </div>
      <table className="table table-bordered" style={{ fontSize: 14 }}>
        <tbody>
          <tr style={{fontSize:15}}>
            <th style={{ textAlign: 'center', padding:0 }}>작성자</th>
            <td style={{paddingBottom:0, paddingTop:0}}>{qna.questionUser?.username}</td>
          </tr>
          <tr style={{fontSize:15}}>
            <th style={{ textAlign: 'center' }}>작성일</th>
            <td>{qna.questionCreated?.substring(0, 10)}</td>
          </tr>
          <tr style={{fontSize:15}}>
            <th style={{ width: '15%', textAlign: 'center' }}>제목</th>
            <td>{qna.questionTitle}</td>
          </tr>
          
          <tr style={{fontSize:15}}>
            <th style={{ textAlign: 'center', verticalAlign:'top' }}>내용</th>
            <td style={{ whiteSpace: 'pre-line' }}>{qna.questionContent}</td>
          </tr>
        </tbody>
      </table>

      {qna.answerContent ? (
        <>
          <hr></hr>
          <table className="table table-bordered mt-4" style={{ fontSize: 14 }}>
            <tbody>
              <tr style={{fontSize:13}}>
                <th style={{ textAlign: 'center', padding:0 }}>관리자</th>
                <td style={{paddingBottom:0, paddingTop:0}}>{qna.answerAdmin?.username}</td>
              </tr>
              <tr style={{fontSize:15}}>
                <th style={{ width: '15%', textAlign: 'center', verticalAlign:'top' }}>답변</th>
                <td style={{ whiteSpace: 'pre-line' }}>{qna.answerContent}</td>
              </tr>
              
              {currentUser?.role === 'ADMIN' && (
                <tr>
                  <th style={{ textAlign: 'center' }}>관리</th>
                  <td>
                    {!isEditing ? (
                      <>
                        <button style={{borderRadius:0, fontSize:10}} className="btn btn-warning me-2" onClick={() => setIsEditing(true)}>답변수정</button>
                        <button style={{borderRadius:0, fontSize:10}} className="btn btn-danger" onClick={handleAnswerDelete}>답변삭제</button>
                      </>
                    ) : (
                      <>
                        <textarea
                          className="form-control mb-2"
                          value={answer}
                          onChange={e => setAnswer(e.target.value)}
                        />
                        <button style={{borderRadius:0, fontSize:10}} className="btn btn-success" onClick={handleAnswerSubmit}>수정완료</button>
                      </>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      ) : (
        currentUser?.role === 'ADMIN' && (
          <table className="table table-bordered mt-4" style={{ fontSize: 14 }}>
            <tbody>
              <tr style={{fontSize:15}}>
                <th style={{ width: '15%', textAlign: 'center' }}>답변 작성</th>
                <td >
                  <textarea
                    style={{borderRadius:0}}
                    className="form-control mb-2"
                    value={answer}
                    onChange={e => setAnswer(e.target.value)}
                  />
                  <button className="btn btn-dark" onClick={handleAnswerSubmit} style={{minWidth:60, borderRadius:0, fontSize:10}}>답변등록</button>
                </td>
              </tr>
            </tbody>
          </table>
        )
        
      )}

      
    </div>
  );
}
