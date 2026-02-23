// import { useState } from "react";

// const cases = [
//   { id: 1, A: 1, B: 2 },
//   { id: 2, A: 2, B: 1 },
//   { id: 3, A: 1, B: 1 },
// ];

// export default function TestPane() {
//   const [active, setActive] = useState(1);

//   const cur = cases.find((c) => c.id === active);

//   return (
//     <div className="h-full flex flex-col">
//       {/* header */}
//       <div className="h-[44px] px-3 flex items-center justify-between border-b bg-white">
//         <div className="text-sm font-medium">테스트</div>
//         <button className="px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
//           채점
//         </button>
//       </div>

//       {/* tab bar */}
//       <div className="flex border-b bg-white">
//         {cases.map((c) => (
//           <button
//             key={c.id}
//             onClick={() => setActive(c.id)}
//             className={[
//               "px-3 py-2 text-sm",
//               active === c.id ? "border-b-2 border-black font-semibold" : "text-gray-500 hover:text-black",
//             ].join(" ")}
//           >
//             케이스 {c.id}
//           </button>
//         ))}
//       </div>

//       {/* content */}
//       <div className="flex-1 overflow-y-auto p-3 space-y-3">
//         <div className="border rounded p-3">
//           <div className="text-xs text-gray-500 mb-2">입력</div>
//           <div className="text-sm">A = {cur.A}</div>
//           <div className="text-sm">B = {cur.B}</div>
//         </div>

//         <div className="border rounded p-3">
//           <div className="text-xs text-gray-500 mb-2">결과</div>
//           <div className="text-sm text-gray-600">아직 실행 전입니다.</div>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function TestPane({ judgeView }) {
  const { type, data, error, isPolling } = judgeView || {};
  const title = type === "SUBMIT" ? "제출 결과" : "실행 결과";

  return (
    <div className="w-full h-full p-3">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block h-4 w-1.5 rounded-full bg-smu-neonlime" />
          <div className="font-bold text-smu-black">{title}</div>

          <span className="text-xs text-smu-gray">
            {type === "SUBMIT" ? "Submit" : "Run"}
          </span>
        </div>

        {isPolling && (
          <span className="inline-flex items-center gap-2 rounded-full border border-smu-gray/25 bg-smu-base px-2 py-1 text-xs text-smu-navy">
            <span className="inline-block h-2 w-2 rounded-full bg-smu-neonlime" />
            채점 중...
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Result box (height 유지) */}
      <div className="mt-2 h-[calc(100%-32px)] overflow-auto rounded-xl border border-smu-gray/20 bg-white p-3 text-sm">
        {data ? (
          <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-5 text-smu-black">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-sm text-smu-gray">
              결과가 여기에 표시됩니다.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}