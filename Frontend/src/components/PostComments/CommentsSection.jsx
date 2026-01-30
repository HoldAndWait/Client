import React from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

export default function CommentsSection({ postId, comments, onRefreshPost }) {
  return (
    <div className="mt-6">
      <CommentForm postId={postId} onSuccess={onRefreshPost} />

      <CommentList
        comments={comments}
        postId={postId}
        onRefresh={onRefreshPost}
      />
    </div>
  );
}
