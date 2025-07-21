import axios from "axios";

const API_URL = "/api"; 
const NOTICE = "notices";


// 회원 관련 API
export const register = (data) => {
  return axios.post(`${API_URL}/users/register`, data);
};

export const login = (data) => {
  return axios.post(`${API_URL}/users/login`, data, { withCredentials: true });
};

export const getProfile = () => {
  return axios.get(`${API_URL}/users/me`, { withCredentials: true });
};

export const logout = () => {
  return axios.post(`${API_URL}/users/logout`, {}, { withCredentials: true });
};

export const deleteUser = () => {
  return axios.delete(`${API_URL}/users/me`, { withCredentials: true });
};

export const getCurrentUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/users/me`, { withCredentials: true });
    return res;
  } catch (err) {
    if (err.response?.status === 401) {
      // 로그인 안 된 상태: 콘솔 출력 없이 null 반환
      return { data: null };
    } else {
      // 다른 에러는 개발 중일 때만 콘솔 출력
      if (process.env.NODE_ENV === "development") {
        console.error("유저 정보 가져오기 실패", err);
      }
      throw err; // 필요하다면 이건 제거 가능
    }
  }
};

export const kakaoLogin = (code) => {
  return axios.post(`${API_URL}/oauth/kakao`, { code }, { withCredentials: true });
};

// ----------------------------------------------------------------------------



// 공지 목록 조회
export const getNotices = (page = 0, size = 10) => {
  return axios.get(`${API_URL}/${NOTICE}?page=${page}&size=${size}`, {
    withCredentials: true,
  });
};

// 공지 상세 조회
export const getNoticeById = (id) => {
  return axios.get(`${API_URL}/${NOTICE}/${id}`, { withCredentials: true });
};

// 공지 3개 조회
export const fetchLatestNotices = () =>
  axios.get(`${API_URL}/notices/latest`, { withCredentials: true });

// 공지 등록
export const createNotice = (data) => {
  return axios.post(`${API_URL}/${NOTICE}`, data, { withCredentials: true });
};

// 공지 수정
export const updateNotice = (id, data) => {
  return axios.put(`${API_URL}/${NOTICE}/${id}`, data, { withCredentials: true });
};

// 공지 삭제
export const deleteNotice = (id) => {
  return axios.delete(`${API_URL}/${NOTICE}/${id}`, { withCredentials: true });
};


// ----------------------------------------------------------------------------


// QnA 목록 가져오기
export const fetchQnaList = () =>
  axios.get(`${API_URL}/qna/list`, { withCredentials: true });

// QnA 상세 조회
export const fetchQnaDetail = (id) =>
  axios.get(`${API_URL}/qna/${id}`, { withCredentials: true });

// 질문 등록 (로그인 사용자)
export const submitQuestion = (data) =>
  axios.post(`${API_URL}/qna/question`, data, {
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
  });

// 답변 등록 (text만 보낸다면 그대로 사용 가능)
export const submitAnswer = (id, answer) =>
  axios.post(`${API_URL}/qna/answer/${id}`, answer, {
    headers: { 'Content-Type': 'text/plain' },
    withCredentials: true,
  });

// 질문 삭제 (작성자 또는 관리자)
export const deleteQna = (id) =>
  axios.delete(`${API_URL}/qna/delete/${id}`, { withCredentials: true });

const handleAnswerDelete = async (id) => {
  await axios.delete(`${API_URL}/qna/answer/${id}`, { withCredentials: true });
  alert('답변이 삭제되었습니다');
  window.location.reload();
};

export const updateAnswer = (id, answer) =>
  axios.put(`${API_URL}/qna/answer/${id}`, answer, {
    withCredentials: true,
    headers: {
      'Content-Type': 'text/plain',
    },
  });

export const deleteAnswer = (id) =>
  axios.delete(`${API_URL}/qna/answer/${id}`, {
    withCredentials: true,
  });

// 내가 작성한 QnA 목록 가져오기
export const fetchMyQnaList = (page = 0, size = 10) =>
  axios.get(`${API_URL}/qna/my?page=${page}&size=${size}`, { withCredentials: true });


// ----------------------------------------------------------------------------


// 전체 상품 목록 가져오기
export const fetchProductList = () => {
  return axios.get(`${API_URL}/products`, { withCredentials: true });
};

// 최신 상품 3개
export async function fetchLatestProducts() {
  return await axios.get(`${API_URL}/products/latest`, { withCredentials: true });
}

export const fetchProductCategories = () =>
  axios.get(`${API_URL}/products/categories`, { withCredentials: true });

// 단일 상품 상세 조회
export const fetchProductDetail = (id) => {
  return axios.get(`${API_URL}/products/${id}`, { withCredentials: true });
};

// 상품 등록
export const createProduct = (formData) => {
  return axios.post("/api/products", formData, {
    withCredentials: true,
    // ✅ Content-Type 생략!
  });
};

// 상품 수정
export const updateProduct = (id, formData) => {
  return axios.put(`/api/products/${id}`, formData, {
    withCredentials: true,
    // ✅ Content-Type 생략!
  });
};

// 상품 삭제
export const deleteProduct = (id) => {
  return axios.delete(`${API_URL}/products/${id}`, {
    withCredentials: true,
  });
};


// ----------------------------------------------------------------------------


// 파일 업로드
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true, // 세션 기반 인증 유지용
  });

  return res.data; // 업로드된 파일 경로 (/uploads/파일명)
};


// ----------------------------------------------------------------------------


export const fetchCart = () => {
  return axios.get(`${API_URL}/cart`, { withCredentials: true });
};

export const addToCart = (item) => {
  return axios.post(`${API_URL}/cart`, item, { withCredentials: true });
};

export const updateCartQuantity = (productId, quantity) => {
  return axios.put(`${API_URL}/cart/${productId}`, { quantity }, { withCredentials: true });
};

export const deleteCartItem = (productId) => {
  return axios.delete(`${API_URL}/cart/${productId}`, { withCredentials: true });
};

export const clearCart = () =>
  axios.delete(`${API_URL}/cart/clear`, { withCredentials: true });

// ----------------------------------------------------------------------------


export const prepareOrder = ({ items, name, phone, address }) =>
  axios.post(
    `${API_URL}/orders/prepare`,
    { items, name, phone, address },
    { withCredentials: true }
  );

export const confirmOrder = (paymentKey, orderId, amount, method) =>
  axios.post(
    `${API_URL}/orders/confirm`,
    { paymentKey, orderId, amount, method },
    { withCredentials: true }
  );


export const fetchOrderList = () =>
  axios.get(`${API_URL}/orders/list`, { withCredentials: true });

// 주문 상세 가져오기
export const fetchOrderDetail = (orderId) =>
  axios.get(`${API_URL}/orders/${orderId}`, { withCredentials: true });


// ----------------------------------------------------------------------------


export const fetchReviewsByProduct = (productId) =>
  axios.get(`${API_URL}/reviews/product/${productId}`, { withCredentials: true });

export const createReview = (productId, data) => {
  const formData = new FormData();

  const review = {
    userId: data.userId,
    rating: data.rating,
    content: data.content,
    imagePath: data.imagePath || "",
    orderId: data.orderId,
    username: data.username,
  };

  formData.append("review", JSON.stringify(review));
  if (data.image && typeof data.image !== "string") {
    formData.append("imageFile", data.image); // ✅ 백엔드 @RequestPart("imageFile")
  }

  return axios.post(`${API_URL}/reviews/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};

