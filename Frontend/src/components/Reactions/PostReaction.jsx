import { useState } from "react";
import api from "@api/api.js";

export default function usePostReactions({ postId }) {
  const [loading, setLoading] = useState(false);

  const request = async (type) => {
    if (!postId) return { ok: false, error: { message: "no postId" } };

    setLoading(true);
    try {
      const url =
        type === "like"
          ? `/api/posts/${postId}/likes`
          : `/api/posts/${postId}/dislikes`;

      const res = await api.post(url);

      // ✅ 응답이 비어있을 수도 있음(204 or empty body)
      const data = res?.data?.data ?? res?.data ?? null;

      const nextLike = data?.likeCount ?? data?.likes ?? data?.like_count ?? null;
      const nextDislike =
        data?.dislikeCount ?? data?.dislikes ?? data?.dislike_count ?? null;

      return { ok: true, nextLike, nextDislike, raw: res.data };
    } catch (e) {
      const status = e?.response?.status;
      const body = e?.response?.data;
      return {
        ok: false,
        error: {
          status,
          body,
          message:
            body?.message ||
            body?.error ||
            JSON.stringify(body || {}, null, 2) ||
            e.message,
        },
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    like: () => request("like"),
    dislike: () => request("dislike"),
  };
}