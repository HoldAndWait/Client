import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@api/api.js";

const ghostBtn =
  "bg-transparent flex items-center gap-1 p-0 border-0 outline-none focus:outline-none text-gray-500 hover:text-black";

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

  // 이전 요청을 abort 하기 위해 controller 저장
  // 요청이 여러번 -> success 만 처리할 수 있도록
  const abortRef = useRef(null);

  const [me, setMe] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 여기는 삭제 처리
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await api.get("/api/users/me");
        if (cancelled) return;

        // ✅ 응답 형태 방어: res.data 혹은 res.data.data
        const meObj = res.data?.data ?? res.data ?? null;
        setMe(meObj);
      } catch (e) {
        if (cancelled) return;
        console.log("[ME] failed", e?.response?.status, e?.response?.data);
        setMe(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);


  // 여기는 조회
  useEffect(() => {
    if (!postId) return;

    // ✅ 이전 요청이 살아있으면 중단
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    const reqId = `${postId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    console.log(`[DETAIL] start reqId=${reqId} postId=${postId}`);

    setDebug("EFFECT_STARTED");
    setErrMsg("");

    (async () => {
      try {
        const res = await api.get(`/api/posts/${postId}`, {
          signal: controller.signal, // ✅ axios(v1+) abort 지원
        });

        console.log(`[DETAIL] success reqId=${reqId} status=${res.status}`);

        // ✅ 이 요청이 이미 abort 되었으면 반영 X
        if (controller.signal.aborted) return;

        setDebug("GET_SUCCESS");
        setRaw(res.data);
        setPost(res.data ?? null);
        setErrMsg("");
      } catch (e) {
        // ✅ abort/취소는 "실패"로 처리하지 않음
        const aborted =
          controller.signal.aborted ||
          e?.code === "ERR_CANCELED" ||
          e?.name === "CanceledError";

        if (aborted) {
          console.log(`[DETAIL] aborted reqId=${reqId}`);
          return;
        }

        const status = e?.response?.status;
        const data = e?.response?.data;
        console.log(`[DETAIL] fail reqId=${reqId} status=${status}`, data);

        setDebug(`GET_FAILED_${status ?? "?"}`);
        setErrMsg(`게시글을 불러오지 못했습니다. (status=${status ?? "?"})`);
        setRaw(data ?? null);
        setPost(null);
      }
    })();

    // ✅ cleanup에서 해당 요청 abort
    return () => {
      controller.abort();
      console.log(`[DETAIL] cleanup(abort) reqId=${reqId}`);
    };
  }, [postId]);
  
  const comments = useMemo(() => post?.comments ?? [], [post]);
  
  const commentCount = useMemo(() => {
    if (typeof post?.commentCount === "number") return post.commentCount;
    return comments.length;
  }, [post, comments]);

  const isMine = useMemo(() => {
    const myId = me?.id ?? me?.userId;
    const authorId = post?.author?.id ?? post?.authorId;
    return !!myId && !!authorId && String(myId) === String(authorId);
  }, [me, post]);


  const onClickDelete = async () => {
    if (!postId) return;

    const ok = window.confirm("정말 삭제할까요? 삭제 후 복구할 수 없습니다.");
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


  if (errMsg) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="py-20 text-center text-red-600 whitespace-pre-wrap">{errMsg}</div>
          <div className="flex justify-center">
            <button
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
              onClick={() => navigate("/community")}
            >
              목록으로
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">DEBUG: {debug}</div>
          <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="py-20 text-center text-gray-500">불러오는 중...</div>

          <div className="mt-6 text-xs text-gray-500">DEBUG: {debug}</div>
          <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </main>
      </div>
    );
  }



  const onClickAddComment = () => alert("아직 안됨");
  const onClickLikeComment = () => alert("아직 안됨");
  const onClickDislikeComment = () => alert("아직 안됨");

  const authorNickname = post?.author?.nickname ?? "(author 없음)";
  const createdAtText = formatKST(post?.createdAt);
  const updatedAtText = formatKST(post?.updatedAt);

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center gap-3 text-gray-600">
          <Link to="/community" className="hover:text-black">
            ←
          </Link>
          <div className="text-xl font-bold text-gray-800">커뮤니티 게시글</div>
        </div>
        <div className="text-xs text-gray-400">
          DEBUG isMine={String(isMine)} | meId={String(me?.id ?? me?.userId ?? "")} | authorId={String(post?.author?.id ?? post?.authorId ?? "")}
        </div>


        <div className="rounded-lg border bg-white p-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="material-symbols-outlined">face</span>
              <span className="font-semibold text-gray-700">{authorNickname}</span>
              <span className="ml-3">{createdAtText}</span>
              {updatedAtText ? (
                <span className="ml-2 text-gray-400">(수정 {updatedAtText})</span>
              ) : null}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined">thumb_up</span>
                {post.likeCount ?? 0}
              </div>
              <div className="text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined">thumb_down</span>
                {post.dislikeCount ?? 0}
              </div>
              <div className="text-gray-500 flex items-center gap-1">
                <span className="material-symbols-outlined">comment</span>
                {commentCount}
              </div>

              {isMine ? (
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={() => navigate(`/community/${postId}/edit`)}
                  title="수정"
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
              ) : null}

              {isMine ? (
                <button
                  type="button"
                  className={ghostBtn}
                  onClick={onClickDelete}
                  disabled={isDeleting}
                  title="삭제"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              ) : null}
            </div>
          </div>

          <h1 className="mt-4 text-xl font-black text-gray-900">
            {post.title ?? "(title 없음)"}
          </h1>

          <div className="mt-6 whitespace-pre-wrap leading-7 text-gray-800">
            {post.content ?? "(content 없음)"}
          </div>

          <div className="mt-10 flex items-center gap-3">
            <input
              className="h-11 flex-1 rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-gray-400"
              placeholder="댓글을 입력하세요"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onClickAddComment();
              }}
            />
            <button
              className="min-w-[110px] rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
              onClick={onClickAddComment}
            >
              댓글 달기
            </button>
          </div>

          <div className="mt-8 space-y-4">
            {comments.length === 0 ? (
              <div className="py-10 text-center text-gray-500">댓글이 없습니다.</div>
            ) : (
              comments.map((c) => {
                const cAuthor =
                  c?.author?.nickname ?? c?.authorNickname ?? c?.author ?? "익명";
                const cCreatedAt = formatKST(c?.createdAt);

                return (
                  <div key={c.id ?? `${cAuthor}-${cCreatedAt}`} className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="material-symbols-outlined">face</span>
                        <span className="font-semibold text-gray-700">{cAuthor}</span>
                        <span className="ml-2">{cCreatedAt}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button type="button" className={ghostBtn} onClick={onClickLikeComment}>
                          <span className="material-symbols-outlined">thumb_up</span>
                          {c.likeCount ?? 0}
                        </button>
                        <button type="button" className={ghostBtn} onClick={onClickDislikeComment}>
                          <span className="material-symbols-outlined">thumb_down</span>
                          {c.dislikeCount ?? 0}
                        </button>
                      </div>
                    </div>

                    <p className="mt-2 text-gray-800">{c.content ?? ""}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-8 text-xs text-gray-500">DEBUG: {debug}</div>
          <pre className="mt-3 overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
            {JSON.stringify(raw, null, 2)}
          </pre>
        </div>
      </main>
    </div>
  );
}
