// src/api/submissions.js
import api from "@api/api";

export const submitSolution = (problemId, payload) =>
  api.post(`/api/problems/${problemId}/submissions`, payload);
// payload: { language: "JAVA", sourceCode: "..." }