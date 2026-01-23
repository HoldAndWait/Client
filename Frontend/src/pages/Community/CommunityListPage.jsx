// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// /**
//  * localStorage keys
//  */
// const LS_POSTS = "community_posts_v1";


// const SEED_POSTS = [
//   {
//     id: "1",
//     author: "zelsa",
//     title: "SSAFY VS SKALA",
//     content: "둘 다 붙으면 어디를 가는 게 좋을까요?\n의견 부탁드립니다!",
//     createdAt: "2024-11-11",
//     likeCount: 2,
//     commentCount: 1,
//   },
//   {
//     id: "2",
//     author: "zelsa",
//     title: "SSAFY VS SKALA",
//     content: "둘 다 붙으면 어디를 가는 게 좋을까요?\n(중복 테스트)",
//     createdAt: "2024-11-11",
//     likeCount: 2,
//     commentCount: 1,
//   },
//   {
//     id: "3",
//     author: "zelsa",
//     title: "SSAFY VS SKALA",
//     content: "둘 다 붙으면 어디를 가는 게 좋을까요?\n(리스트 UI 테스트)",
//     createdAt: "2024-11-11",
//     likeCount: 2,
//     commentCount: 0,
//   },
// ];

// function loadPosts() {
//   const raw = localStorage.getItem(LS_POSTS);
//   if (!raw) {
//     localStorage.setItem(LS_POSTS, JSON.stringify(SEED_POSTS));
//     return SEED_POSTS;
//   }
//   try {
//     const parsed = JSON.parse(raw);
//     return Array.isArray(parsed) ? parsed : [];
//   } catch {
//     return [];
//   }
// }

// function savePosts(posts) {
//   localStorage.setItem(LS_POSTS, JSON.stringify(posts));
// }

// function formatDate(yyyyMmDd) {
//   const [y, m, d] = yyyyMmDd.split("-").map(Number);
//   const monthNames = [
//     "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
//     "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
//   ];
//   if (!y || !m || !d) return yyyyMmDd;
//   return `${monthNames[m - 1]}${d}.${y}`;
// }

// export default function CommunityListPage() {
//   const navigate = useNavigate();
//   const [posts, setPosts] = useState([]);
//   const [q, setQ] = useState(""); 

//   useEffect(() => {
//     setPosts(loadPosts());
//   }, []);

//   const onLike = (postId) => {
//     const next = posts.map((p) =>
//       String(p.id) === String(postId)
//         ? { ...p, likeCount: (p.likeCount ?? 0) + 1 }
//         : p
//     );
//     setPosts(next);
//     savePosts(next);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       <main className="mx-auto max-w-5xl px-6 py-10">
//         <div className="mb-10 text-center text-xl font-bold text-gray-700">
//           커뮤니티
//         </div>

//         <div className="flex items-center justify-between gap-6">

//           <input
//             className="
//               h-20
//               w-[720px]
//               rounded-full
//               border border-gray-300
//               px-10
//               text-xl
//               outline-none
//               focus:border-gray-400
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

//         {/* 리스트 */}
//         <div className="mt-10">
//           {posts.length === 0 ? (
//             <div className="py-20 text-center text-gray-500">
//               게시글이 없습니다.
//             </div>
//           ) : (
//             posts.map((post) => (
//               <div key={post.id} className="py-8">

//                 <div className="flex items-center gap-2 text-sm text-gray-500">
//                   <span>👤</span>
//                   <span className="font-semibold text-black">{post.author}</span>
//                 </div>

//                 <Link
//                   to={`/community/${post.id}`}
//                   className="mt-3 block text-xl font-black !text-black text-black hover:underline"
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
//                         bg-transparent
//                         p-0
//                         border-0
//                         text-gray-500
//                         hover:text-black
//                         focus:outline-none
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

/**
 * localStorage keys
 */
const LS_POSTS = "community_posts_v1";


