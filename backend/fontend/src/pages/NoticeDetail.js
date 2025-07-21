import React, { useEffect, useState } from 'react';
import { getNoticeById } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function NoticeDetail() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getNoticeById(id).then(res => setNotice(res.data));
  }, [id]);

  if (!notice) return <div className="container mt-5">불러오는 중...</div>;

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom: 100 }}>
      <h2
        style={{
          fontWeight: "bold",
          padding: "15px 0",
          borderBottom: "1px solid #000",
          margin: 0,
          paddingBottom: 30,
          width: "100%",
          textAlign: "center",
        }}
      >
        NOTICE
      </h2>

      {/* 정보 테이블 */}
      <table className="table table-bordered" style={{  margin:0 }}>
        <tbody>
          <tr>
            <th style={{ fontSize:12,color:'#353535',paddingLeft:20, width: '20%', border:'1px solid rgb(221, 221, 221)' }}>제목</th>
            <td style={{ fontSize:12,color:'#353535',border:'1px solid rgb(221, 221, 221)' }} colSpan="3">{notice.title}</td>
          </tr>
          <tr>
            <th style={{fontSize:12,color:'#353535',paddingLeft:20, border:'1px solid rgb(221, 221, 221)' }}>작성자</th>
            <td style={{fontSize:12,color:'#353535',border:'1px solid rgb(221, 221, 221)' }}>CPGN</td>
          </tr>
        </tbody>
      </table>

      <div style={{border: '1px solid #ddd', borderTop:0}}>
        <div style={{padding:'20px 30px 0 30px'}}>
          <span style={{fontSize:12, color:'#353535', fontWeight:'bold', marginRight:3}}>작성일</span>
          <span style={{color:'#939393', fontSize:11}}>{notice.createdAt?.slice(0, 19).replace('T', ' ')}</span>
        </div>
        <div style={{width:'90%', margin:'0 auto', height:1, backgroundColor:'#eaeaea', marginTop:10}}></div>
      {/* 본문 */}
        <div style={{
          background: '#fff',
          padding:'0 30px',
          minHeight: '300px',
          fontSize: 12,
          whiteSpace: 'pre-line',
          color:'#353535',
          marginTop:10,
          marginBottom:30,
        }}>
          {notice.content}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="text-center mt-4">
        <button style={{width:100, borderRadius:0}} className="btn btn-outline-secondary" onClick={() => navigate('/notices')}>목록</button>
      </div>
    </div>
  );
}
