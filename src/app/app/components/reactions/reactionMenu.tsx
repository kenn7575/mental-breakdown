"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ThumbsUp } from "lucide-react";
import { createPostReaction } from "@/lib/database/postReactions/post";

export default function ReactionMenu({
  reaction_count,
  post_id,
  userReaction,
}: {
  reaction_count: number | undefined;
  post_id: string | undefined;
  userReaction: string | null;
}) {
  const [reaction, setReaction] = useState(userReaction || "");

  function handleReaction(reactionType: string) {
    if (reactionType === "none") {
      setReaction("");
    } else {
      setReaction(reactionType);
    }
    if (!post_id) return;

    createPostReaction({
      post_id: post_id,
      reaction_type: reactionType,
    }).then((res) => {
      if (res.status === "error") {
        setReaction("");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            {reaction && <span className="text-3xl">{reaction}</span>}
            {!reaction && <ThumbsUp strokeWidth={1.5} />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex gap-6">
            <DropdownMenuItem className="p-0 m-0 ">
              <button
                onClick={() => {
                  handleReaction("😭");
                }}
                className="text-3xl"
              >
                😭
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 m-0 ">
              <button
                className="text-3xl"
                onClick={() => {
                  handleReaction("🤯");
                }}
              >
                🤯
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 m-0 ">
              <button
                className="text-3xl"
                onClick={() => {
                  handleReaction("🥰");
                }}
              >
                🥰
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 m-0 ">
              {" "}
              <button
                className="text-3xl"
                onClick={() => {
                  handleReaction("😱");
                }}
              >
                😱
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem className="p-0 m-0 ">
              <button
                className="text-3xl"
                onClick={() => {
                  handleReaction("😂");
                }}
              >
                😂
              </button>
            </DropdownMenuItem>
            {reaction !== "" && (
              <DropdownMenuItem className="p-0 m-0 ">
                <button
                  className="text-3xl"
                  onClick={() => {
                    handleReaction("none");
                  }}
                >
                  🚫
                </button>
              </DropdownMenuItem>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <p className="text-center font-bold">
        {reaction_count &&
          new Intl.NumberFormat("en-US", { notation: "compact" })
            .format(reaction_count)
            .toString()}
      </p>
    </div>
  );
}
