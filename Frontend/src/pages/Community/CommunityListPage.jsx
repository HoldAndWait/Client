import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@api/api.js";

const PAGE_SIZE = 20;

function formatDate(yyyyMmDd) {
  const [y, m, d] = String(yyyyMmDd || "").split("-").map(Number);
  const monthNames = [
    "Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.",
    "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec.",
  ];
  if (!y || !m || !d) return yyyyMmDd || "";
  return `${monthNames[m - 1]}${d}.${y}`;
}

function normalizeListResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.data?.content)) return data.data.content;
  return [];
}

function mapPost(p) {
  return {
    id: String(p.id ?? p.postId ?? ""),
    title: p.title ?? "",
    content: p.content ?? "",
    author:
      typeof p.author === "string"
        ? p.author
        : (p.author?.nickname ??
            p.authorName ??
            p.user?.nickname ??
            p.writer?.nickname ??
            "unknown"),
    createdAt: toYmd(p.createdAt ?? p.created_at ?? p.createdDate ?? p.created_date),
    likeCount: p.likeCount ?? p.like_count ?? p.likes ?? 0,
    commentCount: p.commentCount ?? p.comment_count ?? p.comments ?? 0,
  };
}

function toYmd(createdAtLike) {
  const s = String(createdAtLike || "");
  return s.length >= 10 ? s.slice(0, 10) : s;
}

