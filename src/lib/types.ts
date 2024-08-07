// User
export interface User {
  type: "node";
  id: string;
  email: string;
  password: string;
  joined_date: string;
  email_notifications: boolean;
  email_verified: boolean;
  color_theme: string;
  xp: number;
  firstname: string;
  lastname: string;
  username: string;
  last_active: string;
  bio: string;
  profile_picture: string;

  //additional properties
  friends?: string[];
}

// Post
export interface Post {
  type: "node";
  id: string;
  title: string;
  body: string;

  publicImageUrl?: string;
  imageRef?: string;
  rawImageBytes?: string;

  //additional properties
  user: User;
  posted_at?: string;
  reaction_count?: number;
  reactions?: Reaction[];
  comment_count?: number;
  comments?: Comment[];
  tags?: string[];
}
export interface CreatePost {
  description: string;
  image: HTMLImageElement | null;
  publicImageUrl?: string;
  privateImageUrl?: string;
  imagePath: string;

  emotion: MBEmotion | null;
  severity: MBSeverity | null;
  visibility: MBVisibility;
}

export interface Reaction {
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
  reactions?: Reaction[];
}

export interface CreatePostReaction {
  post_id: string;
  reaction_type: string;
}
export interface CreatePostCommentReaction {
  post_comment_id: string;
  reaction_type: string;
}
export interface CreatePostComment {
  post_id: string;
  comment: string;
}

export interface UserFormState {
  success: boolean;
  fieldErrors?: {
    email: string[];
    password: string[];
  };
  serverError?: string;
  data?: User;
}
export interface MBEmotion {
  name: string;
  image: string;
}

export interface MBSeverity {
  id: number;
  name: string;
  textColor: string;
  color: string;
}
export type MBVisibility = "public" | "friends" | "anonymous";
