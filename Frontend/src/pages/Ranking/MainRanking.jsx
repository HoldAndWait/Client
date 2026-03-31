import React, { useMemo, useState } from "react";

export default function Ranking() {
  const [query, setQuery] = useState("");

  const rankingData = [
    { rank: 1, name: "fickle", score: 1300725, delta: +120 },
    { rank: 2, name: "bobo", score: 1290725, delta: +80 },
    { rank: 3, name: "다이노탱", score: 1289925, delta: +65 },
    { rank: 4, name: "choi", score: 1270725, delta: +12 },
    { rank: 5, name: "이상한나라의솜사탕", score: 1260725, delta: -10 },
    { rank: 6, name: "레인보우샤베트", score: 1250725, delta: +5 },
    { rank: 21, name: "ME", score: 300725, delta: 0 },
  ];

  const top3 = useMemo(() => rankingData.slice(0, 3), [rankingData]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rankingData;
    return rankingData.filter((u) => u.name.toLowerCase().includes(q));
  }, [query, rankingData]);

  // “내 랭킹”은 아직 로그인 연동 안 해도 UI만 보여주기(더미)
  const my = { rank: 21, name: "", score: 300725, delta: 0 };

  return (
    <div className="w-full bg-smu-base min-h-screen text-smu-black">
      <div className="max-w-[1100px] mx-auto px-6 py-14">
        {/* ===== Title ===== */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-smu-black">
              랭킹
            </h1>
            <p className="mt-2 text-sm text-smu-gray">
              사용자들의 풀이 기록을 점수로 집계합니다.
            </p>
          </div>

          <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-gray-100 text-sm text-smu-navy">
            <span className="w-2 h-2 rounded-full bg-smu-neonlime" />
            Weekly Snapshot
          </span>
        </div>

        {/* ===== Top 3 Highlight ===== */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
          {top3.map((u) => (
            <TopCard key={u.rank} user={u} />
          ))}
        </div>

        {/* ===== Search ===== */}
        <div className="mt-10">
          <div className="relative">
            <input
              placeholder="닉네임 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="
                w-full rounded-full px-6 py-3
                border border-smu-gray
                bg-white
                outline-none
                focus:border-smu-navy
                transition
              "
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-smu-gray">
              🔍
            </div>
          </div>

          {/* 추천 칩(UI 포인트) */}
          <div className="mt-3 flex flex-wrap gap-2">
            {["Top 100", "상승중", "신규"].map((t) => (
              <button
                key={t}
                className="px-3 py-1 rounded-full text-sm bg-white border border-gray-100
                  text-smu-navy hover:bg-smu-navy hover:text-smu-base transition"
                type="button"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ===== My Rank Bar ===== */}
        <div className="mt-10">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-10 rounded-full bg-smu-neonlime" />
              <div>
                <div className="text-sm text-smu-gray">
                  내 랭킹
                </div>
                <div className="text-lg font-extrabold text-smu-black">
                  {my.rank}위 {/*· {my.name}*/}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-smu-gray">점수</div>
              <div className="text-lg font-extrabold text-smu-navy">
                {my.score.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Table ===== */}
        <div className="mt-8 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="grid grid-cols-3 px-6 py-3 bg-gray-100 text-sm font-semibold">
            <div>등수</div>
            <div className="text-center">닉네임</div>
            <div className="text-right">점수</div>
          </div>

          {/* Rows */}
          {filtered.map((u, idx) => (
            <div
              key={`${u.name}-${idx}`}
              className="
                group grid grid-cols-3 px-6 py-4 items-center
                border-t border-gray-100
                hover:bg-smu-base
                transition
              "
            >
              {/* left accent bar on hover */}
              <div className="flex items-center gap-3">
                <span className="w-0 group-hover:w-1 h-6 rounded-full bg-smu-neonlime transition-all" />
                <span className="font-semibold">{u.rank}</span>
                {u.rank <= 3 && (
                  <span className="ml-1 text-xs px-2 py-1 rounded-full bg-smu-neonlime text-smu-black font-semibold">
                    TOP
                  </span>
                )}
              </div>

              <div className="text-center font-semibold text-smu-black group-hover:text-smu-navy transition">
                {u.name}
              </div>

              <div className="text-right font-extrabold">
                <span className="text-smu-black group-hover:text-smu-navy transition">
                  {u.score.toLocaleString()}
                </span>

                <span
                  className={`ml-3 text-xs font-semibold px-2 py-1 rounded-full border
                    ${
                      u.delta > 0
                        ? "border-smu-neonlime text-smu-navy bg-smu-base"
                        : u.delta < 0
                        ? "border-gray-200 text-smu-gray bg-white"
                        : "border-gray-200 text-smu-gray bg-white"
                    }`}
                >
                  {u.delta > 0 ? `↑ +${u.delta}` : u.delta < 0 ? `↓ ${u.delta}` : "—"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopCard({ user }) {
  const medal =
    user.rank === 1 ? "🥇" : user.rank === 2 ? "🥈" : user.rank === 3 ? "🥉" : "🏅";

  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-6
        hover:border-smu-navy hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-smu-gray">Top {user.rank}</div>
        <div className="text-xl">{medal}</div>
      </div>

      <div className="mt-3 text-xl font-extrabold text-smu-black group-hover:text-smu-navy transition">
        {user.name}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <div className="text-sm text-smu-gray">점수</div>
        <div className="text-lg font-extrabold text-smu-navy">
          {user.score.toLocaleString()}
        </div>
      </div>

      <div className="mt-4 h-[3px] w-10 rounded-full bg-smu-base group-hover:bg-smu-neonlime transition" />
    </div>
  );
}