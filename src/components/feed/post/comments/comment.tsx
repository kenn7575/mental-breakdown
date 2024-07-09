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
  MessageCircleReply,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Comment, Reaction } from "@/lib/types";
import { formatTimeSince } from "@/lib/utils";
import { createPostCommentReaction } from "@/lib/data/posts/comments/reactions/createPostCommentReaction";
import { useEffect, useState } from "react";

export function CommentContent({
  comment,
  onDeleted,
  userId,
  onReaction,
}: {
  comment: Comment;
  onReaction: () => void;
  onDeleted: (commentId: string) => void;
  userId: string | undefined;
}) {
  const [reaction, setReaction] = useState<string>(
    comment.reactions?.find((r) => r.user_id === userId)?.reaction_type || ""
  );
  const [reactions, setReactions] = useState(comment.reactions || []);

  function handleReaction(reactionType: string) {
    if (reactionType === reaction) {
      // Remove reaction
      setReaction("");
      setReactions((prevReactions) =>
        prevReactions.filter(
          (r) => !(r.user_id === userId && r.reaction_type === reactionType)
        )
      );
    } else {
      // Add or change reaction
      setReaction(reactionType);
      setReactions((prevReactions) => {
        const existingReactionIndex = prevReactions.findIndex(
          (r) => r.user_id === userId
        );
        if (existingReactionIndex !== -1) {
          // Change existing reaction
          const updatedReactions = [...prevReactions];
          updatedReactions[existingReactionIndex].reaction_type = reactionType;
          return updatedReactions;
        } else {
          // Add new reaction
          return [
            ...prevReactions,
            {
              user_id: userId || "",
              reaction_type: reactionType,
              type: "relationship",
              id: "",
              created_at: new Date().toISOString(),
            },
          ];
        }
      });
    }

    createPostCommentReaction({
      post_comment_id: comment.id,
      reaction_type: reactionType,
    }).then((res) => {
      if (res.status === "error") {
        console.log("error");
      }
    });
    onReaction();
  }

  return (
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
                    handleReaction("like");
                  }}
                  className="text-muted-foreground hover:underline"
                >
                  <ThumbsUp
                    className={reaction === "like" ? "stroke-foreground" : ""}
                    size={18}
                    strokeWidth={reaction === "like" ? 3 : 2}
                  />
                </button>
                <p className="text-muted-foreground  font-semibold">
                  {reactions?.filter(
                    (reaction) => reaction.reaction_type == "like"
                  ).length || ""}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleReaction("dislike");
                  }}
                  className="text-muted-foreground hover:underline"
                >
                  <ThumbsDown
                    className={
                      reaction === "dislike" ? "stroke-foreground" : ""
                    }
                    size={18}
                    strokeWidth={reaction === "dislike" ? 3 : 2}
                  />
                </button>

                <p className="text-muted-foreground  font-semibold">
                  {" "}
                  {reactions?.filter(
                    (reaction) => reaction.reaction_type == "dislike"
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
          <EllipsisVertical size={18} className="mt-4 text-muted-foreground" />
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
  );
}
