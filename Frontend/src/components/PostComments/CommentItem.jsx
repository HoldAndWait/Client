import React, { useState } from "react";
import api from "@api/api.js";
import CommentForm from "./CommentForm";
import ReplyList from "./ReplyList";

export default function CommentItem({ comment, postId, onRefresh, depth = 1 }) {
  const commentId = comment?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const [replyOpen, setReplyOpen] = useState(false);

  const nickname =
    comment?.author?.nickname ??
    comment?.writer?.nickname ??
    comment?.writer ??
    "익명";

  const deleteComment = async () => {
    if (!commentId) return;
    setIsDeleting(true);
    setErrMsg("");

    try {
      await api.delete(`/api/posts/${postId}/comments/${commentId}`);
      onRefresh?.();
    } catch (e) {
      console.error("삭제 실패", e);
      setErrMsg("삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const like = async () => {
    if (!commentId) return;
    try {
      await api.post(`/api/posts/comments/${commentId}/likes`);
      onRefresh?.();
    } catch (e) {
      console.error("좋아요 실패", e);
    }
  };

  const dislike = async () => {
    if (!commentId) return;
    try {
      await api.post(`/api/posts/comments/${commentId}/dislikes`);
      onRefresh?.();
    } catch (e) {
      console.error("싫어요 실패", e);
    }
  };

  return (
    <div className={`rounded p-3 ${depth === 2 ? "bg-gray-50" : ""}`}>
      <div className="flex justify-between items-center">
        <span className="font-semibold">{nickname}</span>

        <button
          onClick={deleteComment}
          className="text-red-500 text-sm disabled:opacity-50"
          disabled={isDeleting}
          type="button"
        >
          {isDeleting ? "삭제 중…" : "삭제"}
        </button>
      </div>

      <p className="my-2 whitespace-pre-wrap break-words">{comment?.content ?? ""}</p>

      <div className="flex gap-3 text-sm text-gray-600">
        <button type="button" onClick={like} className="flex items-center gap-1">
          <span className="material-symbols-outlined text-base leading-none">thumb_up</span>
          {comment?.likeCount ?? 0}
        </button>
        <button type="button" onClick={dislike} className="flex items-center gap-1">
          <span className="material-symbols-outlined text-base leading-none">thumb_down</span>
          {comment?.dislikeCount ?? 0}
        </button>

        {/* 댓글(1차)일 때만 답글 버튼 */}
        {depth === 1 && (
          <button
            type="button"
            onClick={() => setReplyOpen((v) => !v)}
            className="ml-2 text-gray-500 hover:text-black"
          >
            {replyOpen ? "답글 닫기" : "답글"}
          </button>
        )}
      </div>

      {/* 대댓글 작성 폼 */}
      {depth === 1 && replyOpen && (
        <div className="mt-3 pl-6">
          <CommentForm
            postId={postId}
            parentId={commentId}     // ✅ 여기!
            onSuccess={() => {
              setReplyOpen(false);
              onRefresh?.();
            }}
            placeholder="대댓글을 입력하세요"
            compact
            autoFocus
          />
        </div>
      )}

      {/* 대댓글 렌더링 */}
      {depth === 1 && (
        <ReplyList
          replies={comment?.replies ?? []}
          postId={postId}
          onRefresh={onRefresh}
          parentId={commentId}
        />
      )}

      {errMsg && <div className="text-sm text-red-500 mt-2">{errMsg}</div>}
    </div>
  );
}
