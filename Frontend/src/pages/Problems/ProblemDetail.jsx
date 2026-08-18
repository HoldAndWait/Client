import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { submitSolution } from "@api/problem"; 

import TopBar from "@components/ProblemSetup/TopBar";
import ProblemPane from "@components/ProblemSetup/ProblemPane";
import EditorPane from "@components/ProblemSetup/EditorPane";
import TestPane from "@components/ProblemSetup/TestPane";

import api from "@api/api";
// 여기 지워야 함
import { fakeRunStart, fakeRunStatus } from "@api/fakeJudge";
import useJudgePolling from "@hooks/useJudgePolling";

export default function ProblemDetail() {
  const params = useParams();
  const problemId = Number(params.problemId);

  // EditorPane와 맞춰서: language는 "java/python/javascript" 같은 값 권장
  // ("JAVA"로 잡아놨는데 EditorPane select 값이 "java"라면 mismatch 날 수 있음)
  const CODE_TEMPLATES = {
    java: `class Solution {
    public String solution(int A, int B) {
      return "";
    }
  }`,
    python: `def solution(A, B):
      return ""`,
    javascript: `function solution(A, B) {
    return "";
  }`,
  };

  const [codes, setCodes] = useState({ ...CODE_TEMPLATES });
  const handleChangeLang = (newLang) => {
    setLanguage(newLang);
  };
// 언어바뀌어도 저장
  const handleChangeCode = (newCode) => {
    setCodes((prev) => ({ ...prev, [language]: newCode }));
  };

  const [language, setLanguage] = useState("java");

  const [runId, setRunId] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);

  // 백엔드 enum이 JAVA/PYTHON/JAVASCRIPT면 여기서 매핑해서 보냄
  const languageForServer = useMemo(() => {
    const map = {
      java: "JAVA",
      python: "PYTHON",
      javascript: "JAVASCRIPT",
    };
    return map[language] ?? "JAVA";
  }, [language]);

  /** =========================
   *  Polling: Run
   * ========================= */
  const runPolling = useJudgePolling({
    enabled: runId != null,
    queryKey: runId,
    // 여기 살려! 이건 fakeJudge
    fetch: async () => await fakeRunStatus(),

    // fetch: async (id) => (await api.get(`/api/judge/run/${id}`)).data,
    // 백엔드가 status를 안 쓰면: result나 list 존재 여부로 바꿔도 됨
    isDone: (d) => d?.status === "DONE" || d?.status === "ERROR",
    intervalMs: 600,
    timeoutMs: 20_000,
  });

  /** =========================
   *  Polling: Submit
   * ========================= */
  const submitPolling = useJudgePolling({
    //enabled: submissionId != null,
    enabled: false, // 지금은 제출만
    queryKey: submissionId,
    fetch: async (id) => (await api.get(`/api/submissions/${id}`)).data,
    isDone: (d) => d?.status === "DONE" || d?.status === "ERROR",
    intervalMs: 900,
    timeoutMs: 60_000,
  });

  const isBusy = runPolling.isPolling || submitPolling.isPolling;

  /** =========================
   *  Actions
   * ========================= */
  // const onClickRun = async () => {
  //   if (isBusy) return;

  //   // 이전 결과 초기화
  //   setSubmissionId(null);
  //   setRunId(null);

  //   try {
  //     const res = await api.post("/api/judge/run", {
  //       problemId,
  //       language: languageForServer,
  //       sourceCode,
  //       // list: ... (예제/커스텀 테케 있으면 여기)
  //     });

  //     // 백엔드가 runId 대신 judgeId를 줄 수도 있어서 방어적으로
  //     const nextRunId = res?.data?.runId ?? res?.data?.judgeId;
  //     if (nextRunId == null) throw new Error("runId가 응답에 없습니다.");
  //     setRunId(nextRunId);
  //   } catch (e) {
  //     console.error(e);
  //     alert("실행 요청에 실패했습니다.");
  //   }
  // };
  //fakeJudge용
  const onClickRun = async () => {
    if (isBusy) return;
    setSubmissionId(null);
    setRunId(null);

    const res = await fakeRunStart({sourceCode : codes[language]});
    setRunId(res.runId);
  };


  const onClickSubmit = async () => {
    if (isBusy) return;

    // 이전 결과 초기화(선택)
    setRunId(null);
    setSubmissionId(null);

    try {
      const res = await submitSolution(problemId, {
        language: languageForServer, // 서버 enum으로
        sourceCode : codes[language],
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
