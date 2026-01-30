import React, { useState } from "react";
import api from "@api/api.js";

export default function CommentForm({ postId, onSuccess }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const submit = async (e) => {
    e?.preventDefault?.();
    const text = content.trim();
    if (!text) return;

    setIsSubmitting(true);
    setErrMsg("");

    try {
      await api.post(`/api/posts/${postId}/comments`, { content: text });
      setContent("");
      onSuccess?.();
    } catch (err) {
      console.error("댓글 작성 실패", err);
      setErrMsg("댓글 작성에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex gap-2 mb-4">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border rounded p-2"
        placeholder="댓글을 입력하세요"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="px-3 py-2 bg-black text-white rounded disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? "작성 중…" : "작성"}
      </button>

      {errMsg && <div className="w-full text-sm text-red-500 mt-2">{errMsg}</div>}
    </form>
  );
}
