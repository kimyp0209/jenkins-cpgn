import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminReviewAudioGenerator({ productId, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  useEffect(() => {
    axios.get(`/api/reviews/${productId}/audio-summary`)
      .then(res => {
        setAudioUrl(res.data.audioUrl);
        if (res.data.summary) setSummary(res.data.summary);
      })
      .catch(() => {
        setAudioUrl(null);
        setSummary('');
      });
  }, [productId]);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setSummary(""); // 이전 내용 초기화

      const res = await fetch(`/api/reviews/audio-summary/${productId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "오디오 요약 생성 실패");
      }

      const data = await res.json();
      setSummary(data.summary);
      setAudioUrl(data.audioUrl);
      onComplete?.(); // 콜백 있으면 실행
    } catch (err) {
      console.error("요약 오류:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        style={{ fontSize: 14, borderRadius: 0, padding: '4px 8px' }}
        className="btn btn-outline-success"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? "생성 중..." : "생성"}
      </button>

      {summary && (
        <p style={{ fontSize: 14, marginTop: 8 }}><strong>요약문:</strong> {summary}</p>
      )}

      {audioUrl ? (
        <div>
          <label style={{ fontSize: 14 }} className="me-2">🎧 미리듣기</label>
          <audio controls src={audioUrl} style={{ display: "block", marginTop: 5, height: 20, width: 200 }} />
        </div>
      ) : (
        !loading && (
          <div className="text-muted mt-2" style={{ fontSize: 13 }}>
            아직 생성된 음성이 없습니다.
          </div>
        )
      )}
    </div>
  );
}
