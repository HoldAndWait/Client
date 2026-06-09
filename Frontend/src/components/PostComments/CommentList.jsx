import React from "react";
import CommentItem from "./CommentItem";

export default function CommentList({ comments, postId, onRefresh, currentUserId }) {
  if (!comments || comments.length === 0) {
    return <div className="text-sm text-gray-500">첫 댓글을 남겨보세요.</div>;
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <CommentItem
          key={c.commentId ?? c.id}
          comment={c}
          postId={postId}
          onRefresh={onRefresh}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
}
