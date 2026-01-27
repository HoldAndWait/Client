// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// function formatDate(yyyyMmDd) {
//   const [y, m, d] = String(yyyyMmDd || "").split("-").map(Number);
//   const monthNames = [
//     "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
//     "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
//   ];
//   if (!y || !m || !d) return yyyyMmDd || "";
//   return `${monthNames[m - 1]}${d}.${y}`;
// }

// function normalizeListResponse(data) {
//   // ✅ 백엔드가 리스트를 주는 흔한 형태들을 모두 커버:
//   // 1) Array: [ {...}, {...} ]
//   // 2) Page: { content: [...] }
//   // 3) Wrapper: { data: [...] } / { result: [...] }
//   if (Array.isArray(data)) return data;
//   if (Array.isArray(data?.content)) return data.content;
//   if (Array.isArray(data?.data)) return data.data;
//   if (Array.isArray(data?.result)) return data.result;
//   return [];
// }

// function toYmd(createdAtLike) {
//   // createdAt이 "2026-01-26T..." 또는 "2026-01-26" 등 다양할 수 있어서 앞 10자리만
//   const s = String(createdAtLike || "");
//   return s.length >= 10 ? s.slice(0, 10) : s;
// }

// export default function CommunityListPage() {
//   console.log("🔥 CommunityListPage FILE LOADED v2");

//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   // ✅ 임시: onLike가 아직 없으면 렌더 에러 나므로 안전하게 처리
//   const onLike = async (postId) => {
//     alert("좋아요 API 연결 전입니다.");
//   };

//   useEffect(() => {
//     console.log("[CommunityListPage] mounted", new Date().toISOString());
//   }, []);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       setLoading(true);
//       setErrorMsg("");

//       try {
//         const res = await axios.get("/api/posts", {
//           withCredentials: true, // ✅ 세션/쿠키 OAuth 가능성 고려
//           // JWT 방식이면 여기서 Authorization 넣거나 axios instance에서 처리
//         });

//         console.log("RAW res.data =", res.data);

//         const rawList = normalizeListResponse(res.data);
//         console.log("rawList length =", rawList.length, "first =", rawList[0]);

//         setPosts(rawList); // ✅ 일단 매핑 없이 그대로 넣어보기(임시)


//         // 디버깅용: 실제로 어떤 응답이 오는지 확인
//         console.log("[GET /api/posts] status:", res.status);
//         console.log("[GET /api/posts] data:", res.data);

//         const rawList = normalizeListResponse(res.data);

//         const mapped = rawList.map((p) => ({
//           id: String(p.id ?? p.postId ?? ""),
//           author:
//             typeof p.author === "string"
//               ? p.author
//               : (p.author?.nickname ??
//                  p.user?.nickname ??
//                  p.writer?.nickname ??
//                  "unknown"),
//           title: p.title ?? "",
//           content: p.content ?? "",
//           createdAt: toYmd(p.createdAt ?? p.created_at ?? p.createdDate ?? p.created_date),
//           likeCount: p.likeCount ?? p.like_count ?? p.likes ?? 0,
//           commentCount: p.commentCount ?? p.comment_count ?? p.comments ?? 0,
//         }));

//         // id가 비어있는 데이터가 있으면 렌더/링크가 깨지므로 필터
//         const safe = mapped.filter((p) => p.id && p.title);

//         setPosts(safe);
//       } catch (err) {
//         const status = err?.response?.status;
//         console.error("[GET /api/posts] failed:", err);

//         if (status === 401) {
//           setErrorMsg("로그인이 필요합니다. 로그인 후 다시 시도해 주세요.");
//         } else if (status === 403) {
//           setErrorMsg("권한이 없습니다.");
//         } else {
//           setErrorMsg("게시글을 불러오지 못했습니다.");
//         }
//         setPosts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

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

//   return (
//     <div className="min-h-screen bg-white">
//       <main className="mx-auto max-w-5xl px-6 py-10">
//         <div className="mb-10 text-center text-xl font-bold text-gray-700">
//           커뮤니티
//         </div>

