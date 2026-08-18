import { useEffect, useState } from "react";
import api from "@api/api";

export default function useProblem(problemId) {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!problemId) return;
    const controller = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        const res = await api.get(`/api/problems/${problemId}`, {
          signal: controller.signal,
        });
        setProblem(res.data);
      } catch (e) {
        if (e?.name === "CanceledError" || controller.signal.aborted) return;
        setErrorMsg("문제를 불러오지 못했습니다.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [problemId]);

  return { problem, loading, errorMsg };
}
