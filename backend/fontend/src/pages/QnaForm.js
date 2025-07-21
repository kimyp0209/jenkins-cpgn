import { useState, useEffect } from "react";
import { submitQuestion } from "../api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function QnaForm({ onComplete }) {
  const [form, setForm] = useState({ questionTitle: "", questionContent: "" });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/users/me", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => alert("로그인이 필요합니다"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitQuestion(form);
    alert("질문이 등록되었습니다");
    if (onComplete) onComplete(); // ✅ 등록 후 목록으로 전환
  };

  return (
    <div style={{paddingBottom:50}}>
      <form onSubmit={handleSubmit}>
        <table style={{fontSize:14, marginTop:30}} className="table table-bordered">
          <tbody>
            <tr>
              <td
                style={{
                  width: "10%",
                  textAlign: "center",
                  borderLeft: 0,
                  borderRight: 0,
                  verticalAlign: "middle",
                  height:60,
                }}
              >
                작성자
              </td>
              <td style={{ border: 0, verticalAlign: "middle", }}>{user?.username || "로그인 필요"}</td>
              {/* user 상태에 따라 표시 */}
            </tr>
            
            <tr>
              <td
                style={{
                  width: "10%",
                  textAlign: "center",
                  borderLeft: 0,
                  borderRight: 0,
                  verticalAlign: "middle",
                }}
              >
                문의
              </td>
              <td style={{ border: 0, padding:'20px 0' }}>
                <input
                  type="text"
                  className="form-control"
                  value={form.questionTitle}
                  onChange={(e) =>
                    setForm({ ...form, questionTitle: e.target.value })
                  }
                  placeholder="제목을 입력하세요"
                  style={{ borderRadius: 0, marginBottom:10 }}
                />
                <textarea
                  className="form-control"
                  rows="5"
                  value={form.questionContent}
                  onChange={(e) =>
                    setForm({ ...form, questionContent: e.target.value })
                  }
                  placeholder="내용을 입력하세요"
                  style={{ borderRadius: 0 }}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center">
          <button
            style={{ borderRadius: 0, padding: "10px 100px", marginTop:20 }}
            type="submit"
            className="btn btn-dark"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
}
