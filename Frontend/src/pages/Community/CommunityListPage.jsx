// 디버깅용 ui 단순화 버전
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "@api/api.js";


// export default function CommunityListPage() {

//   const navigate = useNavigate();
//   const [raw, setRaw] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [errMsg, setErrMsg] = useState("");
//   const [debug, setDebug] = useState("INIT");


//   useEffect(() => {
//     setDebug("EFFECT_STARTED");

//     (async () => {
//       try {
//         const res = await api.get("/api/posts");
//         setDebug("GET_SUCCESS");
//         console.log("✅ GET status:", res.status);
//         console.log("✅ GET data:", res.data);

//         setRaw(res.data);

//         // 일단 가장 흔한 케이스만:
//         const list =
//           Array.isArray(res.data) ? res.data :
//           Array.isArray(res.data?.content) ? res.data.content :
//           Array.isArray(res.data?.data) ? res.data.data :
//           Array.isArray(res.data?.result) ? res.data.result :
//           Array.isArray(res.data?.data?.content) ? res.data.data.content :
//           [];

//         console.log("✅ parsed list length:", list.length);
//         setPosts(list);
//       } catch (e) {
//         setDebug("GET_FAILED");
//         console.log("❌ GET failed:", e?.response?.status, e?.response?.data, e);
//         setErrMsg("불러오기 실패");
//         setPosts([]);
//       }
//     })();
//   }, []);

//   return (
//     <div className="min-h-screen bg-white">
//       <main className="mx-auto max-w-5xl px-6 py-10">
//         <div className="mb-6 flex items-center justify-between">
          
//           <div className="text-xl font-bold text-gray-700">커뮤니티</div>

//           <button
//             className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold"
//             onClick={() => navigate("/communitywrite")}
//           >
//             글쓰기
//           </button>
//         </div>

//         {errMsg ? (
//           <div className="py-6 text-center text-red-600">{errMsg}</div>
//         ) : null}

//         {/* ✅ 응답 구조 확인용 (임시) */}
//         {/* <pre className="mb-6 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
//               {JSON.stringify(raw, null, 2)}
//             </pre> */}

//         {/* <div className="mb-2 text-xs text-gray-500">DEBUG: {debug}</div> */}

//         <div className="mt-6">
//           {posts.length === 0 ? (
//             <div className="py-20 text-center text-gray-500">
//               게시글이 없습니다.
//             </div>
//           ) : (
//             posts.map((p, idx) => (
//               <div key={p.id ?? p.postId ?? idx} className="py-6">
//                 <Link
//                   to={`/community/${p.id ?? p.postId ?? ""}`}
//                   className="block text-lg font-bold text-black hover:underline"
//                 >
//                   {p.title ?? "(title 없음)"}
//                 </Link>
//                 <div className="mt-2 text-sm text-gray-600">
//                   {p.content ?? "(content 없음)"}
//                 </div>
//                 <div className="mt-4 h-px w-full bg-gray-200" />
//               </div>
//             ))
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@api/api.js";

/** =========================
 * 날짜 포맷 유틸 (예: 2026-01-28T02:06:52 -> Jan.28.2026)
 * ========================= */
function formatDate(yyyyMmDd) {
  const [y, m, d] = String(yyyyMmDd || "").split("-").map(Number);
  const monthNames = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.",
  ];
  if (!y || !m || !d) return yyyyMmDd || "";
  return `${monthNames[m - 1]}${d}.${y}`;
}

/** =========================
 * 리스트 응답 형태 정규화
 * ========================= */
function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data?.content)) return data.data.content;
  return [];
}

function mapPost(p) {
  return {
    id: String(p.id ?? p.postId ?? ""),
    title: p.title ?? "",
    content: p.content ?? "",
    author:
      typeof p.author === "string"
        ? p.author
        : (p.author?.nickname ??
            p.authorName ??
            p.user?.nickname ??
            p.writer?.nickname ??
            "unknown"),
    createdAt: toYmd(p.createdAt ?? p.created_at ?? p.createdDate ?? p.created_date),
    likeCount: p.likeCount ?? p.like_count ?? p.likes ?? 0,
    commentCount: p.commentCount ?? p.comment_count ?? p.comments ?? 0,
  };
}

