// UserList.js
import { useEffect, useState } from 'react';
import axios from 'axios';

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('/api/users')
      .then(res => setUsers(res.data))
      .catch(err => alert("회원 목록 불러오기 실패"));
  }, []);

  return (
    <div>
      <h2>회원 목록</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.username} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
}

export default UserList;
