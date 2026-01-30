import React, { useState } from "react";
import api from "@api/api.js";

export default function CommentItem({ comment, postId, onRefresh }) {
  const commentId = comment?.commentId ?? comment?.id;
  const nickname =
  comment?.author?.nickname ??
  comment?.writer?.nickname ?? 
  comment?.writer ??              
  "익명";
  const [isDeleting, setIsDeleting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const deleteComment = async () => {
    if (!commentId) return;
    setIsDeleting(true);
    setErrMsg("");

    try {
      await api.delete(`/api/posts/${postId}/comments/${commentId}`);
      onRefresh?.();
    } catch (e) {
      console.error("댓글 삭제 실패", e);
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
      console.error("댓글 좋아요 실패", e);
    }
  };

  const dislike = async () => {
    if (!commentId) return;
    try {
      await api.post(`/api/posts/comments/${commentId}/dislikes`);
      onRefresh?.();
    } catch (e) {
      console.error("댓글 싫어요 실패", e);
    }
  };

  return (
    <div className="rounded p-3">
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

      <p className="my-2 whitespace-pre-wrap break-words">
        {comment?.content ?? ""}
      </p>

      <div className="flex gap-3 text-sm text-gray-600">
        <button type="button" onClick={like} className="flex items-center gap-1">
          <span className="material-symbols-outlined">thumb_up</span>
          {comment?.likeCount ?? 0}
        </button>
        <button type="button" onClick={dislike} className="flex items-center gap-1">
          <span className="material-symbols-outlined">thumb_down</span>
          {comment?.dislikeCount ?? 0}
        </button>
      </div>

      {errMsg && <div className="text-sm text-red-500 mt-2">{errMsg}</div>}
    </div>
  );
}
