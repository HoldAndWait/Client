export default function ProblemStatement() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-xl font-bold tracking-tight text-smu-black">
            <span className="text-smu-gray font-semibold">#1330</span>{" "}
            두 수 비교하기
          </h1>

          {/* 상태/난이도 뱃지 자리 */}
          {/* <span className="shrink-0 rounded-full border border-smu-gray/30 bg-smu-base px-2 py-1 text-xs text-smu-navy">
            Bronze
          </span> */}
        </div>

        {/* meta badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <MetaPill label="시간 제한" value="1초" />
          <MetaPill label="메모리 제한" value="128MB" />
          <MetaPill label="정답률" value="32.49%" />
        </div>
      </header>

      <Divider />

      <Section title="문제 설명">
        <p className="text-sm leading-6 text-smu-black">
          두 정수 A와 B가 주어졌을 때, A와 B를 비교하는 프로그램을 작성하시오.
        </p>
      </Section>

      <Section title="제한 사항">
        <ul className="list-disc pl-5 text-sm leading-6 text-smu-black">
          <li>A, B &lt; 10,000</li>
        </ul>
      </Section>

      <Section title="예제">
        <div className="space-y-3">
          <ExampleCard title="테스트 케이스 1" input="A = 1, B = 2" output='"<"' />
          <ExampleCard title="테스트 케이스 2" input="A = 2, B = 1" output='">"' />
          <ExampleCard title="테스트 케이스 3" input="A = 1, B = 1" output='"=="' />
        </div>
      </Section>

      <footer className="pt-1 text-xs text-smu-gray">
        출제자: <span className="text-smu-navy">FickleBoBo</span>
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
        <Row label="Input" value={input} />
        <Row label="Output" value={output} />
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