// 리뷰 수정 (POST 방식으로 보냄, FormData)
export const updateReview = (reviewId, data) => {
  const formData = new FormData();

  const review = {
    userId: data.userId,
    rating: data.rating,
    content: data.content,
    imagePath: data.imagePath || "",
    orderId: data.orderId,
    username: data.username,
  };

  formData.append("review", JSON.stringify(review));
  if (data.image && typeof data.image !== "string") {
    formData.append("imageFile", data.image);
  }

  return axios.put(`${API_URL}/reviews/update/${reviewId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    withCredentials: true,
  });
};


export const deleteReview = (id, userId) =>
  axios.delete(`${API_URL}/reviews/${id}?userId=${userId}`, {
    withCredentials: true,
  });

export const fetchReviewByOrderAndProduct = (orderId, productId, userId) =>
  axios.get(
    `${API_URL}/reviews/check?orderId=${orderId}&productId=${productId}&userId=${userId}`, // ✅ userId 꼭 포함
    { withCredentials: true }
  );

export const fetchMyReviews = (page = 0, size = 5) =>
  axios.get(`${API_URL}/reviews/my`, {
    params: { page, size },
    withCredentials: true
  });

export const upload = (formData) => {
  return axios.post(`${API_URL}/upload`, formData, {
    withCredentials: true,
  });
};



// 관리자용 --------------------------------------------------------------

// 🔹 관리자용 회원 목록 조회 (페이지네이션 포함)
export const fetchAdminUsers = (page = 0, size = 10) =>
  axios.get(`${API_URL}/admin/users?page=${page}&size=${size}`, { withCredentials: true });

// 🔹 관리자용 회원 삭제
export const deleteAdminUser = (userId) =>
  axios.delete(`${API_URL}/admin/users/${userId}`, { withCredentials: true });

// 🔹 관리자용 Q&A 목록 조회 (페이지네이션 포함)
export const fetchAdminQnas = (page = 0, size = 10) => {
  return axios.get(`${API_URL}/admin/qnas?page=${page}&size=${size}`, {
    withCredentials: true,
  });
};

export const fetchAdminProducts = (page = 0, size = 10) => {
  return axios.get(`${API_URL}/admin/products?page=${page}&size=${size}`, {
    withCredentials: true,
  });
};

export const fetchAdminDatarooms = (page = 0, size = 10) =>
  axios.get(`${API_URL}/datarooms?page=${page}&size=${size}`, {
    withCredentials: true,
});

// ✅ 관리자: 리뷰 목록 조회
export const fetchAdminReviews = (page = 0, size = 10) => {
  return axios.get(`${API_URL}/admin/reviews?page=${page}&size=${size}`, {
    withCredentials: true,
  });
};

// ✅ 관리자: 리뷰 삭제
export const deleteAdminReview = (reviewId) => {
  return axios.delete(`${API_URL}/admin/reviews/${reviewId}`, {
    withCredentials: true,
  });
};


// ----------------------------------------------------------------------------


// 채팅 전체 메시지 조회
export const fetchChats = () =>
  axios.get(`${API_URL}/chat`, { withCredentials: true });

// 새 메시지 전송
export const sendChat = (chatData) =>
  axios.post(`${API_URL}/chat`, chatData, { withCredentials: true });


// ----------------------------------------------------------------------------


// 자료실 목록 조회
export const fetchUserDatarooms = (page = 0, size = 10) =>
  axios.get(`${API_URL}/datarooms?page=${page}&size=${size}`, {
    withCredentials: true,
  });
  
// 자료실 상세 조회
export const fetchDataroomById = (id) =>
  axios.get(`${API_URL}/datarooms/${id}`, { withCredentials: true });

// 자료실 업로드
export const uploadDataroom = (formData) =>
  axios.post(`${API_URL}/datarooms`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });

// 자료실 파일 다운로드 URL 생성
export const getDownloadUrl = (id) =>
  `${API_URL}/datarooms/download/${id}`;

// 자료실 삭제
export const deleteDataroom = (id) =>
  axios.delete(`${API_URL}/datarooms/${id}`, { withCredentials: true });

// 자료실 수정
export const updateDataroom = (id, { title, content, file }) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (file) {
    formData.append("file", file);
  }

  return axios.put(`${API_URL}/datarooms/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// ----------------------------------------------------------------------------

// 🔹 1:1 채팅방 생성 (두 사용자 간 고유 채팅방)
export const createChattingRoom = (userId1, userId2) => {
  return axios.post(`${API_URL}/chatting/room`, null, {
    params: { userId1, userId2 },
    withCredentials: true,
  });
};

// 고객 ↔ 관리자 채팅방 생성
export const createCustomerChattingRoom = (userId) =>
  axios.post(`${API_URL}/chatting/room/customer`, null, {
    params: { userId },
    withCredentials: true,
  });

// 🔹 내가 속한 채팅방 목록 조회
export const fetchChattingRooms = (userId) => {
  return axios.get(`${API_URL}/chatting/rooms`, {
    params: { userId },
    withCredentials: true,
  });
};

// 🔹 특정 채팅방의 메시지 목록
export const fetchChattingMessages = (roomId) => {
  return axios.get(`${API_URL}/chatting/messages/${roomId}`, {
    withCredentials: true,
  });
};

// 🔹 메시지 전송
export const sendChattingMessage = (roomId, senderId, content) => {
  return axios.post(`${API_URL}/chatting/message`, null, {
    params: { roomId, senderId, content },
    withCredentials: true,
  });
};

export const deleteChattingRoom = (roomId) => {
  return axios.delete(`${API_URL}/chatting/admin/rooms/${roomId}`, {
    withCredentials: true,
  });
};

// 사용자가 채팅만 삭제
export const clearChattingMessages = (roomId) => {
  return axios.delete(`${API_URL}/chatting/messages/${roomId}/clear`, {
    withCredentials: true,
  });
};




// -------------------------------------------
export const fetchAdminSummary = () => {
  return axios.get("/api/admin/summary", { withCredentials: true });
};

// 🔹 관리자용 주문 상세 조회
export const fetchAdminOrderDetail = (id) =>
  axios.get(`${API_URL}/orders/admin/${id}`, {
    withCredentials: true,
  });