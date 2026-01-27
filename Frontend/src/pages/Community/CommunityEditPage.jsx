import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "@api/api.js";

export default function CommunityEditPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [raw, setRaw] = useState(null);
  const [post, setPost] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [debug, setDebug] = useState("INIT");

  // ✅ 1) 기존 글 불러와서 폼 초기값 세팅
  useEffect(() => {
    if (!postId) return;
    let cancelled = false;

    setDebug("FETCH_STARTED");
    setErrMsg("");

    (async () => {
      try {
        const res = await api.get(`/api/posts/${postId}`);
        if (cancelled) return;

        setDebug("FETCH_SUCCESS");
        setRaw(res.data);
        setPost(res.data ?? null);

        // 폼 초기값
        setTitle(res.data?.title ?? "");
        setContent(res.data?.content ?? "");
      } catch (e) {
        if (cancelled) return;
        const status = e?.response?.status;
        const data = e?.response?.data;

        setDebug(`FETCH_FAILED_${status ?? "?"}`);
        setErrMsg(
          `게시글을 불러오지 못했습니다. (status=${status ?? "?"})\n` +
            (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || e.message)
        );
        setRaw(data ?? null);
        setPost(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [postId]);

  // ✅ 2) 수정 저장
  const submitEdit = async () => {
    const body = {
      title: title.trim(),
      content: content.trim(),
    };

    if (!body.title) return alert("제목을 입력하세요.");
    if (!body.content) return alert("내용을 입력하세요.");

    setIsSubmitting(true);
    setErrMsg("");
    setDebug("SUBMIT_STARTED");

    try {
      // 서버 스펙이 PUT일 가능성이 가장 높음. (PATCH면 patch로 바꾸면 됨)
      const res = await api.put(`/api/posts/${postId}`, body);

      setDebug("SUBMIT_SUCCESS");
      setRaw((prev) => ({ prev, submitRes: res.data, sentBody: body }));

      alert("수정 완료!");
      navigate(`/community/${postId}`);
    } catch (e) {
      const status = e?.response?.status;
      const data = e?.response?.data;

      setDebug(`SUBMIT_FAILED_${status ?? "?"}`);
      setErrMsg(
        `수정 실패 (status=${status ?? "?"})\n` +
          (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || e.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // 로딩/에러 UI
  if (errMsg) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="py-20 text-center text-red-600 whitespace-pre-wrap">{errMsg}</div>
          <div className="flex justify-center gap-2">
            <button
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
              onClick={() => navigate(`/community/${postId}`)}
            >
              상세로
            </button>
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center gap-3 text-gray-600">
          <Link to={`/community/${postId}`} className="hover:text-black">
            ←
          </Link>
          <div className="text-xl font-bold text-gray-800">게시글 수정</div>
        </div>

        <div className="rounded-lg border bg-white p-10">
          <label className="block text-base font-bold text-gray-800">제목</label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />

          <label className="mt-6 block text-base font-bold text-gray-800">내용</label>
          <textarea
            rows={10}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={submitEdit}
              disabled={isSubmitting}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300 disabled:opacity-60"
            >
              {isSubmitting ? "저장 중..." : "수정 저장"}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/community/${postId}`)}
              disabled={isSubmitting}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300 disabled:opacity-60"
            >
              취소
            </button>
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
