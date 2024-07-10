"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CommentSectionContent } from "./commentSectionContent";
import { useComments } from "../../../../hooks/useComments";
import { MessageCircle } from "lucide-react";
import { use, useEffect } from "react";
export function CommentSectionLayout({
  postId,
  commentCount,
}: {
  postId: string;
  commentCount: number;
}) {
  const { comments, fetchComments } = useComments();

  return (
    <>
      <Sheet
        onOpenChange={(isOpen) => {
          if (isOpen) {
            fetchComments(postId);
          }
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
            <CommentSectionContent postId={postId} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet
        onOpenChange={(isOpen) => {
          if (isOpen) {
            fetchComments(postId);
          }
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
            <CommentSectionContent postId={postId} />
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <p className="text-center font-bold">
        {new Intl.NumberFormat("en-US", { notation: "compact" })
          .format(Number(commentCount || comments.length || 0))
          .toString()}
      </p>
    </>
  );
}
