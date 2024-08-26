export interface PostReaction {
  type: "relationship";
  id: string;
  created_at: string;
  reaction_type: string;

  //additional properties
  post_id?: string;
  user_id?: string;
  user_name?: string;
  user_profile_picture?: string;
}
export interface CreatePostReaction {
  post_id: string;
  reaction_type: string;
}

export interface CreatePostCommentReaction {
  post_comment_id: string;
  reaction_type: string;
}