export default function CommunityListPage() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [canLoadMore, setCanLoadMore] = useState(false);

  const cursorRef = useRef({ hasNext: false, lastId: null });
  const searchRef = useRef({ page: 0, totalPages: 0 });
  const loadingMoreRef = useRef(false);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const keyword = q.trim();
    const delay = keyword ? 300 : 0;

    const timer = window.setTimeout(async () => {
      try {
        setLoading(true);
        setErrorMsg("");
        setPosts([]);
        setCanLoadMore(false);

        if (keyword) {
          const res = await api.get("/api/posts/search", {
            params: { keyword, page: 0, size: PAGE_SIZE },
            signal: controller.signal,
          });
          const data = res.data ?? {};
          const list = normalizeListResponse(data).map(mapPost).filter((p) => p.id);
          setPosts(list);
          searchRef.current = { page: 0, totalPages: data.totalPages ?? 0 };
          cursorRef.current = { hasNext: false, lastId: null };
          setCanLoadMore(1 < (data.totalPages ?? 0));
        } else {
          const res = await api.get("/api/posts", {
            params: { size: PAGE_SIZE },
            signal: controller.signal,
          });
          const data = res.data ?? {};
          const list = normalizeListResponse(data).map(mapPost).filter((p) => p.id);
          setPosts(list);
          cursorRef.current = { hasNext: data.hasNext === true, lastId: data.lastId ?? null };
          searchRef.current = { page: 0, totalPages: 0 };
          setCanLoadMore(data.hasNext === true);
        }
      } catch (e) {
        if (controller.signal.aborted) return;
        const status = e?.response?.status;
        if (status === 401) setErrorMsg("로그인이 필요합니다.");
        else if (status === 403) setErrorMsg("권한이 없습니다.");
        else setErrorMsg("게시글을 불러오지 못했습니다.");
        setPosts([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, delay);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [q]);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);

    const keyword = q.trim();

    try {
      if (keyword) {
        const { page, totalPages } = searchRef.current;
        const nextPage = page + 1;
        if (nextPage >= totalPages) return;

        const res = await api.get("/api/posts/search", {
          params: { keyword, page: nextPage, size: PAGE_SIZE },
        });
        const data = res.data ?? {};
        const list = normalizeListResponse(data).map(mapPost).filter((p) => p.id);
        setPosts((prev) => [...prev, ...list]);
        searchRef.current = { page: nextPage, totalPages: data.totalPages ?? 0 };
        setCanLoadMore(nextPage + 1 < (data.totalPages ?? 0));
      } else {
        const { hasNext, lastId } = cursorRef.current;
        if (!hasNext || lastId == null) return;

        const res = await api.get("/api/posts", {
          params: { size: PAGE_SIZE, lastId },
        });
        const data = res.data ?? {};
        const list = normalizeListResponse(data).map(mapPost).filter((p) => p.id);
        setPosts((prev) => [...prev, ...list]);
        cursorRef.current = { hasNext: data.hasNext === true, lastId: data.lastId ?? null };
        setCanLoadMore(data.hasNext === true);
      }
    } catch {
      setCanLoadMore(false);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [q]);

  const loadMoreFnRef = useRef(loadMore);
  loadMoreFnRef.current = loadMore;

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMoreFnRef.current();
      },
      { rootMargin: "300px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [canLoadMore]);

  const syncOnePost = async (postId) => {
    const res = await api.get(`/api/posts/${postId}`);
    const p = res.data?.data ?? res.data ?? null;
    const nextLike = p?.likeCount ?? p?.likes ?? p?.like_count;
    setPosts((prev) =>
      prev.map((row) => {
        if (String(row.id) !== String(postId)) return row;
        return { ...row, likeCount: nextLike ?? row.likeCount };
      }),
    );
  };

  const onLike = async (postId) => {
    try {
      await api.post(`/api/posts/${postId}/likes`);
      await syncOnePost(postId);
    } catch {
      alert("추천 실패");
    }
  };

  return (
    <div className="w-full min-h-screen bg-smu-base text-smu-black">
      <main className="mx-auto max-w-[1200px] px-6 py-14">

        {/* 페이지 헤더 */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-smu-gray bg-white mb-5">
            <span className="w-2 h-2 rounded-full bg-smu-neonlime" />
            <span className="text-sm text-smu-navy">SolveMeUp · Community</span>
          </div>
          <h1 className="text-4xl font-extrabold leading-tight text-smu-black">
            커뮤니티
          </h1>
          <p className="mt-3 text-[17px] text-smu-navy">
            질문하고, 공유하고, 함께 성장하세요.
          </p>
        </div>

        {/* 검색 + 글쓰기 */}
        <div className="flex items-center gap-3 mb-10">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-smu-gray pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              className="
                h-12 w-full pl-10 pr-4
                rounded-xl border border-smu-gray bg-white
                text-sm text-smu-black placeholder-smu-gray
                outline-none focus:border-smu-navy
                transition
              "
              placeholder="제목, 내용, 작성자로 검색"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/communitywrite")}
            className="
              inline-flex items-center justify-center gap-2
              h-12 px-6 rounded-xl
              bg-smu-navy text-smu-base font-semibold text-sm
              hover:bg-smu-neonlime hover:text-smu-black
              transition whitespace-nowrap
            "
          >
            글쓰기
            <span className="opacity-70">+</span>
          </button>
        </div>

        {/* 로딩/에러 */}
        {loading && (
          <div className="py-20 text-center text-smu-gray">불러오는 중...</div>
        )}
        {!loading && errorMsg && (
          <div className="py-20 text-center text-red-500 font-semibold">{errorMsg}</div>
        )}

        {/* 게시글 목록 */}
        {!loading && !errorMsg && (
          <>
            {posts.length === 0 ? (
              <div className="py-24 text-center text-smu-gray">게시글이 없습니다.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} onLike={onLike} />
                ))}
              </div>
            )}

            {canLoadMore && <div ref={sentinelRef} className="h-1" />}

            {loadingMore && (
              <div className="py-8 text-center text-smu-gray">더 불러오는 중...</div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function PostCard({ post, onLike }) {
  return (
    <div
      className="
        group bg-white rounded-2xl border border-gray-100 shadow-sm
        px-7 py-6
        hover:border-smu-navy hover:shadow-md
        transition
      "
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-smu-navy text-smu-base flex items-center justify-center text-xs font-bold select-none">
            {String(post.author || "?")[0].toUpperCase()}
          </div>
          <span className="text-sm font-semibold text-smu-black">
            {post.author}
          </span>
        </div>

        <span className="text-xs text-smu-gray">{formatDate(post.createdAt)}</span>
      </div>

      <Link
        to={`/community/${post.id}`}
        className="block text-lg font-extrabold text-smu-black hover:text-smu-navy transition mb-2"
      >
        {post.title || "(title 없음)"}
      </Link>

      <Link
        to={`/community/${post.id}`}
        className="block text-[15px] text-smu-navy line-clamp-2 hover:underline"
      >
        {post.content || "(content 없음)"}
      </Link>

      <div className="mt-5 mb-4 h-px w-full bg-gray-100" />

      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/community/${post.id}`}
          className="
            text-sm font-semibold text-smu-navy
            group-hover:text-smu-black transition
            inline-flex items-center gap-1
          "
        >
          자세히 보기 <span>→</span>
        </Link>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onLike(post.id)}
            className="
              inline-flex items-center gap-1.5
              text-sm text-smu-gray
              hover:text-smu-navy
              transition focus:outline-none
            "
            aria-label="like"
          >
            <ThumbIcon />
            <span className="font-semibold">{post.likeCount ?? 0}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 text-sm text-smu-gray">
            <CommentIcon />
            <span className="font-semibold">{post.commentCount ?? 0}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function ThumbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 18H4a2 2 0 01-2-2v-6a2 2 0 012-2h3m0 10V8m0 10h9.2a1 1 0 00.98-.8l1.6-8A1 1 0 0019.8 8H14V5a3 3 0 00-3-3l-4 9v7z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17 10c0 3.866-3.134 7-7 7a7.003 7.003 0 01-5.288-2.412L2 17l1.588-2.712A6.96 6.96 0 013 10c0-3.866 3.134-7 7-7s7 3.134 7 7z"
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
