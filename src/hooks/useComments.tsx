// commentsContext.tsx
import { detelePostComment } from "@/lib/data/posts/comments/deleteComment";
import { createPostComment } from "@/lib/data/posts/comments/createPostComment";
import { createPostCommentReaction } from "@/lib/data/posts/comments/reactions/createPostCommentReaction";
import { getPostComments } from "@/lib/data/posts/comments/getPostComments";
// commentsContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { Comment, Reaction } from "@/lib/types";

import { getTokenPayload } from "@/lib/data/getTokenPayload";

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

  const fetchComments = async (postId: string) => {
    const data = await getPostComments(postId);
    setComments(data);
    setLoading(false);
  };

  const addComment = async (postId: string, commentText: string) => {
    const user = await getTokenPayload();
    if (!user) {
      throw new Error("User not found");
    }
    const comment: Comment = {
      id: "0",
      user_id: user.id, // Replace with actual user ID
      comment_text: commentText,
      created_at: new Date().toString(),
      type: "node",
      anwser_id: "",
      root_id: "",
      user_name: user.username, // Replace with actual user name
      user_firstname: user.firstname, // Replace with actual user first name
      user_lastname: user.lastname, // Replace with actual user last name
    };
    setComments((prevComments) => [comment, ...prevComments]);
    await createPostComment({
      post_id: postId,
      comment: comment.comment_text,
    });
  };

  const deleteComment = async (commentId: string) => {
    await detelePostComment(commentId);
    setComments((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
  };

  const reactToComment = async (commentId: string, reactionType: string) => {
    const user = await getTokenPayload();
    if (!user) {
      throw new Error("User not found");
    }
    const newReaction: Reaction = {
      id: "0",
      user_id: user.id, // Replace with actual user ID
      reaction_type: reactionType,
      created_at: new Date().toString(),
      type: "relationship", // Assuming 'type' field is required
    };

    // Optimistically update the state
    const previousComments = comments;
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              reactions: comment.reactions
                ? [
                    ...comment.reactions.filter(
                      (r) => r.user_id !== "currentUser"
                    ),
                    newReaction,
                  ]
                : [newReaction],
            }
          : comment
      )
    );

    try {
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
