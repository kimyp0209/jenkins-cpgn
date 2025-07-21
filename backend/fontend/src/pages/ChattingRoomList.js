import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { deleteChattingRoom } from "../api";

function ChattingRoomList({ userId }) {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchRooms = async () => {
    try {
      const res = await axios.get(`/api/chatting/admin/rooms?page=${page}&size=10`, {
        withCredentials: true,
      });

      console.log("📦 채팅방 응답:", res.data);
      setRooms(Array.isArray(res.data.content) ? res.data.content : []);
      setTotalPages(res.data.page?.totalPages || 0);

    } catch (error) {
      console.error("❌ 채팅방 목록 로딩 실패", error);
      alert("채팅 목록 불러오기 실패");
    }
  };

  const handleDeleteRoom = async (roomId) => {
  if (!window.confirm("정말 이 채팅방을 삭제하시겠습니까?")) return;

  try {
    await deleteChattingRoom(roomId);
    alert("채팅방이 삭제되었습니다.");
    fetchRooms(); // 삭제 후 새로고침
  } catch (error) {
    console.error("❌ 채팅방 삭제 실패", error);
    alert("채팅방 삭제 실패");
  }
};

  useEffect(() => {
    fetchRooms();
  }, [page]);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <h2 className="" style={{ fontWeight: "bold" }}>채팅 목록</h2>
      <div className="table-responsive">
      <table className="table table-hover table-bordered text-center">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>생성일</th>
            <th>상대방 아이디</th>
            <th>채팅방</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            const partner = Number(room.user1.id) === Number(userId) ? room.user2 : room.user1;

            return (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{formatDateTime(room.createdAt)}</td>
                <td>{partner?.username || "알 수 없음"}</td>
                <td>
                  <Link to={`/admin/chatting/${room.id}`} className="btn btn-sm btn-outline-primary" style={{ borderRadius: 0 }}>
                    입장
                  </Link>
                  <button
    className="btn btn-sm btn-outline-danger"
    style={{ borderRadius: 0, marginLeft:5 }}
    onClick={() => handleDeleteRoom(room.id)}
  >
    삭제
  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
      {/* 페이지네이션 */}
      <nav className="d-flex justify-content-center mt-4">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${i === page ? "active" : ""}`}>
              <button className="page-link" onClick={() => setPage(i)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default ChattingRoomList;
