import React, { useState, useEffect } from 'react';
import OrderListPage from './OrderListPage';
import QnaListPage from './QnaListPage';
import UserEditForm from './UserEditForm';
import axios from 'axios';
import { deleteUser } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import MyReviewList from './MyReviewList';


function MyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("orders");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab") || "orders";
  setCurrentTab(tab);

  if (location.state?.refresh) {
    setRefreshKey(location.state.refresh);  // ✅ key 업데이트
    navigate(location.pathname + location.search, { replace: true }); // URL 정리
  }
}, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);

  const [user, setUser] = useState(null);

  const fetchUser = () => {
    axios.get('/api/users/me', { withCredentials: true })
      .then(res => setUser(res.data))
      .catch(() => alert("로그인이 필요합니다."));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleTabChange = (tab) => {
    navigate(`/mypage?tab=${tab}`);
  };

  const handleDelete = async () => {
  if (window.confirm("정말 탈퇴하시겠습니까?")) {
    try {
      await deleteUser();
      alert("회원 탈퇴 완료");
      window.location.href = "/";
    } catch (err) {
      alert("회원 탈퇴 실패");
    }
  }
};

  return user ? (
    <div className="container" style={{ paddingTop: 150, paddingBottom: 150 }}>
      <div className="row">
        {/* 사이드바 */}
        <div className="col-md-2 mb-3">
  <h2 className="mb-4 fw-bold">MY</h2>
  {isMobile ? (
    <select
      className="form-select"
      value={currentTab}
      onChange={(e) => handleTabChange(e.target.value)}
    >
      <optgroup label="구매내역">
        <option value="orders">주문조회</option>
        <option value="reviews">상품리뷰</option>
      </optgroup>
      <optgroup label="Q&A">
        <option value="qna">문의내역</option>
      </optgroup>
      <optgroup label="계정관리">
        <option value="edit">회원정보 수정</option>
      </optgroup>
    </select>
  ) : (
    <div className="list-group">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>구매내역</p>
        <button onClick={() => handleTabChange("orders")} style={tabBtnStyle(currentTab === "orders")}>주문조회</button>
        <button onClick={() => handleTabChange("reviews")} style={tabBtnStyle(currentTab === "reviews")}>상품리뷰</button>
      </div>
      <div style={{ marginTop: 10 }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>Q&A</p>
        <button onClick={() => handleTabChange("qna")} style={tabBtnStyle(currentTab === "qna")}>문의내역</button>
      </div>
      <div style={{ marginTop: 10 }}>
        <p style={{ margin: 0, fontWeight: 'bold', fontSize: 18, marginBottom: 5 }}>계정관리</p>
        <button onClick={() => handleTabChange("edit")} style={tabBtnStyle(currentTab === "edit")}>회원정보 수정</button>
      </div>
    </div>
  )}
</div>


        {/* 콘텐츠 */}
        <div className="col-md-10">
          {currentTab === "orders" && <OrderListPage key="orders" />}
          {currentTab === "reviews" && <MyReviewList key="reviews" />}
          {currentTab === "qna" && <QnaListPage key="qna" />}
          {currentTab === "edit" && (
            <UserEditForm
              user={user}
              handleDelete={handleDelete}
              refreshUser={fetchUser}
              setActiveTab={handleTabChange}
            />
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center mt-5">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">로딩 중...</span>
      </div>
      <p className="mt-3">로딩 중...</p>
    </div>
  );
}

const tabBtnStyle = (active) => ({
  textAlign: 'left',
  paddingLeft: 0,
  border: 0,
  backgroundColor: '#fff',
  color: active ? 'blue' : '#555',
  cursor: 'pointer'
});


export default MyPage;
