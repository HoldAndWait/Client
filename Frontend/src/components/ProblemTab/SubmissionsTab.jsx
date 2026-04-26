export default function SubmissionsTab() {
  const rows = [
    { id: 1, lang: "Java 11", result: "맞았습니다", time: "24ms", mem: "12MB" },
    { id: 2, lang: "Python 3", result: "틀렸습니다", time: "-", mem: "-" },
  ];

  return (
    <div className="space-y-3">
      <div className="font-semibold">제출 내역</div>

      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-4 text-xs bg-gray-50 border-b px-3 py-2">
          <div>언어</div>
          <div>결과</div>
          <div>시간</div>
          <div>메모리</div>
        </div>

        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-4 text-sm px-3 py-2 border-b last:border-b-0">
            <div>{r.lang}</div>
            <div>{r.result}</div>
            <div>{r.time}</div>
            <div>{r.mem}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
