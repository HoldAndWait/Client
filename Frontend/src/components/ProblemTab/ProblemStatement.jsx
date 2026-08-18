import { useEffect, useState } from "react";
import api from "@api/api";

function formatTimeLimit(millis) {
  if (millis == null) return "-";
  return millis % 1000 === 0 ? `${millis / 1000}초` : `${millis}ms`;
}

function formatMemoryLimit(kilobytes) {
  if (kilobytes == null) return "-";
  return `${Math.round(kilobytes / 1024)}MB`;
}

export default function ProblemStatement({ problemId }) {
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

  if (loading) {
    return <div className="py-10 text-center text-smu-gray">불러오는 중...</div>;
  }

  if (errorMsg || !problem) {
    return (
      <div className="py-10 text-center text-red-500 font-semibold">
        {errorMsg || "문제를 찾을 수 없습니다."}
      </div>
    );
  }

  const constraintLines = (problem.constraints || "")
    .split("\n")
    .filter((line) => line.trim().length > 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-smu-black">
            <span className="text-smu-gray font-semibold">#{problem.id}</span>{" "}
            {problem.title}
          </h1>
        </div>

        {/* meta badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <MetaPill label="난이도" value={`Lv.${problem.difficulty}`} />
          <MetaPill label="시간 제한" value={formatTimeLimit(problem.timeLimitMillis)} />
          <MetaPill label="메모리 제한" value={formatMemoryLimit(problem.memoryLimitKilobytes)} />
          <MetaPill label="맞힌 사람" value={`${problem.solvedUserCount}명`} />
        </div>
      </header>

      <Divider />

      <Section title="문제 설명">
        <p className="text-sm leading-6 text-smu-black whitespace-pre-wrap">
          {problem.description}
        </p>
      </Section>

      {constraintLines.length > 0 && (
        <Section title="제한 사항">
          <ul className="list-disc pl-5 text-sm leading-6 text-smu-black">
            {constraintLines.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        </Section>
      )}

      {problem.sampleCases?.length > 0 && (
        <Section title="예제">
          <div className="space-y-3">
            {problem.sampleCases.map((sc, idx) => (
              <ExampleCard
                key={sc.orderIndex ?? idx}
                title={`테스트 케이스 ${idx + 1}`}
                input={sc.arguments}
                output={sc.expectedOutput}
              />
            ))}
          </div>
        </Section>
      )}

      <footer className="pt-1 text-xs text-smu-gray">
        출제자: <span className="text-smu-navy">{problem.author?.nickname}</span>
      </footer>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full bg-smu-gray/20" />;
}

function MetaPill({ label, value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-smu-gray/25 bg-smu-base px-2 py-1 text-smu-navy">
      <span className="text-smu-gray">{label}</span>
      <span className="font-semibold text-smu-black">{value}</span>
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        {/* SolveMeUp accent bar */}
        <span className="inline-block h-4 w-1.5 rounded-full bg-smu-neonlime" />
        <h2 className="text-sm font-semibold text-smu-navy">{title}</h2>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-smu-gray/20 bg-white p-4">
        {children}
      </div>
    </section>
  );
}

function ExampleCard({ title, input, output }) {
  return (
    <div className="rounded-xl border border-smu-gray/20 bg-smu-base p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-smu-black">{title}</div>

        <span className="rounded-full border border-smu-gray/25 bg-white px-2 py-0.5 text-[11px] text-smu-gray">
          Example
        </span>
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <Row label="Input" value={input || "-"} />
        <Row label="Output" value={output || "-"} />
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-12 shrink-0 text-xs font-medium text-smu-gray">
        {label}
      </span>
      <code className="rounded-md border border-smu-gray/25 bg-white px-2 py-1 text-xs text-smu-black">
        {value}
      </code>
    </div>
  );
}
