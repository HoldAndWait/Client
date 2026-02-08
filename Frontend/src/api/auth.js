import api from "@api/api";
export const getAuthMe = () => api.get("/api/auth/me");
export const logout = () => api.post("/api/auth/logout");