import React from "react";
import { Link } from "react-router-dom";

const mockProblems = [
  {
    id: 123,
    title: "다이아몬드 캐기",
    difficulty: 1,
    solved: true,
    bookmarked: false,
    acceptedCount: 76,
    acceptanceRate: 76.12,
  },
  {
    id: 167,
    title: "두 수 비교하기",
    difficulty: 2,
    solved: false,
    bookmarked: true,
    acceptedCount: 767,
    acceptanceRate: 32.49,
  },
];


const ProblemList = () => {
  return (
    <div className="bg-smu-base min-h-screen px-10 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-smu-navy mb-6">문제 리스트</h1>

        <div className="bg-white rounded-2xl shadow overflow-hidden border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-smu-black">
              <tr>
                <th className="px-4 py-3 w-24 text-center">번호</th>
                <th className="px-4 py-3 w-28 text-center">난이도</th>
                <th className="px-4 py-3">제목</th>
                <th className="px-4 py-3 w-28 text-center">정답자 수</th>
                <th className="px-4 py-3 w-28 text-center">정답률</th>
              </tr>
            </thead>

            <tbody>
              {mockProblems.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-center font-semibold text-smu-black">
                    {p.id}
                  </td>

                  <td className="px-4 py-3 text-center">{p.difficulty}</td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/problems/${p.id}`}
                      className="font-semibold text-smu-navy"
                    >
                      {p.title}
                    </Link>
                  </td>

                  <td className="px-4 py-3 text-center text-smu-black">
                    {p.acceptedCount.toLocaleString()}
                  </td>

                  <td className="px-4 py-3 text-center text-smu-black">
                    {p.acceptanceRate.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-smu-gray">
          ※ 임시 데이터로 작업 진행 중
        </p>
      </div>
    </div>
  );
};

export default ProblemList;