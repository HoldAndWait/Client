// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import api from "@api/api.js";
// import PostReaction from "@components/Reactions/PostReaction";
// import CommentsSection from "@components/PostComments/CommentsSection";


// const ghostBtn =
//   "bg-transparent flex items-center gap-1 p-0 border-0 outline-none focus:outline-none text-gray-500 hover:text-black";

// /** =========================
//  *  날짜 포맷(한국 시간, "2026. 1. 28. 오전 11:00")
//  * ========================= */
// function formatKST(iso) {
//   if (!iso) return "";
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return String(iso);
//   return new Intl.DateTimeFormat("ko-KR", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   }).format(d);
// }

// export default function CommunityDetailPage() {
//   const { postId } = useParams();
//   const navigate = useNavigate();

//     /** =========================
//    * 조회 결과 상태
//    * - raw: 서버 응답 원본(디버깅용)
//    * - post: 화면에 뿌릴 게시글 데이터
//    * - errMsg/debug: 에러/상태 표시(문제 생길 때 원인 추적)
//    * ========================= */
//   const [raw, setRaw] = useState(null);
//   const [post, setPost] = useState(null);
//   const [errMsg, setErrMsg] = useState("");
//   const [debug, setDebug] = useState("INIT");

//   /** =========================
//    * 3) 댓글 입력 상태 (아직 API 연결 전)
//    * ========================= */
//   const [commentText, setCommentText] = useState("");

//    /** =========================
//    * 요청 중복/경합 방지용 AbortController 보관
//    * - React StrictMode/dev 환경에서는 effect가 2번 도는 일이 흔함
//    * - 이전 요청을 abort 해서 "success 후 fail" 같은 이상한 로그/상태를 줄임
//    * ========================= */
//   const abortRef = useRef(null);

//   /** =========================
//    * 내 정보(me) + 삭제 진행 상태
//    * - me: 현재 로그인한 사용자 정보 (작성자 본인 여부 판별용)
//    * - isDeleting: 삭제 버튼 중복 클릭 방지
//    * ========================= */
//   const [me, setMe] = useState(null);
//   const [isDeleting, setIsDeleting] = useState(false);

//   const { loading: reactionLoading, like, dislike } = PostReaction({ postId });


//   // "내 정보 조회" - 작성자 본인인지 판단하기 위해 필요
//   useEffect(() => {
//     let cancelled = false;

//     (async () => {
//       try {
//         const res = await api.get("/api/users/me");
//         if (cancelled) return;

//         // ✅ 응답 형태 방어: res.data 혹은 res.data.data
//         const meObj = res.data?.data ?? res.data ?? null;
//         setMe(meObj);
//       } catch (e) {
//         if (cancelled) return;
//         console.log("[ME] failed", e?.response?.status, e?.response?.data);
//         setMe(null);
//       }
//     })();

//     return () => {
//       cancelled = true;
//     };
//   }, []);


//   // 여기는 게시글 상세 조회
//   useEffect(() => {
//     if (!postId) return;

//     // ✅ 이전 요청이 살아있으면 중단
//     if (abortRef.current) {
//       abortRef.current.abort();
//     }
//     const controller = new AbortController();
//     abortRef.current = controller;

//     const reqId = `${postId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
//     console.log(`[DETAIL] start reqId=${reqId} postId=${postId}`);

//     setDebug("EFFECT_STARTED");
//     setErrMsg("");

//     (async () => {
//       try {
//         const res = await api.get(`/api/posts/${postId}`, {
//           signal: controller.signal, // ✅ axios(v1+) abort 지원
//         });

//         console.log(`[DETAIL] success reqId=${reqId} status=${res.status}`);

//         // ✅ 이 요청이 이미 abort 되었으면 반영 X
//         if (controller.signal.aborted) return;

//         setDebug("GET_SUCCESS");
//         setRaw(res.data);
//         setPost(res.data ?? null);
//         setErrMsg("");
//       } catch (e) {
//         // ✅ abort/취소는 "실패"로 처리하지 않음
//         const aborted =
//           controller.signal.aborted ||
//           e?.code === "ERR_CANCELED" ||
//           e?.name === "CanceledError";

//         if (aborted) {
//           console.log(`[DETAIL] aborted reqId=${reqId}`);
//           return;
//         }