//         <div className="flex items-center justify-between gap-6">
//           <input
//             className="
//               h-20 w-[720px] rounded-full
//               border border-gray-300 px-10 text-xl
//               outline-none focus:border-gray-400
//             "
//             placeholder="검색어를 입력하세요"
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//           />

//           <button
//             type="button"
//             className="min-w-[110px] rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold"
//             onClick={() => {}}
//           >
//             검색
//           </button>

//           <button
//             type="button"
//             className="min-w-[110px] rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold"
//             onClick={() => navigate("/communitywrite")}
//           >
//             글쓰기
//           </button>
//         </div>

//         <div className="mt-6">
//           {loading ? (
//             <div className="py-10 text-center text-gray-500">불러오는 중...</div>
//           ) : errorMsg ? (
//             <div className="py-10 text-center text-red-600">{errorMsg}</div>
//           ) : null}
//         </div>

//         {/* 리스트 */}
//         <div className="mt-4">
//           {filtered.length === 0 && !loading ? (
//             <div className="py-20 text-center text-gray-500">
//               게시글이 없습니다.
//             </div>
//           ) : (
//             filtered.map((post) => (
//               <div key={post.id} className="py-8">
//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <span>👤</span>
//                   <span className="font-semibold text-black">{post.author}</span>
//                 </div>

//                 <Link
//                   to={`/community/${post.id}`}
//                   className="mt-3 block text-xl font-black !text-black hover:underline"
//                 >
//                   {post.title}
//                 </Link>

//                 <Link
//                   to={`/community/${post.id}`}
//                   className="mt-2 block whitespace-pre-wrap !text-black text-gray-500 hover:underline"
//                 >
//                   {post.content}
//                 </Link>

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

//                 <div className="mt-8 h-px w-full bg-gray-200" />
//               </div>
//             ))
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@api/api.js";


export default function CommunityListPage() {

  const navigate = useNavigate();
  const [raw, setRaw] = useState(null);
  const [posts, setPosts] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [debug, setDebug] = useState("INIT");


  useEffect(() => {
    setDebug("EFFECT_STARTED");

    (async () => {
      try {
        const res = await api.get("/api/posts");
        setDebug("GET_SUCCESS");
        console.log("✅ GET status:", res.status);
        console.log("✅ GET data:", res.data);

        setRaw(res.data);

        // 일단 가장 흔한 케이스만:
        const list =
          Array.isArray(res.data) ? res.data :
          Array.isArray(res.data?.content) ? res.data.content :
          Array.isArray(res.data?.data) ? res.data.data :
          Array.isArray(res.data?.result) ? res.data.result :
          Array.isArray(res.data?.data?.content) ? res.data.data.content :
          [];

        console.log("✅ parsed list length:", list.length);
        setPosts(list);
      } catch (e) {
        setDebug("GET_FAILED");
        console.log("❌ GET failed:", e?.response?.status, e?.response?.data, e);
        setErrMsg("불러오기 실패");
        setPosts([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          
          <div className="text-xl font-bold text-gray-700">커뮤니티</div>

          <button
            className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold"
            onClick={() => navigate("/communitywrite")}
          >
            글쓰기
          </button>
        </div>

        {errMsg ? (
          <div className="py-6 text-center text-red-600">{errMsg}</div>
        ) : null}

        {/* ✅ 응답 구조 확인용 (임시) */}
        <pre className="mb-6 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
{JSON.stringify(raw, null, 2)}
        </pre>

        <div className="mb-2 text-xs text-gray-500">DEBUG: {debug}</div>

        <div className="mt-6">
          {posts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              게시글이 없습니다.
            </div>
          ) : (
            posts.map((p, idx) => (
              <div key={p.id ?? p.postId ?? idx} className="py-6">
                <Link
                  to={`/community/${p.id ?? p.postId ?? ""}`}
                  className="block text-lg font-bold text-black hover:underline"
                >
                  {p.title ?? "(title 없음)"}
                </Link>
                <div className="mt-2 text-sm text-gray-600">
                  {p.content ?? "(content 없음)"}
                </div>
                <div className="mt-4 h-px w-full bg-gray-200" />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
