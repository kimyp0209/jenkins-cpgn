import React, { useEffect, useState } from "react";
import { getNotices } from "../api";
import { useNavigate } from "react-router-dom";

export default function NoticeList() {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchNotices(page);
  }, [page]);

  const fetchNotices = (currentPage) => {
    getNotices(currentPage, 10).then((res) => {
      const content = Array.isArray(res.data?.content) ? res.data.content : [];
      const total = res.data?.page?.totalPages ?? 0;
      setNotices(content);
      setTotalPages(total);
    });
  };

  const noticesToDisplay = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom: 100 }}>
      <div style={{borderBottom:'1px solid #000'}}>
        <h2
          style={{
            fontWeight: "bold",
            padding: "15px 0",
            margin: 0,
            width: "100%",
            textAlign: "center",
          }}
        >
          NOTICE
        </h2>
        <div className="d-flex justify-content-end" style={{}}>
          <input
            type="text"
            className="form-control"
            placeholder="검색어를 입력하세요"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: 200, marginBottom:10, border:0, borderBottom:'2px solid #000', borderRadius:0 }}
          />
        </div>
      </div>
      <ul className="list-group" style={{ width: "100%" }}>
  {noticesToDisplay.length === 0 ? (
    <li className="pt-2 text-center" style={{fontSize:14}}>
      공지사항이 없습니다.
    </li>
  ) : (
    noticesToDisplay.map((notice) => (
      <li
        key={notice.id}
        style={{
          width: "100%",
          borderBottom: "1px solid #DEDEDE",
          cursor: "pointer",
          padding: "20px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        onClick={() => navigate(`/notices/${notice.id}`)}
      >
        <span style={{ fontSize: 14, width: "10%", textAlign: "center" }}>
          {notice.id}
        </span>
        <span
          className="notice-title"
          style={{ fontSize: 14, width: "80%", color: "#000" }}
        >
          {notice.title}
        </span>
        <span className="text-muted small" style={{ textAlign: "right" }}>
          {notice.createdAt?.slice(0, 10)}
        </span>
      </li>
    ))
  )}
</ul>

      {/* 페이지네이션 */}
      <nav className="d-flex justify-content-center mt-3">
        <ul className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <li
              key={i}
              className={`page-item ${page === i ? "active" : ""}`}
            >
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
