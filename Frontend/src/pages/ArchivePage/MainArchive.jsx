import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Archive() {
  const [q, setQ] = useState("");
  const [activeCat, setActiveCat] = useState("All");

  // 위키 느낌용 더미 문서 (실데이터 붙일 때 이 배열만 교체)
  const docs = useMemo(
    () => [
      {
        id: "bfs-basics",
        title: "BFS 기본기",
        cat: "Graphs",
        summary:
          "큐 기반 탐색. 최단거리/레벨 탐색을 가장 빠르게 잡는 출발점.",
        tags: ["BFS", "Queue", "Shortest Path"],
        updatedAt: "1시간 전",
        by: "lime_coder",
        status: "정리됨",
        reads: 1240,
      },
      {
        id: "dp-recurrence",
        title: "DP 점화식 만드는 법",
        cat: "Dynamic Programming",
        summary:
          "상태 정의 → 전이 → 초기값 → 답 추출. 문제를 DP로 바꾸는 체크리스트.",
        tags: ["DP", "Recurrence", "Memo"],
        updatedAt: "어제",
        by: "neo_runner",
        status: "정리됨",
        reads: 980,
      },
      {
        id: "tx-isolation",
        title: "트랜잭션과 격리 수준",
        cat: "Databases",
        summary:
          "ACID, Lock/MVCC, 격리 수준별 현상(Dirty/Non-repeatable/Phantom) 정리.",
        tags: ["Transaction", "Isolation", "Lock"],
        updatedAt: "3일 전",
        by: "zelsa",
        status: "정리중",
        reads: 860,
      },
      {
        id: "segment-tree-intro",
        title: "세그먼트 트리 입문",
        cat: "Trees",
        summary:
          "구간 쿼리를 빠르게. 빌드/업데이트/쿼리 흐름과 실수 포인트.",
        tags: ["Segment Tree", "Range"],
        updatedAt: "5일 전",
        by: "navy_stack",
        status: "초안",
        reads: 540,
      },
      {
        id: "http-cache",
        title: "HTTP 캐시 한 번에 이해하기",
        cat: "Networking",
        summary:
          "Cache-Control, ETag, Revalidate, CDN 캐시까지 흐름으로 정리.",
        tags: ["HTTP", "Cache", "ETag"],
        updatedAt: "1주 전",
        by: "hello_kitty",
        status: "정리됨",
        reads: 730,
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return docs
      .filter((d) => activeCat === "All" || d.cat === activeCat)
      .filter((d) => {
        if (!s) return true;
        const blob =
          `${d.title} ${d.summary} ${d.cat} ${d.tags.join(" ")} ${d.by}`.toLowerCase();
        return blob.includes(s);
      });
  }, [q, activeCat, docs]);

  return (
    <div className="w-full min-h-screen bg-smu-base text-smu-black">
      {/* ===== Navy Hero ===== */}
      <header className="relative bg-smu-navy text-smu-base py-10">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-3xl bg-smu-neonlime blur-3xl" />
          <div className="absolute -bottom-14 -left-10 w-64 h-64 rounded-3xl bg-black blur-3xl opacity-40" />
        </div>

        {/* 설명칩 부분 */}
        <div className="max-w-[1200px] mx-auto px-6 pt-10 pb-12 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-smu-neonlime" />
            <span className="text-sm text-white/90">
              SolveMeUp Archive · Community Knowledge Base
            </span>
          </div>

          <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
                함께 만드는 CS 위키
              </h1>
              <p className="mt-4 text-[15px] lg:text-[16px] text-white/80 leading-relaxed">
                개념 요약부터 예제, 자주 나오는 함정까지.
                <br />
                풀이 흐름에 바로 붙는 지식을 모아둡니다.
              </p>
            </div>

            {/* 버튼 크기/비율 조정 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => alert("문서 작성은 추후 오픈 예정입니다.")}
                className="h-11 px-5 rounded-2xl font-semibold
                  bg-white text-smu-navy
                  hover:bg-smu-neonlime hover:text-smu-black
                  transition"
              >
                문서 작성
              </button>

              <button
                type="button"
                onClick={() => alert("기여 가이드는 추후 오픈 예정입니다.")}
                className="h-11 px-5 rounded-2xl font-semibold
                  bg-white/10 border border-white/20 text-white
                  hover:bg-white/15 transition"
              >
                기여 가이드
              </button>
            </div>
          </div>

          {/* 검색 */}
          <div className="mt-8">
            <div className="relative max-w-[920px]">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="문서 검색 (예: BFS, 인덱스, 트랜잭션, 데드락...)"
                className="w-full rounded-2xl px-5 py-4 pr-12
                  bg-white text-smu-black
                  border border-white/30 outline-none
                  focus:border-smu-neonlime
                  transition"
              />
            </div>

          </div>
        </div>
      </header>

      {/* ===== Main list ===== */}
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {/* list header */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-sm text-smu-gray">
                카테고리{" "}
                <span className="font-semibold text-smu-navy">
                  {activeCat === "All" ? "전체" : activeCat}
                </span>{" "}
                · 결과{" "}
                <span className="font-semibold text-smu-navy">
                  {filtered.length}
                </span>
                개
              </div>
              <div className="mt-1 text-lg font-extrabold text-smu-black">
                문서 목록
              </div>
            </div>

            {/* stub sort */}
            <button
              type="button"
              onClick={() => alert("정렬 기능은 추후 오픈 예정입니다.")}
              className="px-4 py-2 rounded-xl text-sm font-semibold
                bg-smu-base border border-gray-100
                text-smu-navy
                hover:border-smu-navy transition"
            >
              최신순 ▾
            </button>
          </div>

          {filtered.map((d) => (
            <DocRow key={d.id} doc={d} />
          ))}

          {filtered.length === 0 && (
            <div className="p-12 text-center">
              <div className="text-lg font-bold text-smu-black">
                검색 결과가 없어요
              </div>
              <div className="mt-2 text-sm text-smu-gray">
                다른 키워드로 검색하거나, 새 문서를 만들어 보세요.
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-xs text-smu-gray">
          * 상세 페이지/편집/버전 관리는 확장 기능으로 단계적으로 공개됩니다.
        </div>
      </div>
    </div>
  );
}

function DocRow({ doc }) {
  const statusStyle =
    doc.status === "정리됨"
      ? "bg-smu-neonlime text-smu-black"
      : doc.status === "초안"
      ? "bg-white text-smu-gray border border-gray-200"
      : "bg-smu-base text-smu-navy border border-gray-100";

  return (
    <Link
      to={`/archive/${doc.id}`}
      onClick={(e) => {
        e.preventDefault();
        alert("문서 상세는 추후 오픈 예정입니다.");
      }}
      className="group block px-6 py-6 border-b border-gray-100 hover:bg-smu-base transition"
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="text-xl font-extrabold text-smu-black group-hover:text-smu-navy transition truncate">
              {doc.title}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyle}`}>
              {doc.status}
            </span>
          </div>

          <div className="mt-2 text-sm text-smu-gray leading-relaxed line-clamp-2">
            {doc.summary}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {doc.tags.map((t) => (
              <span
                key={t}
                className="px-2 py-1 rounded-lg text-xs bg-white border border-gray-100
                  text-smu-navy
                  group-hover:border-smu-navy group-hover:bg-transparent
                  transition"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xs text-smu-gray">{doc.cat}</div>

          <div className="mt-1 text-sm font-semibold text-smu-navy">
            {doc.updatedAt}
          </div>

          <div className="mt-1 text-xs text-smu-gray">
            by {doc.by}
          </div>

          <div className="mt-3 text-xs text-smu-gray">
            조회 {doc.reads.toLocaleString()}
          </div>
        </div>
      </div>

      {/* subtle underline accent */}
      <div className="mt-5 h-[3px] w-10 rounded-full bg-transparent group-hover:bg-smu-neonlime transition" />
    </Link>
  );
}