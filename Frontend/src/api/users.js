import api from "@api/api";

export const getMyUser = () => api.get("/api/users/me");
export const getUserById = (userId) => api.get(`/api/users/${userId}`);

export const putEmail = (email) => api.put("/api/users/me/email", { email });
export const deleteEmail = () => api.delete("/api/users/me/email");

export const putNickname = (nickname) => api.put("/api/users/me/nickname", { nickname });
export const checkNicknameAvailability = (nickname) =>
  api.get("/api/users/nickname/availability", { params: { nickname } });

export const putGithubUrl = (githubUrl) => api.put("/api/users/me/github-url", { githubUrl });
export const deleteGithubUrl = () => api.delete("/api/users/me/github-url");

export const putTechblogUrl = (techblogUrl) => api.put("/api/users/me/techblog-url", { techblogUrl });
export const deleteTechblogUrl = () => api.delete("/api/users/me/techblog-url");