//         const status = e?.response?.status;
//         const data = e?.response?.data;
//         console.log(`[DETAIL] fail reqId=${reqId} status=${status}`, data);

//         setDebug(`GET_FAILED_${status ?? "?"}`);
//         setErrMsg(`게시글을 불러오지 못했습니다. (status=${status ?? "?"})`);
//         setRaw(data ?? null);
//         setPost(null);
//       }
//     })();

//     // ✅ cleanup에서 해당 요청 abort
//     return () => {
//       controller.abort();
//       console.log(`[DETAIL] cleanup(abort) reqId=${reqId}`);
//     };
//   }, [postId]);
  
  
//   const commentCount = useMemo(() => (post?.comments?.length ?? 0), [post]);



//   /** =========================
//    * (권한) "내가 작성자인지" 판별
//    * - me.id vs post.author.id 비교
//    * - 둘 다 문자열로 바꿔 비교(타입 차이 방지)
//    * ========================= */
//   const isMine = useMemo(() => {
//     const myId = me?.id ?? me?.userId;
//     const authorId = post?.author?.id ?? post?.authorId;
//     return !!myId && !!authorId && String(myId) === String(authorId);
//   }, [me, post]);


//    /** =========================
//    *  게시글 삭제
//    * ========================= */
//   const onClickDelete = async () => {
//     if (!postId) return;

//     const ok = window.confirm("정말 삭제할까요?");
//     if (!ok) return;

//     setIsDeleting(true);
//     try {
//       await api.delete(`/api/posts/${postId}`);
//       alert("삭제되었습니다.");
//       navigate("/community");
//     } catch (e) {
//       const status = e?.response?.status;
//       const data = e?.response?.data;
//       alert(
//         `삭제 실패 (status=${status ?? "?"})\n` +
//           (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || e.message)
//       );
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//    /** =========================
//    *  좋아요, 싫어요 클릭
//    * ========================= */
//   const fetchPost = async () => {
//     const res = await api.get(`/api/posts/${postId}`);
//     setPost(res.data ?? null);
//   };

//   const applyReactionResult = async(result) => {
//     if (!result?.ok) {
//       alert(
//         `반응 실패 (status=${result?.error?.status ?? "?"})\n` +
//           (result?.error?.message ?? "unknown error")
//       );
//       return;
//     }

//     // ✅ 1) 서버가 카운트를 내려줬다면 그걸로 즉시 반영
//   const hasCounts = result.nextLike != null || result.nextDislike != null;

//     if (hasCounts) {
//       setPost((prev) => {
//         if (!prev) return prev;
//         return {
//           ...prev,
//           likeCount: result.nextLike != null ? result.nextLike : prev.likeCount,
//           dislikeCount:
//             result.nextDislike != null ? result.nextDislike : prev.dislikeCount,
//         };
//       });
//       return;
//     }

//     // ✅ 2) 서버가 카운트를 안 주면(빈 바디/204) → GET로 다시 동기화 (정답)
//     await fetchPost();
//   };

//   const onClickLikePost = async () => {
//     const result = await like();
//     applyReactionResult(result);
//   };

//   const onClickDislikePost = async () => {
//     const result = await dislike();
//     applyReactionResult(result);
//   };


//  /** =========================
//    * 에러 화면
//    * - 상세 조회 실패 시 보여줌
//    * ========================= */
//   if (errMsg) {
//     return (
//       <div className="min-h-screen bg-white">
//         <main className="mx-auto max-w-5xl px-6 py-10">
//           <div className="py-20 text-center text-red-600 whitespace-pre-wrap">{errMsg}</div>
//           <div className="flex justify-center">
//             <button
//               className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
//               onClick={() => navigate("/community")}
//             >
//               목록으로
//             </button>
//           </div>

//           <div className="mt-6 text-xs text-gray-500">DEBUG: {debug}</div>
//           <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
//             {JSON.stringify(raw, null, 2)}
//           </pre>
//         </main>
//       </div>
//     );
//   }

//    /** =========================
//    * 로딩 화면
//    * - post가 아직 없으면 "불러오는 중..."
//    * ========================= */
//   if (!post) {
//     return (
//       <div className="min-h-screen bg-white">
//         <main className="mx-auto max-w-5xl px-6 py-10">
//           <div className="py-20 text-center text-gray-500">불러오는 중...</div>

