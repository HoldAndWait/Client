import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

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

  useEffect(() => {
    if (!postId) return;

    setDebug("EFFECT_STARTED");
    setErrMsg("");

    (async () => {
      try {
        const res = await axios.get(`/api/posts/${postId}`, {
          withCredentials: true,
        });

        setDebug("GET_SUCCESS");
        setRaw(res.data);
        setPost(res.data ?? null);
      } catch (e) {
        setDebug("GET_FAILED");
        console.log("❌ GET failed:", e?.response?.status, e?.response?.data, e);
        setErrMsg("게시글을 불러오지 못했습니다.");
        setPost(null);
      }
    })();
  }, [postId]);

  // ✅ 댓글은 서버 응답(post.comments)을 사용 (없으면 빈 배열)
  const comments = useMemo(() => post?.comments ?? [], [post]);

  // ✅ 댓글 수는 서버 commentCount 우선, 없으면 comments.length
  const commentCount = useMemo(() => {
    if (typeof post?.commentCount === "number") return post.commentCount;
    return comments.length;
  }, [post, comments]);

  if (errMsg) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="py-20 text-center text-red-600">{errMsg}</div>
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
          <div className="py-20 text-center text-gray-500">게시글을 찾을 수 없습니다.</div>
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

  const onClickAddComment = () => alert("아직 안됨");
  const onClickLikeComment = () => alert("아직 안됨");
  const onClickDislikeComment = () => alert("아직 안됨");

  // ✅ author가 객체이므로 nickname 사용
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

              <button type="button" className={ghostBtn} onClick={() => alert("수정")}>
                <span className="material-symbols-outlined">edit</span>
              </button>
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
                // 서버 댓글 스키마가 아직 확정 전이라 방어적으로
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
                        <button
                          type="button"
                          className={ghostBtn}
                          onClick={onClickDislikeComment}
                        >
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
