"use client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import Link from "next/link";

import { getPostComments } from "@/lib/data/comments/getPostComments";

import { LoaderCircle, MessageCircle, Send } from "lucide-react";
import { Comment } from "@/lib/types";
import { Textarea } from "./ui/textarea";
import { useState, useEffect } from "react";
import { set } from "date-fns";
import { formatTimeSince } from "@/lib/utils";

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpened) {
      setLoading(true);
      getPostComments(postId).then((data) => {
        setComments(data);
        setLoading(false);
      });
    }
  }, [postId, isOpened]);
  function onOpenChange(isOpen: boolean) {
    if (isOpen) {
      setIsOpened(true);
      setLoading(true);
      getPostComments(postId).then((data) => {
        setComments(data);
        setLoading(false);
      });
    } else {
      setIsOpened(false);
    }
  }

  return (
    <>
      <Sheet
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
        }}
      >
        <SheetTrigger asChild className="sm:hidden">
          <Button variant="ghost" size="icon">
            <MessageCircle strokeWidth={1.5} />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-3xl h-[80dvh]">
          <SheetHeader>
            <SheetTitle>Comments</SheetTitle>
          </SheetHeader>
          <SheetFooter className="h-full pb-20">
            <div className="mt-8 flex !flex-col !justify-between h-full w-full">
              {loading && (
                <LoaderCircle
                  strokeWidth={1.5}
                  className="m-auto  animate-spin"
                >
                  Loading...
                </LoaderCircle>
              )}
              {!loading && comments.length === 0 && <p>No comments yet.</p>}
              {!loading && comments.length > 0 && (
                <CommentSectionContent comments={comments} />
              )}
              <CommentTextArea />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet
        onOpenChange={(isOpen) => {
          onOpenChange(isOpen);
        }}
      >
        <SheetTrigger asChild className="hidden sm:flex">
          <Button variant="ghost" size="icon">
            <MessageCircle strokeWidth={1.5} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="rounded-s-3xl ">
          <SheetHeader>
            <SheetTitle>Comments</SheetTitle>
          </SheetHeader>
          <SheetFooter className="h-full pb-20">
            <div className="mt-8 flex !flex-col !justify-between h-full w-full">
              {loading && (
                <LoaderCircle
                  strokeWidth={1.5}
                  className="m-auto  animate-spin"
                >
                  Loading...
                </LoaderCircle>
              )}
              {!loading && comments.length === 0 && <p>No comments yet.</p>}
              {!loading && comments.length > 0 && (
                <CommentSectionContent comments={comments} />
              )}
              <CommentTextArea />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function CommentTextArea() {
  return (
    <div className="w-full relative flex">
      <Textarea placeholder="Type here..." className="pr-12" />
      <Button size="icon" variant="ghost" className="absolute right-1 ">
        <Send size={18} />
      </Button>
    </div>
  );
}

function CommentSectionContent({ comments }: { comments: Comment[] }) {
  return (
    <div>
      {comments.map((comment) => (
        <div className="flex flex-col justify-center ">
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
      ))}
    </div>
  );
}
