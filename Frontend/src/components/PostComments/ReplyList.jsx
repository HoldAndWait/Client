import React from "react";
import CommentItem from "./CommentItem";

export default function ReplyList({ replies, postId, onRefresh, currentUserId, parentId }) {
  if (!replies || replies.length === 0) return null;

  return (
    <div className="mt-2 space-y-2 pl-6 border-l">
      {replies.map((r) => (
        <CommentItem
          key={r.id}
          comment={r}
          postId={postId}
          onRefresh={onRefresh}
          currentUserId={currentUserId}
          depth={2}
          parentId={parentId}
        />
      ))}
    </div>
  );
}