//           <div className="mt-6 text-xs text-gray-500">DEBUG: {debug}</div>
//           <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
//             {JSON.stringify(raw, null, 2)}
//           </pre>
//         </main>
//       </div>
//     );
//   }



//   const authorNickname = post?.author?.nickname ?? "(author 없음)";
//   const createdAtText = formatKST(post?.createdAt);
//   const updatedAtText = formatKST(post?.updatedAt);

//   return (
//     <div className="min-h-screen bg-white">
//       <main className="mx-auto max-w-5xl px-6 py-10">
//         <div className="mb-6 flex items-center gap-3 text-gray-600">
//           <Link to="/community" className="hover:text-black">
//             ←
//           </Link>
//           <div className="text-xl font-bold text-gray-800">커뮤니티 게시글</div>
//         </div>

//         <div className="rounded-lg border bg-white p-10">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//               <span className="material-symbols-outlined">face</span>
//               <span className="font-semibold text-gray-700">{authorNickname}</span>
//               <span className="ml-3">{createdAtText}</span>
//               {updatedAtText ? (
//                 <span className="ml-2 text-gray-400">(수정 {updatedAtText})</span>
//               ) : null}
//             </div>

//             <div className="flex items-center gap-4 text-sm text-gray-500">
//               <button
//                 type="button"
//                 className={ghostBtn}
//                 onClick={onClickLikePost}
//                 disabled={reactionLoading}
//                 title="추천"
//               >
//                 <span className="material-symbols-outlined">thumb_up</span>
//                 {post.likeCount ?? 0}
//               </button>

//               <button
//                 type="button"
//                 className={ghostBtn}
//                 onClick={onClickDislikePost}
//                 disabled={reactionLoading}
//                 title="비추천"
//               >
//                 <span className="material-symbols-outlined">thumb_down</span>
//                 {post.dislikeCount ?? 0}
//               </button>

//               <div className="text-gray-500 flex items-center gap-1">
//                 <span className="material-symbols-outlined">comment</span>
//                 {commentCount}
//               </div>

//               {isMine ? (
//                 <button
//                   type="button"
//                   className={ghostBtn}
//                   onClick={() => navigate(`/community/${postId}/edit`)}
//                   title="수정"
//                 >
//                   <span className="material-symbols-outlined">edit</span>
//                 </button>
//               ) : null}

//               {isMine ? (
//                 <button
//                   type="button"
//                   className={ghostBtn}
//                   onClick={onClickDelete}
//                   disabled={isDeleting}
//                   title="삭제"
//                 >
//                   <span className="material-symbols-outlined">delete</span>
//                 </button>
//               ) : null}
//             </div>
//           </div>

//           <h1 className="mt-4 text-xl font-black text-gray-900">
//             {post.title ?? "(title 없음)"}
//           </h1>

//           <div className="mt-6 whitespace-pre-wrap leading-7 text-gray-800">
//             {post.content ?? "(content 없음)"}
//           </div>

          
//           <CommentsSection
//             postId={postId}
//             comments={post?.comments ?? []}
//             onRefreshPost={fetchPost}
//           />



//           {/* 디버깅용 */}
//           {/* <div className="mt-8 text-xs text-gray-500">DEBUG: {debug}</div>
//           <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
//             {JSON.stringify(raw, null, 2)}
//           </pre> */}
//         </div>
//       </main>
//     </div>
//   );
// }




import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@api/api.js";
import PostReaction from "@components/Reactions/PostReaction";
import CommentsSection from "@components/PostComments/CommentsSection";

const ghostBtn =
  "bg-transparent flex items-center gap-1.5 p-0 border-0 outline-none focus:outline-none text-smu-gray hover:text-smu-black transition";

/** =========================
 *  날짜 포맷(한국 시간)
 * ========================= */
