import { useState, useEffect } from "react";
import { upload } from "../api"; // ✅ 이미지 업로드 API import

function ReviewForm({
  initialValue,
  onSubmit,
  onCancel,
  editing = false,
  userId,
  username,
}) {
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [imagePath, setImagePath] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editing && initialValue) {
      setContent(initialValue.content);
      setRating(initialValue.rating);
      if (initialValue.imagePath) {
        setPreview(initialValue.imagePath);
        setImagePath(initialValue.imagePath);
      }
    }
  }, [editing, initialValue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("내용을 입력하세요");
    if (!rating) return alert("별점을 입력하세요");

    try {
      await onSubmit({ userId, username, content, rating, image: imageFile });
      setContent("");
      setRating(5);
    } catch (err) {
      console.error("리뷰 처리 실패", err);
      alert("리뷰 처리 중 오류가 발생했습니다.");
    }
  };

  const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setImageFile(file);
  setPreview(file); // 미리보기
};

  return (
    <div style={{ paddingBottom: 100 }}>
      <form onSubmit={handleSubmit}>
        <table className="table table-bordered align-middle">
          <tbody>
            <tr>
              <th style={{ width: "20%" }}>별점</th>
              <td>
                <select
                  className="form-select"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ borderRadius: 0 }}
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r}점
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th>이미지</th>
              <td>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                  style={{ borderRadius: 0 }}
                />
                {preview && (
                  <div className="mt-2">
                    <img
                      src={
                        typeof preview === "string"
                          ? preview
                          : URL.createObjectURL(preview)
                      }
                      alt="미리보기"
                      style={{
                        maxWidth: 200,
                        maxHeight: 200,
                        borderRadius: 10,
                      }}
                    />
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <th>내용</th>
              <td>
                <textarea
                  className="form-control"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="리뷰 내용을 입력하세요"
                  rows="5"
                  style={{ borderRadius: 0 }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="text-center">
          <button
            style={{ width: 200, borderRadius: 0 }}
            className="btn btn-dark"
            type="submit"
          >
            {editing ? "수정" : "작성"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