function toYmd(createdAtLike) {
  const s = String(createdAtLike || "");
  return s.length >= 10 ? s.slice(0, 10) : s;
}

async function fetchAllPosts(signal) {
  const posts = [];
  let lastId = null;
  let hasNext = true;

  while (hasNext) {
    const res = await api.get("/api/posts", {
      params: { size: 100, ...(lastId == null ? {} : { lastId }) },
      signal,
    });
    const page = res.data ?? {};
    posts.push(...normalizeListResponse(page));
    hasNext = page.hasNext === true;
    lastId = page.lastId ?? null;

    if (hasNext && lastId == null) break;
  }

  return posts;
}

async function searchAllPosts(keyword, signal) {
  const posts = [];
  let page = 0;
  let totalPages = 1;

  while (page < totalPages) {
    const res = await api.get("/api/posts/search", {
      params: { keyword, page, size: 100 },
      signal,
    });
    const result = res.data ?? {};
    posts.push(...normalizeListResponse(result));
    totalPages = result.totalPages ?? 0;
    page += 1;
  }

  return posts;
}

export default function CommunityListPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const keyword = q.trim();
    const delay = keyword ? 300 : 0;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const list = keyword
          ? await searchAllPosts(keyword, controller.signal)
          : await fetchAllPosts(controller.signal);

        const safe = list.map(mapPost).filter((p) => p.id);
        setPosts(safe);
      } catch (e) {
        if (controller.signal.aborted) return;
        const status = e?.response?.status;
        if (status === 401) setErrorMsg("로그인이 필요합니다.");
        else if (status === 403) setErrorMsg("권한이 없습니다.");
        else setErrorMsg("게시글을 불러오지 못했습니다.");
        setPosts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  const filtered = useMemo(() => {
    return posts;
  }, [posts]);

  const syncOnePost = async (postId) => {
    const res = await api.get(`/api/posts/${postId}`);
    const p = res.data?.data ?? res.data ?? null;
    const nextLike = p?.likeCount ?? p?.likes ?? p?.like_count;
    setPosts((prev) =>
      prev.map((row) => {
        if (String(row.id) !== String(postId)) return row;
        return { ...row, likeCount: nextLike ?? row.likeCount };
      })
    );
  };

  const onLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/likes`);
      await syncOnePost(postId);
    } catch {
      alert("추천 실패");
    }
  };

  return (
    <div className="w-full min-h-screen bg-smu-base text-smu-black">
      <main className="mx-auto max-w-[1200px] px-6 py-14">

        {/* ===== 페이지 헤더 ===== */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-smu-gray bg-white mb-5">
            <span className="w-2 h-2 rounded-full bg-smu-neonlime" />
            <span className="text-sm text-smu-navy">SolveMeUp · Community</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-smu-black">
            커뮤니티
          </h1>
          <p className="mt-3 text-[17px] text-smu-navy">
            질문하고, 공유하고, 함께 성장하세요.
          </p>
        </div>

        {/* ===== 검색 + 글쓰기 ===== */}
        <div className="flex items-center gap-3 mb-10">
          <div className="relative flex-1">
            {/* 검색 아이콘 */}
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-smu-gray pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              className="
                h-12 w-full pl-10 pr-4
                rounded-xl border border-smu-gray bg-white
                text-sm text-smu-black placeholder-smu-gray
                outline-none focus:border-smu-navy
                transition
              "
              placeholder="제목, 내용, 작성자로 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/communitywrite")}
            className="
              inline-flex items-center justify-center gap-2
              h-12 px-6 rounded-xl
              bg-smu-navy text-smu-base font-semibold text-sm
              hover:bg-smu-neonlime hover:text-smu-black
              transition whitespace-nowrap
            "
          >
            글쓰기
            <span className="opacity-70">+</span>
          </button>
        </div>

        {/* ===== 로딩/에러 ===== */}
        {loading && (
          <div className="py-20 text-center text-smu-gray">불러오는 중...</div>
        )}
        {!loading && errorMsg && (
          <div className="py-20 text-center text-red-500 font-semibold">{errorMsg}</div>
        )}

        {/* ===== 게시글 목록 ===== */}
        {!loading && !errorMsg && (
          <>
            {filtered.length === 0 ? (
              <div className="py-24 text-center text-smu-gray">게시글이 없습니다.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((post) => (
                  <PostCard key={post.id} post={post} onLike={onLike} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/* =========================
   PostCard
========================= */
function PostCard({ post, onLike }) {
  return (
    <div
      className="
        group bg-white rounded-2xl border border-gray-100 shadow-sm
        px-7 py-6
        hover:border-smu-navy hover:shadow-md
        transition
      "
    >
      {/* 작성자 + 날짜 */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          {/* 아바타 이니셜 */}
          <div className="w-8 h-8 rounded-full bg-smu-navy text-smu-base flex items-center justify-center text-xs font-bold select-none">
            {String(post.author || "?")[0].toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-smu-black">
            {post.author}
          </span>
        </div>

        <span className="text-xs text-smu-gray">{formatDate(post.createdAt)}</span>
      </div>

      {/* 제목 */}
      <Link
        to={`/community/${post.id}`}
        className="block text-lg font-extrabold text-smu-black hover:text-smu-navy transition mb-2"
      >
        {post.title || "(title 없음)"}
      </Link>

      {/* 내용 미리보기 */}
      <Link
        to={`/community/${post.id}`}
        className="block text-[15px] text-smu-navy line-clamp-2 hover:underline"
      >
        {post.content || "(content 없음)"}
      </Link>

      {/* 구분선 */}
      <div className="mt-5 mb-4 h-px w-full bg-gray-100" />

      {/* 하단: 태그 자리 + 추천/댓글 */}
      <div className="flex items-center justify-between gap-4">
        {/* 왼쪽: 더 보기 링크 */}
        <Link
          to={`/community/${post.id}`}
          className="
            text-sm font-semibold text-smu-navy
            group-hover:text-smu-black transition
            inline-flex items-center gap-1
          "
        >
          자세히 보기 <span>→</span>
        </Link>

        {/* 오른쪽: 추천 + 댓글 */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onLike(post.id)}
            className="
              inline-flex items-center gap-1.5
              text-sm text-smu-gray
              hover:text-smu-navy
              transition focus:outline-none
            "
            aria-label="like"
          >
            <ThumbIcon />
            <span className="font-semibold">{post.likeCount ?? 0}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-sm text-smu-gray">
            <CommentIcon />
            <span className="font-semibold">{post.commentCount ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Icons (SVG, no emoji)
========================= */
function ThumbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 18H4a2 2 0 01-2-2v-6a2 2 0 012-2h3m0 10V8m0 10h9.2a1 1 0 00.98-.8l1.6-8A1 1 0 0019.8 8H14V5a3 3 0 00-3-3l-4 9v7z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 10c0 3.866-3.134 7-7 7a7.003 7.003 0 01-5.288-2.412L2 17l1.588-2.712A6.96 6.96 0 013 10c0-3.866 3.134-7 7-7s7 3.134 7 7z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import api from "@api/api.js";
// import PostReaction from "@components/Reactions/PostReaction";


// /** =========================
//  * 날짜 포맷 유틸 (예: 2026-01-28T02:06:52 -> Jan.28.2026)
//  * ========================= */
// function formatDate(yyyyMmDd) {
//   const [y, m, d] = String(yyyyMmDd || "").split("-").map(Number);
//   const monthNames = [
//     "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
//     "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.",
//   ];
//   if (!y || !m || !d) return yyyyMmDd || "";
//   return `${monthNames[m - 1]}${d}.${y}`;
// }

// /** =========================
//  * 리스트 응답 형태 정규화
//  * - 백엔드가 다양한 형태로 내려줘도 content 배열만 뽑아오는 역할
//  * ========================= */
// function normalizeListResponse(data) {
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.content)) return data.content;          // Page 형태
//   if (Array.isArray(data?.data)) return data.data;                // Wrapper 형태
//   if (Array.isArray(data?.result)) return data.result;            // Wrapper 형태
//   if (Array.isArray(data?.data?.content)) return data.data.content;
//   return [];
// }

// /** createdAt이 ISO("2026-01-28T...")일 수 있어서 앞 10자리만 잘라 YYYY-MM-DD로 */
// function toYmd(createdAtLike) {
//   const s = String(createdAtLike || "");
//   return s.length >= 10 ? s.slice(0, 10) : s;
// }

// export default function CommunityListPage() {
//   const navigate = useNavigate();

//   // 1) 화면에 뿌릴 게시글 목록 상태
//   const [posts, setPosts] = useState([]);

//   // 2) 검색어 상태 (UI + 필터링)
//   const [q, setQ] = useState("");

//   // 3) 로딩/에러/디버그 상태
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [debug, setDebug] = useState("INIT");

//   // 원본 응답 확인용 (문제 생기면 구조 파악하려고)
//   //const [raw, setRaw] = useState(null);
//   // 좋아요/싫어요 요청 중 버튼 연타 방지용 (postId별로 막음)
//   const [busyMap, setBusyMap] = useState({});

//   // 5) 페이지 진입 시 게시글 목록 조회
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         setLoading(true);
//         setErrorMsg("");
//         setDebug("FETCH_STARTED");

//         const res = await api.get("/api/posts");

//         if (cancelled) return;

//         setDebug(`FETCH_SUCCESS_${res.status}`);
//         //setRaw(res.data);

//         const list = normalizeListResponse(res.data);


//         // 6) 서버 응답을 UI에서 쓰기 쉬운 형태로 매핑
//         const mapped = list.map((p) => ({
//           id: String(p.id ?? p.postId ?? ""),
//           title: p.title ?? "",
//           content: p.content ?? "",

//           // author는 객체일 수도 문자열일 수도 있어서 방어적으로 처리
//           author:
//             typeof p.author === "string"
//               ? p.author
//               : (p.author?.nickname ??
//                   p.user?.nickname ??
//                   p.writer?.nickname ??
//                   "unknown"),

//           createdAt: toYmd(p.createdAt ?? p.created_at ?? p.createdDate ?? p.created_date),

//           likeCount: p.likeCount ?? p.like_count ?? p.likes ?? 0,
//           commentCount: p.commentCount ?? p.comment_count ?? p.comments ?? 0,
//         }));

//         // id가 없으면 링크가 깨질 수 있어서 필터
//         const safe = mapped.filter((p) => p.id);

//         setPosts(safe);
//       } catch (e) {
//         if (cancelled) return;

//         const status = e?.response?.status;
//         const data = e?.response?.data;

//         //setRaw(data ?? null);
//         setDebug(`FETCH_FAILED_${status ?? "?"}`);

//         if (status === 401) setErrorMsg("로그인이 필요합니다.");
//         else if (status === 403) setErrorMsg("권한이 없습니다.");
//         else setErrorMsg("게시글을 불러오지 못했습니다.");

//         setPosts([]);
//       } finally {
//         if (!cancelled) setLoading(false);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);


//   // 7) 검색어로 목록 필터링 (제목/내용/작성자)
//   const filtered = useMemo(() => {
//     const keyword = q.trim().toLowerCase();
//     if (!keyword) return posts;

//     return posts.filter((p) => {
//       const t = String(p.title || "").toLowerCase();
//       const c = String(p.content || "").toLowerCase();
//       const a = String(p.author || "").toLowerCase();
//       return t.includes(keyword) || c.includes(keyword) || a.includes(keyword);
//     });
//   }, [posts, q]);

//   // =========================
//   // 8) 추천(좋아요) 버튼 클릭 핸들러
//   // =========================
//   const syncOnePost = async (postId) => {
//     const res = await api.get(`/api/posts/${postId}`);
//     const p = res.data?.data ?? res.data ?? null;

//     const nextLike = p?.likeCount ?? p?.likes ?? p?.like_count;

//     setPosts((prev) =>
//       prev.map((row) => {
//         if (String(row.id) !== String(postId)) return row;
//         return {
//           ...row,
//           likeCount: nextLike ?? row.likeCount,
//         };
//       })
//     );
//   };


//   const onLike = async (postId) => {
//     try {
//       await api.post(`/api/posts/${postId}/likes`);
//       await syncOnePost(postId); // ✅ 응답 바디가 없으니 GET으로 동기화
//     } catch (e) {
//       alert("추천 실패");
//     }
//   };


//   return (
//     <div className="min-h-screen bg-white">
//       <main className="mx-auto max-w-5xl px-6 py-10">
//         {/* =========================
//             상단 타이틀 + 검색 + 글쓰기 버튼
//         ========================= */}
//         <div className="mb-10 text-center text-xl font-bold text-gray-700">
//           커뮤니티
//         </div>

//         <div className="flex items-center justify-between gap-6">
//           {/* 검색 입력 */}
//           <input
//             className="
//               h-12 w-full rounded-md
//               border border-gray-300 px-4 text-sm
//               outline-none focus:border-gray-400
//             "
//             placeholder="검색어를 입력하세요 (제목/내용/작성자)"
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//           />

//           {/* 글쓰기 이동 */}
//           <button
//             type="button"
//             className="min-w-[110px] rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-300"
//             onClick={() => navigate("/communitywrite")}
//           >
//             글쓰기
//           </button>
//         </div>

//         {/* =========================
//             로딩/에러 메시지
//         ========================= */}
//         <div className="mt-6">
//           {loading ? (
//             <div className="py-10 text-center text-gray-500">불러오는 중...</div>
//           ) : errorMsg ? (
//             <div className="py-10 text-center text-red-600">{errorMsg}</div>
//           ) : null}
//         </div>

//         {/* =========================
//             (선택) 디버그 영역: 서버 응답 구조 확인용
//         ========================= */}
//         {/* <div className="mt-2 text-xs text-gray-500">DEBUG: {debug}</div> */}
//         {/* <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
// {JSON.stringify(raw, null, 2)}
//         </pre> */}

//         {/* =========================
//             게시글 리스트 UI
//             - 작성자, 제목, 내용
//             - 날짜, 추천 수, 댓글 수 표시
//         ========================= */}
//         <div className="mt-4">
//           {filtered.length === 0 && !loading ? (
//             <div className="py-20 text-center text-gray-500">게시글이 없습니다.</div>
//           ) : (
//             filtered.map((post) => (
//               <div key={post.id} className="py-8">
//                 {/* 작성자 */}
//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <span className="material-symbols-outlined text-base">face</span>
//                   <span className="font-semibold text-black">{post.author}</span>
//                 </div>

//                 {/* 제목 */}
//                 <Link
//                   to={`/community/${post.id}`}
//                   className="mt-3 block text-xl font-black !text-black hover:underline"
//                 >
//                   {post.title || "(title 없음)"}
//                 </Link>

//                 {/* 내용 미리보기 */}
//                 <Link
//                   to={`/community/${post.id}`}
//                   className="mt-2 block whitespace-pre-wrap !text-black text-gray-500 hover:underline"
//                 >
//                   {post.content || "(content 없음)"}
//                 </Link>

//                 {/* 우측 하단 메타정보: 날짜/추천/댓글 */}
//                 <div className="mt-5 flex items-center justify-end">
//                   <div className="flex items-center gap-10 text-sm text-gray-500">
//                     <span>{formatDate(post.createdAt)}</span>

//                     <button
//                       type="button"
//                       onClick={() => onLike(post.id)}
//                       className="
//                         bg-transparent p-0 border-0 text-gray-500
//                         hover:text-black focus:outline-none
//                       "
//                       aria-label="like"
//                     >
//                       추천 {post.likeCount ?? 0}
//                     </button>

//                     <span>댓글 {post.commentCount ?? 0}</span>
//                   </div>
//                 </div>

//                 {/* 구분선 */}
//                 <div className="mt-8 h-px w-full bg-gray-200" />
//               </div>
//             ))
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