function formatKST(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

export default function CommunityDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [raw, setRaw] = useState(null);
  const [post, setPost] = useState(null);
  const [errMsg, setErrMsg] = useState("");
  const [debug, setDebug] = useState("INIT");
  const [commentText, setCommentText] = useState("");
  const abortRef = useRef(null);
  const [me, setMe] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { loading: reactionLoading, like, dislike } = PostReaction({ postId });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/api/users/me");
        if (cancelled) return;
        const meObj = res.data?.data ?? res.data ?? null;
        setMe(meObj);
      } catch (e) {
        if (cancelled) return;
        setMe(null);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!postId) return;
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setDebug("EFFECT_STARTED");
    setErrMsg("");

    (async () => {
      try {
        const res = await api.get(`/api/posts/${postId}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setDebug("GET_SUCCESS");
        setRaw(res.data);
        setPost(res.data ?? null);
        setErrMsg("");
      } catch (e) {
        const aborted =
          controller.signal.aborted ||
          e?.code === "ERR_CANCELED" ||
          e?.name === "CanceledError";
        if (aborted) return;
        const status = e?.response?.status;
        setDebug(`GET_FAILED_${status ?? "?"}`);
        setErrMsg(`게시글을 불러오지 못했습니다. (status=${status ?? "?"})`);
        setRaw(e?.response?.data ?? null);
        setPost(null);
      }
    })();

    return () => { controller.abort(); };
  }, [postId]);

  const commentCount = useMemo(() => (post?.comments?.length ?? 0), [post]);

  const isMine = useMemo(() => {
    const myId = me?.id ?? me?.userId;
    const authorId = post?.author?.id ?? post?.authorId;
    return !!myId && !!authorId && String(myId) === String(authorId);
  }, [me, post]);

  const onClickDelete = async () => {
    if (!postId) return;
    const ok = window.confirm("정말 삭제할까요?");
    if (!ok) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/posts/${postId}`);
      alert("삭제되었습니다.");
      navigate("/community");
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;
      alert(
        `삭제 실패 (status=${status ?? "?"})\n` +
          (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || e.message)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchPost = async () => {
    const res = await api.get(`/api/posts/${postId}`);
    setPost(res.data ?? null);
  };

  const applyReactionResult = async (result) => {
    if (!result?.ok) {
      alert(
        `반응 실패 (status=${result?.error?.status ?? "?"})\n` +
          (result?.error?.message ?? "unknown error")
      );
      return;
    }
    const hasCounts = result.nextLike != null || result.nextDislike != null;
    if (hasCounts) {
      setPost((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          likeCount: result.nextLike != null ? result.nextLike : prev.likeCount,
          dislikeCount: result.nextDislike != null ? result.nextDislike : prev.dislikeCount,
        };
      });
      return;
    }
    await fetchPost();
  };

  const onClickLikePost = async () => { applyReactionResult(await like()); };
  const onClickDislikePost = async () => { applyReactionResult(await dislike()); };

  /* ===== 에러 화면 ===== */
  if (errMsg) {
    return (
      <div className="w-full min-h-screen bg-smu-base">
        <main className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="py-20 text-center text-red-500 font-semibold whitespace-pre-wrap">
            {errMsg}
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-smu-navy text-smu-base font-semibold text-sm hover:bg-smu-neonlime hover:text-smu-black transition"
              onClick={() => navigate("/community")}
            >
              ← 목록으로
            </button>
          </div>
          <div className="mt-6 text-xs text-smu-gray">DEBUG: {debug}</div>
          <pre className="mt-3 overflow-auto rounded-xl bg-white border border-gray-100 p-4 text-xs text-smu-navy">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </main>
      </div>
    );
  }

  /* ===== 로딩 화면 ===== */
  if (!post) {
    return (
      <div className="w-full min-h-screen bg-smu-base">
        <main className="mx-auto max-w-[1200px] px-6 py-14">
          <div className="py-20 text-center text-smu-gray">불러오는 중...</div>
          <div className="mt-6 text-xs text-smu-gray">DEBUG: {debug}</div>
          <pre className="mt-3 overflow-auto rounded-xl bg-white border border-gray-100 p-4 text-xs text-smu-navy">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </main>
      </div>
    );
  }

  const authorNickname = post?.author?.nickname ?? "(author 없음)";
  const createdAtText = formatKST(post?.createdAt);
  const updatedAtText = formatKST(post?.updatedAt);

  return (
    <div className="w-full min-h-screen bg-smu-base text-smu-black">
      <main className="mx-auto max-w-[1200px] px-6 py-14">

        {/* ===== 상단 네비 ===== */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to="/community"
            className="inline-flex items-center gap-2 text-sm font-semibold text-smu-navy hover:text-smu-black transition"
          >
            ← 커뮤니티
          </Link>
          <span className="text-smu-gray text-sm">/</span>
          <span className="text-sm text-smu-gray truncate max-w-xs">
            {post.title ?? "게시글"}
          </span>
        </div>

        {/* ===== 본문 카드 ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          {/* 카드 헤더 */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">

            {/* 제목 */}
            <h1 className="text-2xl font-extrabold text-smu-black leading-snug mb-5">
              {post.title ?? "(title 없음)"}
            </h1>

            {/* 작성자 + 날짜 + 액션 */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* 왼쪽: 아바타 + 이름 + 날짜 */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-smu-navy text-smu-base flex items-center justify-center text-sm font-bold select-none">
                  {String(authorNickname)[0].toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold text-smu-black leading-none">
                    {authorNickname}
                  </div>
                  <div className="text-xs text-smu-gray mt-0.5 flex items-center gap-2">
                    <span>{createdAtText}</span>
                    {updatedAtText && (
                      <span className="text-smu-gray/60">(수정 {updatedAtText})</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 오른쪽: 반응 + 수정/삭제 */}
              <div className="flex items-center gap-5">
                {/* 추천 */}
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={onClickLikePost}
                  disabled={reactionLoading}
                  title="추천"
                >
                  <ThumbUpIcon />
                  <span className="text-sm font-semibold">{post.likeCount ?? 0}</span>
                </button>

                {/* 비추천 */}
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={onClickDislikePost}
                  disabled={reactionLoading}
                  title="비추천"
                >
                  <ThumbDownIcon />
                  <span className="text-sm font-semibold">{post.dislikeCount ?? 0}</span>
                </button>

                {/* 댓글 수 */}
                <span className="flex items-center gap-1.5 text-smu-gray">
                  <CommentIcon />
                  <span className="text-sm font-semibold">{commentCount}</span>
                </span>

                {/* 구분선 */}
                {isMine && (
                  <div className="w-px h-4 bg-gray-200" />
                )}

                {/* 수정 */}
                {isMine && (
                  <button
                    type="button"
                    className={ghostBtn}
                    onClick={() => navigate(`/community/${postId}/edit`)}
                    title="수정"
                  >
                    <EditIcon />
                    <span className="text-sm">수정</span>
                  </button>
                )}

                {/* 삭제 */}
                {isMine && (
                  <button
                    type="button"
                    className={`${ghostBtn} hover:text-red-500`}
                    onClick={onClickDelete}
                    disabled={isDeleting}
                    title="삭제"
                  >
                    <DeleteIcon />
                    <span className="text-sm">삭제</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 본문 */}
          <div className="px-8 py-8">
            <div className="whitespace-pre-wrap leading-8 text-[16px] text-smu-black">
              {post.content ?? "(content 없음)"}
            </div>
          </div>

          {/* 댓글 섹션 구분선 */}
          <div className="mx-8 mb-2 h-px bg-gray-100" />

          {/* 댓글 */}
          <div className="px-8 pb-10 pt-4">
            <CommentsSection
              postId={postId}
              comments={post?.comments ?? []}
              onRefreshPost={fetchPost}
            />
          </div>
        </div>

        {/* ===== 하단 목록 버튼 ===== */}
        <div className="mt-8 flex justify-start">
          <Link
            to="/community"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl
              border border-smu-gray bg-white
              text-sm font-semibold text-smu-navy
              hover:bg-smu-navy hover:text-smu-base hover:border-smu-navy
              transition
            "
          >
            ← 목록으로
          </Link>
        </div>
      </main>
    </div>
  );
}

/* =========================
   SVG Icons
========================= */
function ThumbUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 18H4a2 2 0 01-2-2v-6a2 2 0 012-2h3m0 10V8m0 10h9.2a1 1 0 00.98-.8l1.6-8A1 1 0 0019.8 8H14V5a3 3 0 00-3-3l-4 9v7z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2h3a2 2 0 012 2v6a2 2 0 01-2 2h-3m0-10V12m0-10H3.8a1 1 0 00-.98.8l-1.6 8A1 1 0 002.2 12H8v3a3 3 0 003 3l4-9V2z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 10c0 3.866-3.134 7-7 7a7.003 7.003 0 01-5.288-2.412L2 17l1.588-2.712A6.96 6.96 0 013 10c0-3.866 3.134-7 7-7s7 3.134 7 7z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.7 3.3a1 1 0 011.4 1.4l-9.9 9.9-2.1.7.7-2.1 9.9-9.9z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 17h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 5h14M8 5V3h4v2M6 5l1 12h6l1-12"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}