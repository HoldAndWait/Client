import axios from "axios";

const api = axios.create({
  //baseURL: import.meta.env.VITE_API_URL,
  baseURL: "", // 호출이 전부 “지금 접속한 프론트 도메인” 기준
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
