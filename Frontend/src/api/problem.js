import api from "@api/api";

// SubmissionController: POST /api/submissions (problemId는 바디에 포함, 경로가 아님)
export const submitSolution = (problemId, payload) =>
  api.post("/api/submissions", { problemId, ...payload });
// payload: { language: "JAVA", sourceCode: "..." }

// ExecutionController: POST /api/executions (예제 케이스 실행, problemId는 바디에 포함)
export const startExecution = (problemId, payload) =>
  api.post("/api/executions", { problemId, ...payload });
// payload: { language: "JAVA", sourceCode: "..." }
