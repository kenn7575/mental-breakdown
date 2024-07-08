"use client";
import { Send } from "lucide-react";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";
import { createPostComment } from "@/lib/data/comments/createPostComment";
import { Comment } from "@/lib/types";

export function CommentTextArea({
  postId,
  onNewComment,
}: {
  postId: string;
  onNewComment: (comment: string) => void;
}) {
  return (
    <div className="w-full relative flex">
      <Textarea
        placeholder="Type here..."
        className="pr-12"
        onKeyDown={(e) => {
          if (e.metaKey && e.key === "Enter") {
            onNewComment(e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
      <Button size="icon" variant="ghost" className="absolute right-1 ">
        <Send size={18} />
      </Button>
    </div>
  );
}
