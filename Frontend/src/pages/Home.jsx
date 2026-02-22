import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const featuredProblems = [
    { level: "Easy", title: "Two Sum Variants", tags: ["Array", "HashMap"] },
    { level: "Medium", title: "LRU Cache Lite", tags: ["Design", "Queue"] },
    { level: "Medium", title: "Grid BFS Path", tags: ["BFS", "Graph"] },
    { level: "Hard", title: "Segment Tree Queries", tags: ["Tree", "Range"] },
  ];

  const tracks = [
    { title: "1주 완성 코테 루틴", desc: "매일 1문제 + 약점 복기", badge: "추천" },
    { title: "SQL 실전 20제", desc: "조인/윈도우/집계 집중", badge: "인기" },
    { title: "CS 핵심 30문항", desc: "네트워크/OS/DB 빠르게", badge: "기초" },
  ];

  return (
    <div className="w-full bg-[var(--color-smu-base)] text-[var(--color-smu-black)]">
      {/* ===== Hero ===== */}
      <section className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-smu-gray)] bg-white">
              <span className="w-2 h-2 rounded-full bg-[var(--color-smu-neonlime)]" />
              <span className="text-sm text-[var(--color-smu-navy)]">
                SolveMeUp · Coding Practice Platform
              </span>
            </div>

            <h1 className="mt-5 text-4xl lg:text-5xl font-extrabold leading-tight text-[var(--color-smu-black)]">
              매일 1문제,
              <br />
              <span className="text-[var(--color-smu-navy)]">
                풀이 흐름을 만들다
              </span>
            </h1>

            <p className="mt-6 text-[17px] leading-relaxed text-[var(--color-smu-navy)]">
              문제 풀이부터 실행·제출·기록까지 한 번에.
              <br />
              안정적인 채점 흐름과 깔끔한 UI로 학습 루틴을 이어가세요.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/problems"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
                  bg-[var(--color-smu-neonlime)] text-[var(--color-smu-black)]
                  hover:bg-[var(--color-smu-navy)] hover:text-[var(--color-smu-base)]
                  transition"
              >
                <span>문제 풀기</span>
                <span className="opacity-70 group-hover:opacity-100 transition">
                  →
                </span>
              </Link>

              <Link
                to="/ranking"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
                  border border-[var(--color-smu-gray)] text-[var(--color-smu-navy)]
                  bg-white hover:bg-[var(--color-smu-navy)] hover:text-[var(--color-smu-base)]
                  hover:border-[var(--color-smu-navy)]
                  transition"
              >
                <span>랭킹 보기</span>
                <span className="opacity-70 group-hover:opacity-100 transition">
                  ↗
                </span>
              </Link>
            </div>

            <div className="mt-6 text-sm text-[var(--color-smu-gray)]">
              Tip: 문제 페이지에서{" "}
              <span className="font-semibold text-[var(--color-smu-navy)]">
                실행
              </span>
              으로 빠르게 확인하고,{" "}
              <span className="font-semibold text-[var(--color-smu-navy)]">
                제출
              </span>
              로 기록을 남기세요.
            </div>
          </div>

          {/* Right: Tabs Carousel Preview */}
          <div className="flex-1 w-full">
            <TabsPreviewCarousel />
          </div>
        </div>
      </section>

      {/* ===== Tabs Highlights (replaces Stats) ===== */}
      <section className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <TabHighlightCard
            label="문제"
            title="Problem"
            desc="설명·제약·예제까지 한 번에"
            accent="lime"
          />
          <TabHighlightCard
            label="제출 내역"
            title="Submissions"
            desc="결과·런타임·메모리 기록"
            accent="navy"
          />
          <TabHighlightCard
            label="정답 코드"
            title="Solution"
            desc="참고 풀이로 접근 방식 학습"
            accent="lime"
          />
          <TabHighlightCard
            label="토론"
            title="Discuss"
            desc="질문·아이디어 공유"
            accent="navy"
          />
        </div>
      </section>

      {/* ===== Featured Problems ===== */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-smu-black)]">
              인기 문제
            </h2>
            <p className="mt-2 text-[15px] text-[var(--color-smu-gray)]">
              사람들이 많이 푸는 문제로 빠르게 워밍업하세요.
            </p>
          </div>

          <Link
            to="/problems"
            className="hidden sm:inline-flex items-center gap-2 text-[var(--color-smu-navy)] font-semibold
              hover:text-[var(--color-smu-black)] transition"
          >
            전체 문제 보기 <span>→</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredProblems.map((p, idx) => (
            <ProblemCard key={idx} {...p} />
          ))}
        </div>
      </section>

      {/* ===== Tracks / Features ===== */}
      <section className="max-w-[1200px] mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold text-[var(--color-smu-black)]">
          학습 트랙
        </h2>
        <p className="mt-2 text-[15px] text-[var(--color-smu-gray)]">
          목표에 맞춘 루틴으로 꾸준히 쌓아보세요.
        </p>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {tracks.map((t, idx) => (
            <TrackCard key={idx} {...t} />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="문제 풀이 흐름"
            desc="문제 → 실행 → 제출 → 결과를 한 화면에서 확인합니다."
          />
          <FeatureCard
            title="기록과 리플레이"
            desc="제출 기록과 결과를 모아 약점 패턴을 빠르게 찾습니다."
          />
          <FeatureCard
            title="랭킹과 커뮤니티"
            desc="같이 푸는 재미, 질문과 공유로 속도를 높입니다."
          />
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="pb-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-sm bg-white">
            <div className="p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div>
                <h3 className="text-3xl font-extrabold text-[var(--color-smu-black)]">
                  오늘의 루틴을 시작해요
                </h3>
                <p className="mt-3 text-[15px] text-[var(--color-smu-navy)]">
                  한 문제부터. 실행하고 제출하면 기록이 남고, 다음이 쉬워집니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Link
                  to="/problems"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold
                    bg-[var(--color-smu-navy)] text-[var(--color-smu-base)]
                    hover:bg-[var(--color-smu-neonlime)] hover:text-[var(--color-smu-black)]
                    transition"
                >
                  문제 목록으로{" "}
                  <span className="opacity-70 group-hover:opacity-100">→</span>
                </Link>

                <Link
                  to="/community"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold
                    border border-[var(--color-smu-gray)] bg-white text-[var(--color-smu-navy)]
                    hover:border-[var(--color-smu-navy)] hover:bg-[var(--color-smu-base)]
                    transition"
                >
                  커뮤니티 둘러보기{" "}
                  <span className="opacity-70 group-hover:opacity-100">↗</span>
                </Link>
              </div>
            </div>

            <div className="px-8 sm:px-10 py-5 border-t border-gray-100 bg-[var(--color-smu-base)] text-sm text-[var(--color-smu-gray)]">
              안정적인 운영을 위해 채점 대기/결과 상태를 명확하게 표시하고, 기록은
              일관되게 동기화합니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* =========================
   Components
========================= */

function TabsPreviewCarousel() {
  const slides = useMemo(
    () => [
      {
        key: "problem",
        tab: "문제",
        rightHint: "Problem",
        titleTop: "오늘의 추천",
        title: "Grid BFS Path",
        badge: "Medium",
        contentType: "problem",
      },
      {
        key: "submissions",
        tab: "제출 내역",
        rightHint: "Submissions",
        titleTop: "최근 제출",
        title: "Accepted · 1.6s · 42MB",
        badge: "AC",
        contentType: "submissions",
      },
      {
        key: "solution",
        tab: "정답 코드",
        rightHint: "Solution",
        titleTop: "정답 코드",
        title: "BFS + visited 최적화",
        badge: "Guide",
        contentType: "solution",
      },
      {
        key: "discuss",
        tab: "토론",
        rightHint: "Discuss",
        titleTop: "토론",
        title: "가장 깔끔한 BFS 구현?",
        badge: "Hot",
        contentType: "discuss",
      },
    ],
    []
  );

  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  const s = slides[active];

  return (
    <div className="relative">
      <div className="absolute -top-6 -right-4 w-24 h-24 rounded-2xl bg-[var(--color-smu-neonlime)] opacity-40 blur-xl" />
      <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-2xl bg-[var(--color-smu-navy)] opacity-30 blur-xl" />

      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-smu-gray)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-smu-gray)]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-smu-gray)]" />
          </div>
          <div className="text-sm text-[var(--color-smu-gray)]">
            {s.rightHint}
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="flex flex-wrap gap-2">
            {slides.map((x, idx) => {
              const isActive = idx === active;
              return (
                <button
                  key={x.key}
                  onClick={() => setActive(idx)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition border
                    ${
                      isActive
                        ? "bg-[var(--color-smu-navy)] text-[var(--color-smu-base)] border-[var(--color-smu-navy)]"
                        : "bg-white text-[var(--color-smu-navy)] border-gray-100 hover:bg-[var(--color-smu-base)]"
                    }`}
                >
                  {x.tab}
                  <span
                    className={`block h-[2px] rounded-full mt-1 transition
                      ${
                        isActive
                          ? "bg-[var(--color-smu-neonlime)]"
                          : "bg-transparent"
                      }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-[var(--color-smu-gray)]">
                {s.titleTop}
              </div>
              <div className="text-lg font-semibold text-[var(--color-smu-black)]">
                {s.title}
              </div>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-smu-neonlime)] text-[var(--color-smu-black)]">
              {s.badge}
            </span>
          </div>

          <div className="mt-4 rounded-xl border border-gray-100 bg-[var(--color-smu-base)] p-4">
            {s.contentType === "problem" && (
              <>
                <div className="text-xs text-[var(--color-smu-gray)] mb-2">
                  example.js
                </div>
                <pre className="text-[13px] leading-relaxed text-[var(--color-smu-navy)] whitespace-pre-wrap">
{`function bfs(grid) {
  const q = [[0,0]];
  while (q.length) {
    const [r,c] = q.shift();
    // ...
  }
  return true;
}`}
                </pre>
                <div className="mt-3 flex gap-2">
                  {["BFS", "Graph", "Queue"].map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-lg text-xs bg-white border border-gray-100 text-[var(--color-smu-navy)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}

            {s.contentType === "submissions" && (
              <div className="space-y-3">
                <SubmissionRow
                  status="Accepted"
                  meta="JavaScript · 1.6s · 42MB"
                />
                <SubmissionRow
                  status="Wrong Answer"
                  meta="JavaScript · 1.8s · 45MB"
                />
                <SubmissionRow status="Accepted" meta="Python · 2.2s · 78MB" />
              </div>
            )}

            {s.contentType === "solution" && (
              <>
                <div className="text-xs text-[var(--color-smu-gray)] mb-2">
                  핵심 아이디어
                </div>
                <ul className="text-[13px] text-[var(--color-smu-navy)] leading-relaxed list-disc pl-5 space-y-1">
                  <li>visited로 중복 방문 방지</li>
                  <li>큐 기반 BFS로 최단 흐름 유지</li>
                  <li>경계 조건(벽/범위) 체크</li>
                </ul>
                <div className="mt-3 rounded-lg bg-white border border-gray-100 p-3">
                  <div className="text-xs text-[var(--color-smu-gray)]">
                    pseudo
                  </div>
                  <pre className="text-[12px] text-[var(--color-smu-navy)] whitespace-pre-wrap">
{`push(start)
while queue:
  pop()
  for neighbors:
    if valid & not visited:
      push()`}
                  </pre>
                </div>
              </>
            )}

            {s.contentType === "discuss" && (
              <div className="space-y-3">
                <DiscussRow
                  title="q.shift() 느린데 최적화 방법?"
                  meta="댓글 12 · 3분 전"
                />
                <DiscussRow
                  title="visited를 Set으로 쓰는 게 나을까요?"
                  meta="댓글 7 · 12분 전"
                />
                <DiscussRow
                  title="Python deque vs list 성능 차이"
                  meta="댓글 19 · 1시간 전"
                />
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <MiniChip label="채점 서버" value="Healthy" strong />
            <MiniChip label="최근 결과" value="Accepted" />
          </div>

          <div className="mt-4 flex justify-end">
            <Link
              to="/problems"
              className="text-sm font-semibold text-[var(--color-smu-navy)] hover:text-[var(--color-smu-black)] transition"
            >
              문제 페이지 보기 →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubmissionRow({ status, meta }) {
  const ok = status === "Accepted";
  return (
    <div className="flex items-center justify-between gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            ok ? "bg-[var(--color-smu-neonlime)]" : "bg-[var(--color-smu-gray)]"
          }`}
        />
        <div className="text-sm font-semibold text-[var(--color-smu-black)]">
          {status}
        </div>
      </div>
      <div className="text-xs text-[var(--color-smu-gray)]">{meta}</div>
    </div>
  );
}

function DiscussRow({ title, meta }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl px-4 py-3">
      <div className="text-sm font-semibold text-[var(--color-smu-black)]">
        {title}
      </div>
      <div className="mt-1 text-xs text-[var(--color-smu-gray)]">{meta}</div>
    </div>
  );
}

function TabHighlightCard({ label, title, desc, accent = "lime" }) {
  const isLime = accent === "lime";

  return (
    <div
      className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm
        hover:bg-[var(--color-smu-navy)] hover:border-[var(--color-smu-navy)]
        hover:shadow-md transition"
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-[var(--color-smu-gray)] group-hover:text-[var(--color-smu-base)]/80 transition">
          {label}
        </div>

        <span
          className={`w-2.5 h-2.5 rounded-full transition
            ${
              isLime
                ? "bg-[var(--color-smu-neonlime)]"
                : "bg-[var(--color-smu-base)]"
            }
            group-hover:bg-[var(--color-smu-neonlime)]`}
        />
      </div>

      <div className="mt-4 text-2xl font-extrabold leading-snug text-[var(--color-smu-black)] group-hover:text-[var(--color-smu-base)] transition">
        {title}
      </div>

      <div className="mt-2 text-[15px] text-[var(--color-smu-gray)] group-hover:text-[var(--color-smu-base)]/80 transition">
        {desc}
      </div>

      <div className="mt-6 h-[3px] w-10 rounded-full transition bg-[var(--color-smu-base)] group-hover:bg-[var(--color-smu-neonlime)]" />
    </div>
  );
}

function ProblemCard({ level, title, tags }) {
  return (
    <Link
      to="/problems"
      className="group block bg-white rounded-2xl p-6 border border-gray-100 shadow-sm
        hover:bg-[var(--color-smu-black)] hover:border-[var(--color-smu-black)]
        transition"
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold
          bg-[var(--color-smu-base)] text-[var(--color-smu-navy)]
          group-hover:bg-[var(--color-smu-neonlime)] group-hover:text-[var(--color-smu-black)]
          transition"
        >
          {level}
        </span>

        <span className="text-xs text-[var(--color-smu-gray)] group-hover:text-[var(--color-smu-base)]/70 transition">
          SolveMeUp Pick
        </span>
      </div>

      <div className="mt-3 text-lg font-bold text-[var(--color-smu-black)] group-hover:text-[var(--color-smu-base)] transition">
        {title}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((t, idx) => (
          <span
            key={idx}
            className="px-2 py-1 rounded-lg text-xs border border-gray-100 bg-white
              text-[var(--color-smu-navy)]
              group-hover:bg-transparent group-hover:border-[var(--color-smu-base)]/20 group-hover:text-[var(--color-smu-base)]/90
              transition"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-smu-navy)] group-hover:text-[var(--color-smu-neonlime)] transition">
        바로 풀기 <span>→</span>
      </div>
    </Link>
  );
}

function TrackCard({ title, desc, badge }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:border-[var(--color-smu-navy)] hover:shadow-md transition">
      <div className="flex items-center justify-between gap-3">
        <div className="text-lg font-bold text-[var(--color-smu-black)] group-hover:text-[var(--color-smu-navy)] transition">
          {title}
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-smu-neonlime)] text-[var(--color-smu-black)] group-hover:bg-[var(--color-smu-navy)] group-hover:text-[var(--color-smu-base)] transition">
          {badge}
        </span>
      </div>

      <div className="mt-2 text-[15px] text-[var(--color-smu-gray)]">{desc}</div>

      <Link
        to="/problems"
        className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-smu-navy)] hover:text-[var(--color-smu-black)] transition"
      >
        트랙 시작 <span>→</span>
      </Link>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:bg-[var(--color-smu-navy)] hover:border-[var(--color-smu-navy)] transition">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold bg-[var(--color-smu-neonlime)] text-[var(--color-smu-black)] group-hover:bg-white group-hover:text-[var(--color-smu-navy)] transition">
        ✓
      </div>

      <h4 className="mt-4 text-lg font-bold text-[var(--color-smu-black)] group-hover:text-[var(--color-smu-base)] transition">
        {title}
      </h4>
      <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-smu-navy)] group-hover:text-[var(--color-smu-base)]/90 transition">
        {desc}
      </p>
    </div>
  );
}

function MiniChip({ label, value, strong }) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 px-4 py-3">
      <div className="text-xs text-[var(--color-smu-gray)]">{label}</div>
      <div
        className={`mt-1 text-sm font-semibold ${
          strong ? "text-[var(--color-smu-navy)]" : "text-[var(--color-smu-black)]"
        }`}
      >
        {value}
      </div>
    </div>
  );
}