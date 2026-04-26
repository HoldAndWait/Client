// import React from "react";
// import { Link } from "react-router-dom";

// const mockProblems = [
//   {
//     id: 1,
//     title: "두 수 비교하기",
//     difficulty: 2,
//     solved: false,
//     bookmarked: true,
//     acceptedCount: 767,
//     acceptanceRate: 32.49,
//   },
// ];


// const ProblemList = () => {
//   return (
//     <div className="bg-smu-base min-h-screen px-10 py-10">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-2xl font-black text-smu-navy mb-6">문제 리스트</h1>

//         <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
//           <table className="w-full text-left">
//             <thead className="bg-gray-100 text-smu-black">
//               <tr>
//                 <th className="px-4 py-3 w-24 text-center">번호</th>
//                 <th className="px-4 py-3 w-28 text-center">난이도</th>
//                 <th className="px-4 py-3">제목</th>
//                 <th className="px-4 py-3 w-28 text-center">정답자 수</th>
//                 <th className="px-4 py-3 w-28 text-center">정답률</th>
//               </tr>
//             </thead>

//             <tbody>
//               {mockProblems.map((p) => (
//                 <tr
//                   key={p.id}
//                   className="border-t border-gray-200 hover:bg-gray-50 transition"
//                 >
//                   <td className="px-4 py-3 text-center font-semibold text-smu-black">
//                     {p.id}
//                   </td>

//                   <td className="px-4 py-3 text-center">{p.difficulty}</td>

//                   <td className="px-4 py-3">
//                     <Link
//                       to={`/problems/detail`}
//                       className="font-semibold text-smu-navy"
//                     >
//                       {p.title}
//                     </Link>
//                   </td>

//                   <td className="px-4 py-3 text-center text-smu-black">
//                     {p.acceptedCount.toLocaleString()}
//                   </td>

//                   <td className="px-4 py-3 text-center text-smu-black">
//                     {p.acceptanceRate.toFixed(2)}%
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default ProblemList;

import React from "react";
import { Link } from "react-router-dom";

const mockProblems = [
  {
    id: 1,
    title: "두 수 비교하기",
    difficulty: 2,
    solved: false,
    bookmarked: true,
    acceptedCount: 11,
    acceptanceRate: 84.61,
    enabled: true,
  },
  {
    id: 2,
    title: "A+B",
    difficulty: 1,
    enabled: false,
  },
  {
    id: 3,
    title: "최댓값 찾기",
    difficulty: 2,
    enabled: false,
  },
  {
    id: 4,
    title: "문자열 뒤집기",
    difficulty: 2,
    enabled: false,
  },
  {
    id: 5,
    title: "배열 회전",
    difficulty: 3,
    enabled: false,
  },
];

const ProblemList = () => {
  return (
    <div className="bg-smu-base min-h-screen px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <span className="inline-block h-6 w-1.5 rounded-full bg-smu-neonlime" />
          <h1 className="text-2xl font-black text-smu-navy">
            문제 리스트
          </h1>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-smu-gray/20 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-smu-base text-smu-gray text-sm">
              <tr>
                <th className="px-4 py-3 w-24 text-center">번호</th>
                <th className="px-4 py-3 w-32 text-center">난이도</th>
                <th className="px-4 py-3">제목</th>
                <th className="px-4 py-3 w-32 text-center">정답자 수</th>
                <th className="px-4 py-3 w-28 text-center">정답률</th>
              </tr>
            </thead>

            <tbody>
              {mockProblems.map((p) => {
                const isDisabled = !p.enabled;

                return (
                  <tr
                    key={p.id}
                    className={`group border-t border-smu-gray/15 transition
                      ${isDisabled ? "bg-gray-50 text-smu-gray" : "hover:bg-smu-base"}`}
                  >
                    {/* 번호 */}
                    <td className="px-4 py-3 text-center font-semibold">
                      {p.id}
                    </td>

                    {/* 난이도 */}
                    <td className="px-4 py-3 text-center">
                      <DifficultyBadge level={p.difficulty} disabled={isDisabled} />
                    </td>

                    {/* 제목 */}
                    <td className="px-4 py-3">
                      {isDisabled ? (
                        <div className="flex items-center gap-2">
                          <span>{p.title}</span>
                          <span className="text-xs px-2 py-0.5 rounded bg-smu-gray/20">
                            문제 제공 예정
                          </span>
                        </div>
                      ) : (
                        <Link
                          to={`/problems/1/detail`}
                          className="font-semibold text-smu-navy group-hover:text-smu-black"
                        >
                          {p.title}
                        </Link>
                      )}
                    </td>

                    {/* 정답자 수 */}
                    <td className="px-4 py-3 text-center">
                      {isDisabled ? "-" : p.acceptedCount.toLocaleString()}
                    </td>

                    {/* 정답률 */}
                    <td className="px-4 py-3 text-center">
                      {isDisabled ? "-" : `${p.acceptanceRate.toFixed(2)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProblemList;

/* 난이도 */
function DifficultyBadge({ level, disabled }) {
  return (
    <span
      className={`inline-flex items-center justify-center min-w-[60px] rounded-full px-3 py-1 text-xs font-semibold
        ${
          disabled
            ? "bg-gray-100 text-gray-400"
            : "bg-smu-base text-smu-navy border border-smu-gray/25"
        }`}
    >
      Lv.{level}
    </span>
  );
}