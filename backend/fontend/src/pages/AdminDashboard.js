import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { fetchAdminSummary } from '../api';


export default function AdminDashboard() {
  const [stats, setSummary] = useState({
    userCount: 0,
    productCount: 0,
    orderCount: 0,
    qnaUnansweredCount: 0,
    recentQnas: [],
    recentOrders: []
  });

  

  useEffect(() => {
  fetchAdminSummary()
    .then(res => setSummary(res.data))
    .catch(err => {
      console.error("관리자 요약 로드 실패", err);
      alert("요약 정보를 불러올 수 없습니다.");
    });
}, []);


  return (
    <div className="container none" style={{paddinTop:150, paddingBottom:100}}>
      <h2 className="mb-4 " style={{fontWeight:'bold'}}>관리자 대시보드</h2>

      <div className="row text-center mb-4">
        <div className="col-md-3">
          <div className="card p-3" style={{borderRadius:0}}>
            <h5 style={{fontWeight:'bold'}}>회원 수</h5>
            <h3 style={{fontWeight:'bold'}}>{stats.userCount}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3" style={{borderRadius:0}}>
            <h5 style={{fontWeight:'bold'}}>상품 수</h5>
            <h3 style={{fontWeight:'bold'}}>{stats.productCount}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3" style={{borderRadius:0}}>
            <h5 style={{fontWeight:'bold'}}>주문 수</h5>
            <h3 style={{fontWeight:'bold'}}>{stats.orderCount}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card p-3" style={{borderRadius:0}}>
            <h5 style={{fontWeight:'bold'}}>미답변 Q&A</h5>
            <h3 style={{fontWeight:'bold'}}>{stats.qnaUnansweredCount}</h3>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <h5 style={{fontWeight:'bold'}}>최근 Q&A</h5>
          <ul className="list-group">
            {stats.recentQnas.map(qna => (
              <li key={qna.id} className="list-group-item d-flex justify-content-between" style={{borderRadius:0}}>
                <span>{qna.title}</span>
                <Link to={`/qna/${qna.id}`}>보기</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-md-6">
          <h5 style={{fontWeight:'bold'}}>최근 주문</h5>
          <ul className="list-group">
            {stats.recentOrders.map(order => (
              <li key={order.id} className="list-group-item d-flex justify-content-between" style={{borderRadius:0}}>
                <span>주문자: {order.username} / {order.totalAmount}원</span>
                <Link to={`/admin/orders/${order.id}`}>보기</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5">
        <h5 style={{fontWeight:'bold'}}>바로가기</h5>
        <div className="d-flex gap-3">
          <Link style={{borderRadius:0}} className="btn btn-primary" to="/admin/notices/new">공지 등록</Link>
          <Link style={{borderRadius:0}} className="btn btn-secondary" to="/products/new">상품 등록</Link>
          <Link style={{borderRadius:0}} className="btn btn-dark" to="/datarooms/new">자료 등록</Link>
        </div>
      </div>
    </div>
  );
}
