import { useState } from "react";
import { NavLink } from "react-router-dom";
import './style.css';

export default function AdminSidebar() {
  const [selected, setSelected] = useState(window.location.pathname);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelected(value); // 선택한 값을 상태에 저장
    if (value) {
      window.location.href = value;
    }
  };


  return (
    <div className="admin-sidebar-wrapper" style={{margin:'0 auto'}}>
      <ul className="nav text-center admin-sidebar" style={{paddingBottom:30}}>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin" end>
            대시보드
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/users">
            회원 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/notices">
            공지 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/qna">
            Q&A 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/products">
            상품 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/orders">
            주문 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/reviews">
            리뷰 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/chatting">
            채팅 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/datarooms">
            자료실 관리
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/admin/bannerlist">
            배너 관리
          </NavLink>
        </li>
      </ul>
      <select style={{borderRadius:0, marginBottom:30}}
        className="admin-sidebar-select form-select"
        value={selected}
        onChange={handleChange}
      >
        <option value="/admin">대시보드</option>
        <option value="/admin/users">회원 관리</option>
        <option value="/admin/notices">공지 관리</option>
        <option value="/admin/qna">Q&A 관리</option>
        <option value="/admin/products">상품 관리</option>
        <option value="/admin/orders">주문 관리</option>
        <option value="/admin/reviews">리뷰 관리</option>
        <option value="/admin/chatting">채팅 관리</option>
        <option value="/admin/datarooms">자료실 관리</option>
        <option value="/admin/bannerlist">배너 관리</option>
      </select>
    </div>
  );
}
