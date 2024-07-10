"use client";
import { LoaderCircle } from "lucide-react";
import { useComments } from "../../../../hooks/useComments";
import { CommentContent } from "./commentContent";
import { MessageField } from "./messageField";
import { useUser } from "@/hooks/useUser";

export function CommentSectionContent({ postId }: { postId: string }) {
  const { user } = useUser();
  const { comments, loading } = useComments();
  return (
    <div className="mt-8 flex !flex-col !justify-between h-full w-full">
      {loading && (
        <LoaderCircle strokeWidth={1.5} className="m-auto  animate-spin">
          Loading...
        </LoaderCircle>
      )}
      {!loading && comments.length === 0 && <p>No comments yet.</p>}
      {!loading && comments.length > 0 && (
        <div className="max-h-max overflow-y-scroll mb-4">
          {comments.map((comment) => (
            <CommentContent comment={comment} />
          ))}
        </div>
      )}
      {user && <MessageField postId={postId} />}
    </div>
  );
}
