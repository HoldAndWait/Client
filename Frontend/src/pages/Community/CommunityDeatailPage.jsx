import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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

const ghostBtn =
  "bg-transparent p-0 border-0 outline-none focus:outline-none text-gray-500 hover:text-black";

export default function CommunityDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);


  const [commentText, setCommentText] = useState("");


  const [comments] = useState([
    {
      id: "default-1",
      author: "USERNAME",
      createdAt: "2024-11-11 18:12",
      content: "짱 ~",
      likeCount: 0,
      dislikeCount: 0,
    },
  ]);

  useEffect(() => {
    const posts = loadPosts();
    const found = posts.find((p) => String(p.id) === String(postId));
    setPost(found ?? null);
  }, [postId]);

  const commentCount = useMemo(() => comments.length, [comments]);

  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <main className="mx-auto max-w-5xl px-6 py-10">
          <div className="py-20 text-center text-gray-500">
            게시글을 찾을 수 없습니다.
          </div>
          <div className="flex justify-center">
            <button
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300"
              onClick={() => navigate("/community")}
            >
              목록으로
            </button>
          </div>
        </main>
      </div>
    );
  }


  const updatePostCounts = (updater) => {
    const posts = loadPosts();
    const next = posts.map((p) => {
      if (String(p.id) !== String(postId)) return p;
      return updater(p);
    });
    savePosts(next);
    const refreshed = next.find((p) => String(p.id) === String(postId));
    setPost(refreshed ?? null);
  };


  const onClickAddComment = () => {

    alert("아직 안됨");
  };


  const onClickLikeComment = () => {
    alert("아직 안됨");
  };

  const onClickDislikeComment = () => {
    alert("아직 안됨");
  };

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
              <span>👤</span>
              <span className="font-semibold text-gray-700">{post.author}</span>
              <span className="ml-3">{post.createdAt}</span>
            </div>

  
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <button
                type="button"
                className={ghostBtn}
                onClick={() =>
                  updatePostCounts((p) => ({
                    ...p,
                    likeCount: (p.likeCount ?? 0) + 1,
                  }))
                }
              >
                👍 {post.likeCount ?? 0}
              </button>

              <button
                type="button"
                className={ghostBtn}
                onClick={() =>
                  updatePostCounts((p) => ({
                    ...p,
                    dislikeCount: (p.dislikeCount ?? 0) + 1,
                  }))
                }
              >
                👎 {post.dislikeCount ?? 0}
              </button>

              <div className="text-gray-500">💬 {commentCount}</div>

              <button type="button" className={ghostBtn} onClick={() => alert("수정")}>
                ✏️
              </button>
            </div>
          </div>

          <h1 className="mt-4 text-xl font-black text-gray-900">{post.title}</h1>

          <div className="mt-6 whitespace-pre-wrap leading-7 text-gray-800">
            {post.content}
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
            {comments.map((c) => (
              <div key={c.id} className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>👤</span>
                    <span className="font-semibold text-gray-700">{c.author}</span>
                    <span className="ml-2">{c.createdAt}</span>
                  </div>

                
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button type="button" className={ghostBtn} onClick={onClickLikeComment}>
                      👍 {c.likeCount ?? 0}
                    </button>
                    <button
                      type="button"
                      className={ghostBtn}
                      onClick={onClickDislikeComment}
                    >
                      👎 {c.dislikeCount ?? 0}
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-gray-800">{c.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
