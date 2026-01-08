import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LS_POSTS = "community_posts_v1";

function loadPosts() {
  const raw = localStorage.getItem(LS_POSTS);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePosts(posts) {
  localStorage.setItem(LS_POSTS, JSON.stringify(posts));
}

function todayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const onSubmit = () => {
    const t = title.trim();
    const c = content.trim();
    if (!t || !c) return;

    const posts = loadPosts();
    const newPost = {
      id: String(Date.now()),
      author: "USERNAME",
      title: t,
      content: c,
      createdAt: todayString(),
      likeCount: 0,
      dislikeCount: 0,
      commentCount: 0,
    };

    // 최신 글이 위로
    savePosts([newPost, ...posts]);
    navigate("/community");
  };

  return (
    <div className="min-h-screen bg-white">

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-10 text-xl font-bold text-gray-700">커뮤니티 글쓰기</div>

        <div className="p-10">
          <label className="block text-base font-bold text-gray-800">제목</label>
          <div className="mt-3">
            <input
              className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-gray-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <label className="mt-10 block text-base font-bold text-gray-800">내용</label>
          <div className="mt-3">
            <textarea
              rows={12}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-400"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={onSubmit}
              className="min-w-[90px] rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
            >
              등록
            </button>
            <button
              onClick={() => navigate(-1)}
              className="min-w-[90px] rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
            >
              취소
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
