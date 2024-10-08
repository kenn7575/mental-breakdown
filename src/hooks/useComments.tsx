// commentsContext.tsx
import { detelePostComment } from "@/lib/database/comments/delete";
import { createPostComment } from "@/lib/database/comments/post";
import { createPostCommentReaction } from "@/lib/database/commentReactions/post";
import { getPostComments } from "@/lib/database/comments/get";
// commentsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Comment } from "@/lib/types/comment";
import { PostReaction } from "@/lib/types/reaction";

import { getTokenPayload } from "@/app/actions/getTokenPayload";

interface CommentsContextProps {
  comments: Comment[];
  loading: boolean;
  fetchComments: (postId: string) => void;
  addComment: (postId: string, comment: string) => void;
  deleteComment: (commentId: string) => void;
  reactToComment: (commentId: string, reactionType: string) => void;
}

const CommentsContext = createContext<CommentsContextProps | undefined>(
  undefined
);

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error("useComments must be used within a CommentsProvider");
  }
  return context;
};

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchComments = async (postId: string, doloading?: boolean) => {
    if (doloading) setLoading(true);
    const data = await getPostComments(postId);
    setComments(data);
    setLoading(false);
  };

  const addComment = async (postId: string, commentText: string) => {
    const user = await getTokenPayload();
    if (!user) {
      throw new Error("User not found");
    }
    await createPostComment({
      post_id: postId,
      comment: commentText,
    });
    fetchComments(postId, true);
  };

  const deleteComment = async (commentId: string) => {
    const user = await getTokenPayload();
    if (!user) {
      throw new Error("User not found");
    }
    await detelePostComment(commentId);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const reactToComment = async (commentId: string, reactionType: string) => {
    const previousComments = [...comments];

    try {
      const user = await getTokenPayload();
      if (!user) {
        throw new Error("User not found");
      }

      const newReaction: PostReaction = {
        id: "0",
        user_id: user.id,
        reaction_type: reactionType,
        created_at: new Date().toString(),
        type: "relationship", // Assuming 'type' field is required
      };

      // Optimistically update the state
      let updatedComments;

      if (reactionType === "none") {
        console.log("Removing reaction");
        updatedComments = removeReactionFromComment(commentId, user.id);
      } else {
        updatedComments = addOrUpdateReaction(commentId, newReaction, user.id);
      }

      setComments(updatedComments);

      const res = await createPostCommentReaction({
        post_comment_id: commentId,
        reaction_type: reactionType,
      });

      if (res.postId) fetchComments(res.postId);
    } catch (error) {
      console.error("Failed to create reaction", error);
      // Revert to previous state if the API call fails
      setComments(previousComments);
    }
  };

  const removeReactionFromComment = (commentId: string, userId: string) => {
    return comments.map((comment) =>
      comment.id === commentId
        ? {
            ...comment,
            reactions: comment.reactions
              ? comment.reactions.filter((r) => r.user_id !== userId)
              : [],
          }
        : comment
    );
  };

  const addOrUpdateReaction = (
    commentId: string,
    newReaction: PostReaction,
    userId: string
  ) => {
    return comments.map((comment) => {
      if (comment.id === commentId) {
        const existingReaction = comment.reactions
          ? comment.reactions.find((r) => r.user_id === userId)
          : null;

        const updatedReactions = existingReaction
          ? comment?.reactions?.map((r) =>
              r.user_id === userId ? newReaction : r
            )
          : [...(comment.reactions || []), newReaction];

        return {
          ...comment,
          reactions: updatedReactions,
        };
      }
      return comment;
    });
  };
  return (
    <CommentsContext.Provider
      value={{
        comments,
        loading,
        fetchComments,
        addComment,
        deleteComment,
        reactToComment,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
};
