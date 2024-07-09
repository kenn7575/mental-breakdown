"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {
  EllipsisVertical,
  MessageCircle,
  MessageCircleReply,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Comment } from "@/lib/types";
import { formatTimeSince } from "@/lib/utils";
import { createPostCommentReaction } from "@/lib/data/posts/comments/reactions/createPostCommentReaction";
import { useEffect, useState } from "react";
import { CommentContent } from "./comment";

export function CommentSectionContent({
  comments,
  userId,
  onDeleted,
  onReaction,
}: {
  comments: Comment[];
  userId: string | undefined;
  onDeleted: (commentId: string) => void;
  onReaction: () => void;
}) {
  function handleReaction(commentId: string, reactionType: string) {
    createPostCommentReaction({
      post_comment_id: commentId,
      reaction_type: reactionType,
    }).then((res) => {
      if (res.status === "error") {
        console.log("error");
      } else {
        console.log("success. Reaction set to: ", reactionType);
      }
    });
  }

  return (
    <div>
      {comments.map((comment) => (
        <CommentContent
          onReaction={onReaction}
          key={comment.id}
          comment={comment}
          userId={userId}
          onDeleted={onDeleted}
        />
      ))}
    </div>
  );
}
