import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { getCurrentUser } from "./api";

import ScrollToTop from "./pages/ScrollToTop";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";

import NoticeList from "./pages/NoticeList";
import NoticeDetail from "./pages/NoticeDetail";
import NoticeForm from "./pages/NoticeForm";

import QnaList from "./pages/QnaList";
import QnaDetail from "./pages/QnaDetail";
import QnaForm from "./pages/QnaForm";

import ProductDetail from "./pages/ProductDetail";
import ProductForm from "./pages/ProductForm";
import ProductList from "./pages/ProductList";

import CartPage from "./pages/CartPage";

import PaymentFail from "./pages/PaymentFail";
import PaymentSuccess from "./pages/PaymentSuccess";
import OrderListPage from "./pages/OrderListPage";

import ShippingFormPage from "./pages/ShippingFormPage";
import PayPage from "./pages/PayPage";
import OrderDetailPage from "./pages/OrderDetailPage";

import ReviewFormPage from "./pages/ReviewFormPage";
import ChatWindow from "./pages/ChatWindow";

import DataroomList from "./pages/DataroomList";
import DataroomForm from "./pages/DataroomForm";
import DataroomDetail from "./pages/DataroomDetail";

import ChattingRoomList from "./pages/ChattingRoomList";
import ChattingRoomPage from "./pages/ChattingRoomPage";

import AdminChatRoomPage from './pages/AdminChattingRoomPage';

import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";
import AdminNoticeList from "./pages/AdminNoticeList";
import AdminOrderList from "./pages/AdminOrderList";
import AdminProductList from "./pages/AdminProductList";
import AdminQnaList from "./pages/AdminQnaList";
import AdminUserList from "./pages/AdminUserList";
import AdminOrderDetailPage from "./pages/AdminOrderDetailPage";
import AdminReviewList from "./pages/AdminReviewList";
import BannerForm from "./pages/BannerForm";
import BannerList from "./pages/BannerList";

import ChatPopupPage from "./pages/ChatPopupPage";
import AdminDataroomList from "./pages/AdminDataroomList";
import MyReviewList from "./pages/MyReviewList";
import AdminReviewAudioGenerator from "./pages/AdminReviewAudioGenerator";

import KakaoCallbackPage from "./pages/KakaoCallbackPage";

function AppRouter() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userId = 1; // 예시용 사용자 ID
  const roomId = 2; // 예시용 채팅방 ID

  useEffect(() => {
  getCurrentUser().then((res) => {
    setUser(res.data); // 로그인 안 되어 있으면 null
    if (!res.data) {
      const publicPaths = [
        "/", "/login", "/register", "/products",
        "/board", "/notices", "/qna", "/datarooms",
        "/products/category", "/products/", // 또는 startsWith 처리
      ];
      if (!publicPaths.some((path) => window.location.pathname.startsWith(path))) {
        navigate("/login");
      }
    }
  });
}, []);

  function RequireLogin({ children }) {
    const navigate = useNavigate();
    useEffect(() => {
      navigate("/login");
    }, []);
    return null;
  }

  return (
    <div className="app-wrapper">
      <Header user={user} />
      <ScrollToTop />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
          <Route
            path="/cart"
            element={user ? <CartPage user={user} /> : <RequireLogin />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/products/category/:category" element={<ProductList user={user} />} />
          <Route path="/products/:id" element={<ProductDetail user={user} />} />
          <Route path="/notices" element={<NoticeList />} />
          <Route path="/notices/:id" element={<NoticeDetail />} />
          <Route path="/qna" element={<QnaList />} />
          <Route path="/qna/:id" element={<QnaDetail />} />
          <Route path="/chat-popup" element={<ChatWindow />} />
          <Route path="/datarooms" element={<DataroomList />} />
          <Route path="/datarooms/:id" element={<DataroomDetail />} />
          <Route path="/admin/chatting/:roomId" element={<AdminChatRoomPage />} />
          <Route path="/success" element={<PaymentSuccess />} />
          <Route path="/fail" element={<PaymentFail />} />
          {user && (
            <>
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/admin/notices/new" element={<NoticeForm />} />
              <Route path="/admin/notices/edit/:id" element={<NoticeForm />} />
              <Route path="/qna/new" element={<QnaForm />} />
              <Route path="/products/new" element={<ProductForm />} />
              <Route path="/products/edit/:id" element={<ProductForm />} />

              <Route path="/orders" element={<OrderListPage />} />
              <Route path="/shipping" element={<ShippingFormPage />} />
              <Route path="/pay" element={<PayPage />} />
              <Route path="/orders/:orderId" element={<OrderDetailPage />} />
              <Route path="/reviews/write" element={<ReviewFormPage />} />
              <Route path="/review" element={<MyReviewList />} />
              <Route
                path="/datarooms/new"
                element={<DataroomForm mode="create" />}
              />
              <Route
                path="/datarooms/edit/:id"
                element={<DataroomForm mode="edit" />}
              />
              <Route
                path="/chatting"
                element={<ChattingRoomList userId={user.userId} />}
              />
              <Route
                path="/chatting/:roomId"
                element={<ChattingRoomPage userId={user?.userId} />}
              />
            </>
          )}

          {user?.role === "ADMIN" && (
            <>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} /> {/* /admin */}
                <Route path="dashboard" element={<AdminDashboard />} />{" "}
                {/* /admin/dashboard */}
                <Route path="notices" element={<AdminNoticeList />} />
                <Route path="qna" element={<AdminQnaList />} />
                <Route path="products" element={<AdminProductList />} />
                <Route path="users" element={<AdminUserList />} />
                <Route path="orders" element={<AdminOrderList />} />
                <Route
                  path="chatting"
                  element={<ChattingRoomList userId={user.userId} />}
                />
                <Route path="datarooms" element={<AdminDataroomList />} />
                <Route path="reviews" element={<AdminReviewList />} />
                <Route path="audioreviews" element={<AdminReviewAudioGenerator />} />
                <Route path="createbanner" element={<BannerForm/>} />
                <Route path="bannerlist" element={<BannerList />} />
              </Route>

              {/* ✅ 관리자 주문 상세 페이지는 /admin 바깥에 따로 등록 */}
              <Route
                path="/admin/orders/:id"
                element={<AdminOrderDetailPage />}
              />
            </>
          )}

        </Routes>
      </div>
      {user
        ? <ChatPopupPage userId={user.userId} />   // 로그인 사용자
        : <ChatPopupPage />                        // 비회원도 챗봇만 가능
      }
      <Footer />
    </div>
  );
}

export default AppRouter;
