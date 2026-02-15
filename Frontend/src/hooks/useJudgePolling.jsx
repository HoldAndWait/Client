import { useEffect, useRef, useState } from "react";
import { poll } from "@utils/polling";

export default function useJudgePolling({
  enabled,
  queryKey,
  fetch,
  isDone,
  intervalMs,
  timeoutMs,
}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [isPolling, setIsPolling] = useState(false);

  const runningRef = useRef(false);

  useEffect(() => {
    if (!enabled || queryKey == null) return;
    if (runningRef.current) return;

    runningRef.current = true;
    setIsPolling(true);
    setError("");

    poll(() => fetch(queryKey), {
      intervalMs: intervalMs ?? 800,
      timeoutMs: timeoutMs ?? 30000,
      shouldStop: (d) => isDone(d),
      onTick: (d) => setData(d),
    })
      .then((finalData) => setData(finalData))
      .catch((e) => setError(e?.message ?? "Polling failed"))
      .finally(() => {
        runningRef.current = false;
        setIsPolling(false);
      });
  }, [enabled, queryKey]);

  return { data, error, isPolling };
}
