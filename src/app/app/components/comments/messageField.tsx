"use client";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "../../../../hooks/useComments";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useRef, useState } from "react";
import { set } from "date-fns";
export function MessageField({ postId }: { postId: string }) {
  const { addComment } = useComments();
  const [comment, setComment] = useState("");

  return (
    <div className="w-full relative flex">
      <Textarea
        value={comment}
        placeholder="Type here..."
        className="pr-12"
        onChange={(e) => {
          setComment(e.currentTarget.value);
        }}
        onKeyDown={(e) => {
          if (e.metaKey && e.key === "Enter") {
            addComment(postId, comment);
            setComment("");
          }
        }}
      />
      <Button
        size="icon"
        variant="ghost"
        onClick={() => {
          addComment(postId, comment);
          setComment("");
        }}
        className="absolute right-1 "
      >
        <Send size={18} />
      </Button>
    </div>
  );
}
