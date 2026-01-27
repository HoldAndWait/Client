import React, { useState } from "react";
import axios from "axios";

/** ✅ 도메인 고정 + 세션 쿠키 포함 */
const api = axios.create({
  baseURL: "http://solvemeup.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default function CommunityWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastPostRes, setLastPostRes] = useState(null);
  const [lastGetRes, setLastGetRes] = useState(null);

  const submit = async () => {
    const t = title.trim() || "테스트 제목";
    const c = content.trim() || "테스트 내용";

    setIsSubmitting(true);
    setErrorMsg("");
    setLastPostRes(null);

    try {
      const res = await api.post("/api/posts", { title: t, content: c });
      setLastPostRes({ status: res.status, data: res.data });
      console.log("✅ POST OK", res.status, res.data);
      alert("POST 성공. 아래 응답 확인!");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.log("❌ POST FAIL", status, data, err);

      setErrorMsg(
        `POST 실패 (status=${status ?? "?"})\n` +
          (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const refetch = async () => {
    setErrorMsg("");
    setLastGetRes(null);

    try {
      const res = await api.get("/api/posts");
      setLastGetRes({ status: res.status, data: res.data });
      console.log("✅ GET OK", res.status, res.data);
      alert("GET 성공. 아래 응답 확인!");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.log("❌ GET FAIL", status, data, err);

      setErrorMsg(
        `GET 실패 (status=${status ?? "?"})\n` +
          (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || err.message)
      );
    }
  };

  return (
    
    <div className="min-h-screen bg-white">
      <div className="mb-2 text-xs text-red-600">
        WRITE DEBUG BUILD: 2026-01-27  (v999)
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 text-xl font-bold text-gray-700">커뮤니티 글쓰기 (디버그 모드)</div>

        <div className="p-6 rounded-lg border border-gray-200">
          <label className="block text-base font-bold text-gray-800">제목</label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
          />

          <label className="mt-6 block text-base font-bold text-gray-800">내용</label>
          <textarea
            rows={8}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={submit}
              disabled={isSubmitting}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300 disabled:opacity-60"
            >
              {isSubmitting ? "등록 중..." : "POST /api/posts"}
            </button>

            <button
              type="button"
              onClick={refetch}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300"
            >
              GET /api/posts 재조회
            </button>
          </div>

          {errorMsg ? (
            <pre className="mt-6 whitespace-pre-wrap rounded-md border border-red-200 bg-red-50 p-4 text-xs text-red-700">
              {errorMsg}
            </pre>
          ) : null}

          <div className="mt-6 grid gap-4">
            <div>
              <div className="mb-2 text-sm font-bold text-gray-700">POST 응답</div>
              <pre className="overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
                {JSON.stringify(lastPostRes, null, 2)}
              </pre>
            </div>

            <div>
              <div className="mb-2 text-sm font-bold text-gray-700">GET 응답</div>
              <pre className="overflow-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700">
                {JSON.stringify(lastGetRes, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
