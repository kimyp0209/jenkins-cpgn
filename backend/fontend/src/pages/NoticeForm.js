import React, { useEffect, useState } from 'react';
import { createNotice, updateNotice, getNoticeById } from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function NoticeForm() {
  const [form, setForm] = useState({ title: '', content: '' });
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  

  useEffect(() => {
    if (isEdit) {
      getNoticeById(id).then(res => setForm(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isEdit) {
      // 수정: 전체 form 전송
      await updateNotice(id, form);
    } else {
      // 등록: title, content만 전송
      const { title, content } = form;
      await createNotice({ title, content });
    }
    navigate(`/notices`);
  } catch (err) {
    console.error("📛 공지 등록/수정 실패:", err.response?.data || err.message);
    alert("공지 저장 중 오류가 발생했습니다.");
  }
};


  return (
    <div className="container" style={{paddingTop:150, paddingBottom:100}}>
      <h2 style={{textAlign:'center', fontWeight:'bold', marginBottom:50}}>{isEdit ? '공지 수정' : '공지 등록'}</h2>
      <form onSubmit={handleSubmit}>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th style={{ width: "15%" }}>제목</th>
              <td>
                <input
                  className="form-control"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
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
                  rows="10"
                  value={form.content}
                  onChange={e => setForm({ ...form, content: e.target.value })}
                  required
                  style={{borderRadius:0}}
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
        <div className="text-center">
          <button type="submit" className="btn btn-dark" style={{width:200, borderRadius:0}}> 
            {isEdit ? '수정 완료' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
