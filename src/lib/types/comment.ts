import { PostReaction } from "./reaction";

export interface Comment {
  type: "node";
  id: string;
  anwser_id: string;
  root_id: string;
  comment_text: string;
  created_at: string;

  //additional properties
  user_name?: string;
  user_id?: string;
  user_profile_picture?: string;
  user_firstname?: string;
  user_lastname?: string;
  reactions?: PostReaction[];
}

export interface CreatePostComment {
  post_id: string;
  comment: string;
}
