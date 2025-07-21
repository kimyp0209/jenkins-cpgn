import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchDataroomById } from "../api";
import axios from "axios";

function DataroomForm({ mode = "create" }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (mode === "edit" && id) {
      fetchDataroomById(id).then((res) => {
        setTitle(res.data.title);
        setContent(res.data.content);
      });
    }
  }, [mode, id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);
  if (file) formData.append("file", file);

  try {
    if (mode === "edit" && id) {
      await axios.put(`/api/datarooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("수정 완료");
      navigate("/datarooms");
    } else {
      await axios.post(`/api/datarooms`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("등록 완료");
      navigate("/datarooms");
    }
  } catch (err) {
    console.error(err);
    alert("자료를 등록해 주세요");
  }
};

  return (
    <div className="container" style={{ paddingTop: 150, paddingBottom:100 }}>
      <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 50 }}>
        {mode === "edit" ? "자료 수정" : "자료 등록"}
      </h2>
      <form onSubmit={handleSubmit}>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th style={{ width: "20%" }}>제목</th>
              <td>
                <input
                  type="text"
                  className="form-control"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <textarea
                  className="form-control"
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
            <tr>
              <th>첨부파일</th>
              <td>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="*"
                  style={{borderRadius:0}}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center mt-4">
          <button style={{ width: 200, borderRadius: 0 }} type="submit" className="btn btn-dark">
            {mode === "edit" ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default DataroomForm;
