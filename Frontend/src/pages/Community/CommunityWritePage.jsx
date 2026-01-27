import React, { useMemo, useState } from "react";
import axios from "axios";
import  api  from "@api/api.js";

export default function CommunityWritePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastPostRes, setLastPostRes] = useState(null);
  const [lastGetRes, setLastGetRes] = useState(null);
  const [isLoadingGet, setIsLoadingGet] = useState(false);


  const submit = async () => {
    const body = {
      title: title.trim() || "테스트 게시물 제목 입니다.",
      content: content.trim() || "테스트 게시물 내용 입니다.",
    };

    setIsSubmitting(true);
    setErrorMsg("");
    setLastPostRes(null);
    console.log("WRITE baseURL =", api.defaults.baseURL);


    try {
      const res = await api.post("/api/posts", body);
      setLastPostRes({ ok: true, status: res.status, data: res.data, sentBody: body });
      alert("POST 성공. 아래 응답 확인!");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      setErrorMsg(
        `POST 실패 (status=${status ?? "?"})\n` +
          (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const refetch = async () => {
    setIsLoadingGet(true);
    setErrorMsg("");
    setLastGetRes(null);

    try {
      const res = await api.get("/api/posts");
      setLastGetRes({ ok: true, status: res.status, data: res.data });
      alert("GET 성공. 아래 응답 확인!");
    } catch (err) {
      const status = err?.response?.status;
      const data = err?.response?.data;

      setErrorMsg(
        `GET 실패 (status=${status ?? "?"})\n` +
          (data?.message || data?.error || JSON.stringify(data || {}, null, 2) || err.message)
      );
    } finally {
      setIsLoadingGet(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 text-xl font-bold text-gray-700">
          커뮤니티 글쓰기 (디버그 모드)
        </div>

        <div className="rounded-lg border border-gray-200 p-6">
          <label className="block text-base font-bold text-gray-800">제목</label>
          <input
            className="mt-2 h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            placeholder="제목을 입력하세요"
          />

          <label className="mt-6 block text-base font-bold text-gray-800">내용</label>
          <textarea
            rows={8}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            placeholder="내용을 입력하세요"
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
              disabled={isLoadingGet}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold hover:bg-gray-300 disabled:opacity-60"
            >
              {isLoadingGet ? "불러오는 중..." : "GET /api/posts 재조회"}
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

          <div className="mt-6 text-xs text-gray-500 whitespace-pre-wrap">
            {`현재 페이지 오리진: ${window.location.origin}
현재 쿠키 포함 요청: withCredentials=true
※ 로그인 후 테스트가 막히면, 백엔드 LOGIN_SUCCESS_REDIRECT_URI가 solvemeup.com으로 고정돼 있을 확률이 높음`}
          </div>
        </div>
      </main>
    </div>
  );
}
