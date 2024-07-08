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
import { getPostComments } from "@/lib/data/posts/comments/getPostComments";
import { LoaderCircle, MessageCircle } from "lucide-react";
import { Comment } from "@/lib/types";
import { useState, useEffect } from "react";

import { CommentTextArea } from "./commentUploader";
import { detelePostComment } from "@/lib/data/posts/comments/deleteComment";
import { createPostComment } from "@/lib/data/posts/comments/createPostComment";
import { CommentSectionContent } from "./commentSectionContent";

export default function CommentSection({
  postId,
  userId,
  userFirstName,
  userLastName,
  userName,
  comment_count,
}: {
  postId: string;
  userId: string | undefined;
  userFirstName: string | undefined;
  userLastName: string | undefined;
  userName: string | undefined;
  comment_count: number | undefined;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isOpened, setIsOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpened) {
      fetchComments();
    }
  }, [postId, isOpened]);

  const fetchComments = async () => {
    const data = await getPostComments(postId);
    console.log("🚀 ~ fetchComments ~ data:", data[0].reactions[0]);

    setComments(data);
    setLoading(false);
  };

  const onOpenChange = (isOpen: boolean) => {
    setIsOpened(isOpen);
    if (isOpen) {
      fetchComments();
    }
  };

  const handleNewComment = async (commentText: string) => {
    const comment: Comment = {
      id: "0",
      user_id: userId || "0",
      comment_text: commentText,
      created_at: new Date().toString(),
      type: "node",
      anwser_id: "",
      root_id: "",
      user_name: userName || "",
      user_firstname: userFirstName || "",
      user_lastname: userLastName || "",
    };

    setComments((prevComments) => [comment, ...prevComments]);

    //create comment
    const res = await createPostComment({
      post_id: postId,
      comment: commentText,
    });
    if (res.status === "error") {
      console.error("error");
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== comment.id)
      );
    }

    // Fetch latest comments in the background to ensure consistency
    fetchComments();
  };
  const handleDeleteComment = async (commentId: string) => {
    const commentsFallback = comments;
    setComments((prevComments) =>
      prevComments.filter((c) => c.id !== commentId)
    );
    const res = await detelePostComment(commentId);
    if (res.status === "error") {
      console.error("error");
      setComments(commentsFallback);
      return;
    } else {
      fetchComments();
    }
  };
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
                <CommentSectionContent
                  onDeleted={handleDeleteComment}
                  userId={userId}
                  comments={comments}
                />
              )}
              <CommentTextArea
                onNewComment={(comment) => {
                  handleNewComment(comment);
                }}
                postId={postId}
              />
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
                <CommentSectionContent
                  onDeleted={handleDeleteComment}
                  userId={userId}
                  comments={comments}
                />
              )}
              <CommentTextArea
                onNewComment={(comment) => {
                  handleNewComment(comment);
                }}
                postId={postId}
              />
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <p className="text-center font-bold">
        {new Intl.NumberFormat("en-US", { notation: "compact" })
          .format(Number(comments.length || comment_count || 0))
          .toString()}
      </p>
    </>
  );
}
