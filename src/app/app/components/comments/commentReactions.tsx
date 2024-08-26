"use client";

import { MessageCircleReply, ThumbsDown, ThumbsUp } from "lucide-react";
import type { Comment } from "@/lib/types/comment";

import { formatTimeSince } from "@/lib/utils";
import { useComments } from "../../../../hooks/useComments";
import { useUser } from "@/hooks/useUser";
export function CommentReactions({ comment }: { comment: Comment }) {
  const { user } = useUser();
  const { reactToComment } = useComments();
  return (
    <div className="flex gap-8 mt-2 mb-2 ">
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (
              user &&
              comment.reactions?.find(
                (reaction) =>
                  reaction.user_id === user.id &&
                  reaction.reaction_type === "like"
              )
            ) {
              reactToComment(comment.id, "none");
            } else {
              reactToComment(comment.id, "like");
            }
          }}
          className="text-muted-foreground hover:underline"
        >
          <ThumbsUp
            className={
              user &&
              comment.reactions?.find(
                (reaction) =>
                  reaction.user_id === user.id &&
                  reaction.reaction_type === "like"
              )
                ? "stroke-foreground"
                : ""
            }
            strokeWidth={
              user &&
              comment.reactions?.find(
                (reaction) =>
                  reaction.user_id === user.id &&
                  reaction.reaction_type === "like"
              )
                ? 3
                : 2
            }
            size={18}
          />
        </button>
        <p className="text-muted-foreground  font-semibold">
          {comment.reactions?.filter(
            (reaction) => reaction.reaction_type == "like"
          ).length || ""}
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (
              user &&
              comment.reactions?.find(
                (reaction) =>
                  reaction.user_id === user.id &&
                  reaction.reaction_type === "dislike"
              )
            ) {
              reactToComment(comment.id, "none");
            } else {
              reactToComment(comment.id, "dislike");
            }
          }}
          className="text-muted-foreground hover:underline"
        >
          <ThumbsDown
            strokeWidth={
              user &&
              comment.reactions?.find(
                (reaction) =>
                  reaction.user_id === user.id &&
                  reaction.reaction_type === "dislike"
              )
                ? 3
                : 2
            }
            className={
              user &&
              comment.reactions?.find(
                (reaction) =>
                  reaction.user_id === user.id &&
                  reaction.reaction_type === "dislike"
              )
                ? "stroke-foreground"
                : ""
            }
            size={18}
          />
        </button>

        <p className="text-muted-foreground  font-semibold">
          {" "}
          {comment.reactions?.filter(
            (reaction) => reaction.reaction_type == "dislike"
          ).length || ""}
        </p>
      </div>

      <button className="text-muted-foreground hover:underline">
        <MessageCircleReply size={18} />
      </button>
    </div>
  );
}
