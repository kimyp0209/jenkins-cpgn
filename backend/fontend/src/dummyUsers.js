import axios from "axios";

// IP 하드코딩 제거, 내포 구조 대응
const BASE_URL = "/api";

const users = Array.from({ length: 50 }, (_, i) => ({
  username: `dummy${i + 1}`,
  password: `pass${i + 1}`,
  email: `dummy${i + 1}@example.com`,
}));

const registerUser = async (user) => {
  try {
    const res = await axios.post(`${BASE_URL}/users/register`, user); // /api 포함됨
    console.log(`✅ 등록 완료: ${user.username}`);
  } catch (err) {
    console.error(`❌ 실패: ${user.username}`, err.response?.data || err.message);
  }
};

const registerAll = async () => {
  for (const user of users) {
    await registerUser(user);
  }
};

registerAll();
