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
import PostReaction from "@components/Reactions/PostReaction";


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
 * - 백엔드가 다양한 형태로 내려줘도 content 배열만 뽑아오는 역할
 * ========================= */
function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;          // Page 형태
  if (Array.isArray(data?.data)) return data.data;                // Wrapper 형태
  if (Array.isArray(data?.result)) return data.result;            // Wrapper 형태
  if (Array.isArray(data?.data?.content)) return data.data.content;
  return [];
}

/** createdAt이 ISO("2026-01-28T...")일 수 있어서 앞 10자리만 잘라 YYYY-MM-DD로 */
function toYmd(createdAtLike) {
  const s = String(createdAtLike || "");
  return s.length >= 10 ? s.slice(0, 10) : s;
}

export default function CommunityListPage() {
  const navigate = useNavigate();

  // 1) 화면에 뿌릴 게시글 목록 상태
  const [posts, setPosts] = useState([]);

  // 2) 검색어 상태 (UI + 필터링)
  const [q, setQ] = useState("");

  // 3) 로딩/에러/디버그 상태
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [debug, setDebug] = useState("INIT");

  // 원본 응답 확인용 (문제 생기면 구조 파악하려고)
  //const [raw, setRaw] = useState(null);
  // 좋아요/싫어요 요청 중 버튼 연타 방지용 (postId별로 막음)
  const [busyMap, setBusyMap] = useState({});

  // 5) 페이지 진입 시 게시글 목록 조회
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setDebug("FETCH_STARTED");

        const res = await api.get("/api/posts");

        if (cancelled) return;

        setDebug(`FETCH_SUCCESS_${res.status}`);
        //setRaw(res.data);

        const list = normalizeListResponse(res.data);


        // 6) 서버 응답을 UI에서 쓰기 쉬운 형태로 매핑
        const mapped = list.map((p) => ({
          id: String(p.id ?? p.postId ?? ""),
          title: p.title ?? "",
          content: p.content ?? "",

          // author는 객체일 수도 문자열일 수도 있어서 방어적으로 처리
          author:
            typeof p.author === "string"
              ? p.author
              : (p.author?.nickname ??
                  p.user?.nickname ??
                  p.writer?.nickname ??
                  "unknown"),

          createdAt: toYmd(p.createdAt ?? p.created_at ?? p.createdDate ?? p.created_date),

          likeCount: p.likeCount ?? p.like_count ?? p.likes ?? 0,
          commentCount: p.commentCount ?? p.comment_count ?? p.comments ?? 0,
        }));

        // id가 없으면 링크가 깨질 수 있어서 필터
        const safe = mapped.filter((p) => p.id);

        setPosts(safe);
      } catch (e) {
        if (cancelled) return;

        const status = e?.response?.status;
        const data = e?.response?.data;

        //setRaw(data ?? null);
        setDebug(`FETCH_FAILED_${status ?? "?"}`);

        if (status === 401) setErrorMsg("로그인이 필요합니다.");
        else if (status === 403) setErrorMsg("권한이 없습니다.");
        else setErrorMsg("게시글을 불러오지 못했습니다.");

        setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  // 7) 검색어로 목록 필터링 (제목/내용/작성자)
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return posts;

    return posts.filter((p) => {
      const t = String(p.title || "").toLowerCase();
      const c = String(p.content || "").toLowerCase();
      const a = String(p.author || "").toLowerCase();
      return t.includes(keyword) || c.includes(keyword) || a.includes(keyword);
    });
  }, [posts, q]);

  // =========================
  // 8) 추천(좋아요) 버튼 클릭 핸들러
  // =========================
  const syncOnePost = async (postId) => {
    const res = await api.get(`/api/posts/${postId}`);
    const p = res.data?.data ?? res.data ?? null;

    const nextLike = p?.likeCount ?? p?.likes ?? p?.like_count;

    setPosts((prev) =>
      prev.map((row) => {
        if (String(row.id) !== String(postId)) return row;
        return {
          ...row,
          likeCount: nextLike ?? row.likeCount,
        };
      })
    );
  };


  const onLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/likes`);
      await syncOnePost(postId); // ✅ 응답 바디가 없으니 GET으로 동기화
    } catch (e) {
      alert("추천 실패");
    }
  };


  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* =========================
            상단 타이틀 + 검색 + 글쓰기 버튼
        ========================= */}
        <div className="mb-10 text-center text-xl font-bold text-gray-700">
          커뮤니티
        </div>

        <div className="flex items-center justify-between gap-6">
          {/* 검색 입력 */}
          <input
            className="
              h-12 w-full rounded-md
              border border-gray-300 px-4 text-sm
              outline-none focus:border-gray-400
            "
            placeholder="검색어를 입력하세요 (제목/내용/작성자)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          {/* 글쓰기 이동 */}
          <button
            type="button"
            className="min-w-[110px] rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold hover:bg-gray-300"
            onClick={() => navigate("/communitywrite")}
          >
            글쓰기
          </button>
        </div>

        {/* =========================
            로딩/에러 메시지
        ========================= */}
        <div className="mt-6">
          {loading ? (
            <div className="py-10 text-center text-gray-500">불러오는 중...</div>
          ) : errorMsg ? (
            <div className="py-10 text-center text-red-600">{errorMsg}</div>
          ) : null}
        </div>

        {/* =========================
            (선택) 디버그 영역: 서버 응답 구조 확인용
        ========================= */}
        {/* <div className="mt-2 text-xs text-gray-500">DEBUG: {debug}</div> */}
        {/* <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
{JSON.stringify(raw, null, 2)}
        </pre> */}

        {/* =========================
            게시글 리스트 UI
            - 작성자, 제목, 내용
            - 날짜, 추천 수, 댓글 수 표시
        ========================= */}
        <div className="mt-4">
          {filtered.length === 0 && !loading ? (
            <div className="py-20 text-center text-gray-500">게시글이 없습니다.</div>
          ) : (
            filtered.map((post) => (
              <div key={post.id} className="py-8">
                {/* 작성자 */}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="material-symbols-outlined text-base">face</span>
                  <span className="font-semibold text-black">{post.author}</span>
                </div>

                {/* 제목 */}
                <Link
                  to={`/community/${post.id}`}
                  className="mt-3 block text-xl font-black !text-black hover:underline"
                >
                  {post.title || "(title 없음)"}
                </Link>

                {/* 내용 미리보기 */}
                <Link
                  to={`/community/${post.id}`}
                  className="mt-2 block whitespace-pre-wrap !text-black text-gray-500 hover:underline"
                >
                  {post.content || "(content 없음)"}
                </Link>

                {/* 우측 하단 메타정보: 날짜/추천/댓글 */}
                <div className="mt-5 flex items-center justify-end">
                  <div className="flex items-center gap-10 text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>

                    <button
                      type="button"
                      onClick={() => onLike(post.id)}
                      className="
                        bg-transparent p-0 border-0 text-gray-500
                        hover:text-black focus:outline-none
                      "
                      aria-label="like"
                    >
                      추천 {post.likeCount ?? 0}
                    </button>

                    <span>댓글 {post.commentCount ?? 0}</span>
                  </div>
                </div>

                {/* 구분선 */}
                <div className="mt-8 h-px w-full bg-gray-200" />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
