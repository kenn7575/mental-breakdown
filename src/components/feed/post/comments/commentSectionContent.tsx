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
import { useState } from "react";

export function CommentSectionContent({
  comments,
  userId,
  onDeleted,
}: {
  comments: Comment[];
  userId: string | undefined;
  onDeleted: (commentId: string) => void;
}) {
  const [reaction, setReaction] = useState("");

  function handleReaction(commentId: string, reactionType: string) {
    const reactionFallback = reaction;
    if (reactionType === "none") {
      setReaction("");
    } else {
      setReaction(reactionType);
    }
    console.log(commentId, reactionType);

    createPostCommentReaction({
      post_comment_id: commentId,
      reaction_type: reactionType,
    }).then((res) => {
      if (res.status === "error") {
        setReaction(reactionFallback);
      } else {
        setReaction(reactionType);
      }
    });
  }

  return (
    <div>
      {comments.map((comment) => (
        <div key={comment.id} className="flex justify-between">
          <div className="flex flex-col justify-center ">
            <Separator />
            <div className="flex mt-4 space-x-4">
              <Link href="#">
                <Avatar>
                  <AvatarImage src="profile.jpg" />
                  <AvatarFallback>
                    {" "}
                    {comment.user_firstname && comment.user_lastname
                      ? comment.user_firstname[0] + comment.user_lastname[0]
                      : ""}
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link href="#">
                  <p className="text-sm font-medium leading-none">
                    {" "}
                    {comment.user_firstname} {comment.user_lastname}
                    <span className="text-sm text-muted-foreground">
                      {" · "}
                      {formatTimeSince(comment.created_at)}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    @{comment.user_name}
                  </p>
                  <p className="mt-2 font-medium">{comment.comment_text}</p>
                </Link>
                <div className="flex gap-8 mt-2 mb-2 ">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleReaction(comment.id, "like");
                      }}
                      className="text-muted-foreground hover:underline"
                    >
                      <ThumbsUp size={18} />
                    </button>
                    <p className="text-muted-foreground  font-semibold">
                      {comment.reactions?.filter(
                        (reaction) => (reaction.reaction_type = "like")
                      ).length || ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleReaction(comment.id, "dislike");
                      }}
                      className="text-muted-foreground hover:underline"
                    >
                      <ThumbsDown size={18} />
                    </button>

                    <p className="text-muted-foreground  font-semibold">
                      {" "}
                      {comment.reactions?.filter(
                        (reaction) => (reaction.reaction_type = "dislike")
                      ).length || ""}
                    </p>
                  </div>

                  <button className="text-muted-foreground hover:underline">
                    <MessageCircleReply size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="hover:cursor-pointer">
              <EllipsisVertical
                size={18}
                className="mt-4 text-muted-foreground"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {userId && userId === comment?.user_id && (
                <DropdownMenuItem
                  onClick={() => {
                    onDeleted(comment.id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  );
}
