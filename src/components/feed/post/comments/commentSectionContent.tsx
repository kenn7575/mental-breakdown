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
import { EllipsisVertical } from "lucide-react";
import { Comment } from "@/lib/types";
import { formatTimeSince } from "@/lib/utils";

export function CommentSectionContent({
  comments,
  userId,
  onDeleted,
}: {
  comments: Comment[];
  userId: string | undefined;
  onDeleted: (commentId: string) => void;
}) {
  async function handleDeleteComment(commentId: string) {
    onDeleted(commentId);
  }
  return (
    <div className="">
      {comments.map((comment) => (
        <div className="flex justify-between">
          <div className="flex flex-col justify-center ">
            <Separator className="my-2" />
            <Link href="#" className="flex  space-x-4">
              <Avatar>
                <AvatarImage src="profile.jpg" />
                <AvatarFallback>
                  {" "}
                  {comment.user_firstname && comment.user_lastname
                    ? comment.user_firstname[0] + comment.user_lastname[0]
                    : ""}
                </AvatarFallback>
              </Avatar>

              <div>
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
              </div>
            </Link>
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
                    handleDeleteComment(comment.id);
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