const SEED_POSTS = [
  {
    id: "1",
    author: "zelsa",
    title: "SSAFY VS SKALA",
    content: "둘 다 붙으면 어디를 가는 게 좋을까요?\n의견 부탁드립니다!",
    createdAt: "2024-11-11",
    likeCount: 2,
    commentCount: 1,
  },
  {
    id: "2",
    author: "zelsa",
    title: "SSAFY VS SKALA",
    content: "둘 다 붙으면 어디를 가는 게 좋을까요?\n(중복 테스트)",
    createdAt: "2024-11-11",
    likeCount: 2,
    commentCount: 1,
  },
  {
    id: "3",
    author: "zelsa",
    title: "SSAFY VS SKALA",
    content: "둘 다 붙으면 어디를 가는 게 좋을까요?\n(리스트 UI 테스트)",
    createdAt: "2024-11-11",
    likeCount: 2,
    commentCount: 0,
  },
];

function loadPosts() {
  const raw = localStorage.getItem(LS_POSTS);
  if (!raw) {
    localStorage.setItem(LS_POSTS, JSON.stringify(SEED_POSTS));
    return SEED_POSTS;
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(LS_POSTS, JSON.stringify(posts));
}

function formatDate(yyyyMmDd) {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  const monthNames = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."
  ];
  if (!y || !m || !d) return yyyyMmDd;
  return `${monthNames[m - 1]}${d}.${y}`;
}

export default function CommunityListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState(""); 

  useEffect(() => {
    console.log("[CommunityListPage] mounted", new Date().toISOString());
  }, []);


  useEffect(() => {
  (async () => {
    try {
      const res = await fetch("/api/posts"); // nginx가 backend로 프록시
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // ✅ 서버 응답 형태에 맞게 매핑 (필드명은 실제 응답 보고 조정)
      const mapped = (Array.isArray(data) ? data : data?.content ?? []).map((p) => ({
        id: String(p.id),
        author:
        typeof p.author === "string"
          ? p.author
          : (p.author?.nickname ?? p.user?.nickname ?? "unknown"),
        title: p.title,
        content: p.content,
        createdAt: (p.createdAt ?? p.created_at ?? "").slice(0, 10), // "YYYY-MM-DD"
        likeCount: p.likeCount ?? p.like_count ?? 0,
        commentCount: p.commentCount ?? p.comment_count ?? 0,
      }));

      setPosts(mapped);
    } catch (e) {
      console.error("Failed to load posts:", e);
      // 서버 장애 시 임시 데이터 fallback 쓰고 싶으면 아래 주석 해제
      // setPosts(loadPosts());
      setPosts([]);
    }
  })();
}, []);


  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 text-center text-xl font-bold text-gray-700">
          커뮤니티
        </div>

        <div className="flex items-center justify-between gap-6">

          <input
            className="
              h-20
              w-[720px]
              rounded-full
              border border-gray-300
              px-10
              text-xl
              outline-none
              focus:border-gray-400
            "
            placeholder="검색어를 입력하세요"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button
            type="button"
            className="min-w-[110px] rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold"
            onClick={() => {}}
          >
            검색
          </button>

          <button
            type="button"
            className="min-w-[110px] rounded-md bg-gray-200 px-4 py-3 text-sm font-semibold"
            onClick={() => navigate("/communitywrite")}
          >
            글쓰기
          </button>
        </div>

        {/* 리스트 */}
        <div className="mt-10">
          {posts.length === 0 ? (
            <div className="py-20 text-center text-gray-500">
              게시글이 없습니다.
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="py-8">

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>👤</span>
                  <span className="font-semibold text-black">{post.author}</span>
                </div>

                <Link
                  to={`/community/${post.id}`}
                  className="mt-3 block text-xl font-black !text-black text-black hover:underline"
                >
                  {post.title}
                </Link>

                <Link
                  to={`/community/${post.id}`}
                  className="mt-2 block whitespace-pre-wrap !text-black text-gray-500 hover:underline"
                >
                  {post.content}
                </Link>

                <div className="mt-5 flex items-center justify-end">
                  <div className="flex items-center gap-10 text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>

                    <button
                      type="button"
                      onClick={() => onLike(post.id)}
                      className="
                        bg-transparent
                        p-0
                        border-0
                        text-gray-500
                        hover:text-black
                        focus:outline-none
                      "
                      aria-label="like"
                    >
                      추천 {post.likeCount ?? 0}
                    </button>

                    <span>댓글 {post.commentCount ?? 0}</span>
                  </div>
                </div>

                <div className="mt-8 h-px w-full bg-gray-200" />
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}