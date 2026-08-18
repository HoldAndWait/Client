import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { startExecution, submitSolution } from "@api/problem";

import TopBar from "@components/ProblemSetup/TopBar";
import ProblemPane from "@components/ProblemSetup/ProblemPane";
import EditorPane from "@components/ProblemSetup/EditorPane";
import TestPane from "@components/ProblemSetup/TestPane";

import api from "@api/api";
import useJudgePolling from "@hooks/useJudgePolling";
import useProblem from "@hooks/useProblem";
import { buildCodeTemplates } from "@utils/codeTemplate";

export default function ProblemDetail() {
  const params = useParams();
  const problemId = Number(params.problemId);

  const { problem } = useProblem(problemId);

  // 문제마다 functionName/parameters/returnType이 달라서 문제 로드 후에만 만들 수 있음
  const codeTemplates = useMemo(() => buildCodeTemplates(problem), [problem]);

  // 사용자가 직접 고친 코드만 여기 저장하고, 안 고친 언어는 템플릿을 그대로 보여줌
  const [edits, setEdits] = useState({});
  const codes = useMemo(
    () => ({
      java: edits.java ?? codeTemplates?.java ?? "",
      python: edits.python ?? codeTemplates?.python ?? "",
      cpp: edits.cpp ?? codeTemplates?.cpp ?? "",
    }),
    [edits, codeTemplates],
  );

  const handleChangeLang = (newLang) => {
    setLanguage(newLang);
  };
  // 언어바뀌어도 저장
  const handleChangeCode = (newCode) => {
    setEdits((prev) => ({ ...prev, [language]: newCode }));
  };

  const [language, setLanguage] = useState("java");

  const [runId, setRunId] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  // 백엔드 Language enum(smu-core-api)은 JAVA/PYTHON/CPP만 지원함(JAVASCRIPT 없음)
  const languageForServer = useMemo(() => {
    const map = {
      java: "JAVA",
      python: "PYTHON",
      cpp: "CPP",
    };
    return map[language] ?? "JAVA";
  }, [language]);

  /** =========================
   *  Polling: Run (ExecutionController — GET /api/executions/{id})
   *  ExecutionStatus: RUNNING | DONE
   * ========================= */
  const runPolling = useJudgePolling({
    enabled: runId != null,
    queryKey: runId,
    fetch: async (id) => (await api.get(`/api/executions/${id}`)).data,
    isDone: (d) => d?.status === "DONE",
    intervalMs: 600,
    timeoutMs: 20_000,
  });

  /** =========================
   *  Polling: Submit (SubmissionController — GET /api/submissions/{id})
   *  SubmissionStatus: PENDING | DONE
   * ========================= */
  const submitPolling = useJudgePolling({
    enabled: submissionId != null,
    queryKey: submissionId,
    fetch: async (id) => (await api.get(`/api/submissions/${id}`)).data,
    isDone: (d) => d?.status === "DONE",
    intervalMs: 900,
    timeoutMs: 60_000,
  });

  const isBusy = runPolling.isPolling || submitPolling.isPolling;

  /** =========================
   *  Actions
   * ========================= */
  const onClickRun = async () => {
    if (isBusy || !problem) return;
    setSubmissionId(null);
    setRunId(null);

    try {
      const res = await startExecution(problemId, {
        language: languageForServer,
        sourceCode: codes[language],
      });
      const nextRunId = res?.data?.executionId;
      if (nextRunId == null) throw new Error("executionId가 응답에 없습니다.");
      setRunId(nextRunId);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 401) alert("로그인이 필요합니다. (dev-login 후 다시 시도)");
      else alert(`실행 요청에 실패했습니다${msg ? `: ${msg}` : ""}`);
      console.error(err);
    }
  };

  const onClickSubmit = async () => {
    if (isBusy || !problem) return;

    // 이전 결과 초기화(선택)
    setRunId(null);
    setSubmissionId(null);

    try {
      const res = await submitSolution(problemId, {
        language: languageForServer, // 서버 enum으로
        sourceCode: codes[language],
      });

      const nextSubmissionId = res?.data?.submissionId;
      alert(`제출 접수 완료! submissionId=${nextSubmissionId}`);

      // "제출만 되게"라면 저장만 해두고 polling은 당장 안 돌려도 됨
      setSubmissionId(nextSubmissionId);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 401) alert("로그인이 필요합니다. (dev-login 후 다시 시도)");
      else alert(`제출 실패${msg ? `: ${msg}` : ""}`);
      console.error(err);
    }
  };

  /** =========================
   *  View model for TestPane
   * ========================= */
  const judgeView = useMemo(() => {
    // submit이 한번이라도 시작되면 submit 결과를 우선 보여주는 UX
    if (submitPolling.isPolling || submissionId != null) {
      return { type: "SUBMIT", ...submitPolling };
    }
    return { type: "RUN", ...runPolling };
  }, [runPolling, submitPolling, submissionId]);

  const busyLabel = submitPolling.isPolling
    ? "제출 채점 중..."
    : runPolling.isPolling
      ? "실행 중..."
      : "";

  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar
        onRun={onClickRun}
        onSubmit={onClickSubmit}
        isBusy={isBusy}
        busyLabel={busyLabel}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[40%] min-w-[320px] border-r overflow-hidden">
          <ProblemPane problemId={problemId} />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 border-b overflow-hidden">
            <EditorPane
              lang={language}
              onChangeLang={handleChangeLang}
              code={codes[language]}
              onChangeCode={handleChangeCode}
            />
          </div>

          <div className="h-[50%] min-h-[220px] overflow-hidden">
            <TestPane judgeView={judgeView} />
          </div>
        </div>
      </div>
    </div>
  );
}
