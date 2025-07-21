import React, { useEffect, useState } from 'react';
import { fetchAdminUsers, deleteAdminUser } from "../api";

export default function AdminUserList() {
  const [users, setUsers] = useState([]); // ✅ 초기값은 빈 배열
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchUsers = () => {
  fetchAdminUsers(page, 10)
    .then(res => {
      console.log("✅ 관리자 사용자 응답:", res.data); // 👈 여기 확인
      const content = Array.isArray(res.data.content) ? res.data.content : [];
      const total = res.data?.page?.totalPages ?? 1;

      setUsers(content);
      setTotalPages(total);
    })
    .catch(() => alert("회원 목록 불러오기 실패"));
};

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteAdminUser(id);
      alert("삭제 완료");
      fetchUsers(); // ✅ 삭제 후 갱신
    } catch {
      alert("삭제 실패");
    }
  };

  return (
    <div className="container none" style={{paddingBottom:100}}>
      <h2 className="" style={{ fontWeight: 'bold' }}>회원 관리</h2>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-dark">
            <tr style={{whiteSpace: "nowrap"}}>
              <th>#</th>
              <th>이름</th>
              <th>이메일</th>
              <th>역할</th>
              <th>가입일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(users) && users.length > 0 ? (
              users.map(u => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td style={{whiteSpace: 'normal'}}>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.createdAt ? u.createdAt.split("T")[0].replace(/-/g, ".") + "." : "N/A"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(u.id)}
                      style={{ borderRadius: 0, whiteSpace: "nowrap"}}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">회원이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* 페이지네이션 */}
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
