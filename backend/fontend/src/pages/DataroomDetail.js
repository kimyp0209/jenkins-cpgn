import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchDataroomById, getDownloadUrl, deleteDataroom } from "../api";

function DataroomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDataroomById(id).then(res => setData(res.data));
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deleteDataroom(id);
      alert("삭제 완료");
      navigate("/datarooms");
    }
  };

  if (!data) return <div>📄 로딩 중...</div>;

  return (
    <div>
      <h2>{data.title}</h2>
      <p>등록일: {new Date(data.createdAt).toLocaleString()}</p>
      <p>{data.content}</p>

      {data.filename && (
        <p>
          첨부파일:{" "}
          <a href={getDownloadUrl(data.id)} download>
            📎 {data.filename}
          </a>
        </p>
      )}

      <div style={{ marginTop: "1rem" }}>
        <Link to={`/datarooms/${data.id}/edit`} className="btn btn-warning" style={{ marginRight: "10px" }}>
          수정
        </Link>
        <button onClick={handleDelete} className="btn btn-danger">
          삭제
        </button>
      </div>
    </div>
  );
}

export default DataroomDetail;
