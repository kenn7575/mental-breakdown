"use client";

import { CommentsProvider } from "../../../../hooks/useComments";
import { CommentSectionLayout } from "./commentSectionLayout";

export function CommentSection({
  postId,
  commentCount,
}: {
  postId: string;
  commentCount: number;
}) {
  return (
    <CommentsProvider>
      <CommentSectionLayout commentCount={commentCount} postId={postId} />
    </CommentsProvider>
  );
}
