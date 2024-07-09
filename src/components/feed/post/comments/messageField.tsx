"use client";
import { Textarea } from "@/components/ui/textarea";
import { useComments } from "../../../../hooks/useComments";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
export function MessageField({ postId }: { postId: string }) {
  const { addComment } = useComments();
  return (
    <div className="w-full relative flex">
      <Textarea
        placeholder="Type here..."
        className="pr-12"
        onKeyDown={(e) => {
          if (e.metaKey && e.key === "Enter") {
            addComment(postId, e.currentTarget.value);
            e.currentTarget.value = "";
          }
        }}
      />
      <Button size="icon" variant="ghost" className="absolute right-1 ">
        <Send size={18} />
      </Button>
    </div>
  );
}
