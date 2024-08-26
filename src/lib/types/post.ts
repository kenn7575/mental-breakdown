import { UUID } from "crypto";
import { PostReaction } from "./reaction";
import { User } from "./user";

// Post

export interface Post {
  type: "node";
  id: string;
  title: string;
  body: string;
  suspended: boolean;
  visibility: string;
  posted_at: string;

  publicImageUrl?: string;
  imageRef?: string;
  rawImageBytes?: string;
}
export interface DisplayPost extends Post {
  user: User;
  reaction_count: number;
  reactions: PostReaction[];
  comment_count: number;
  comments: Comment[];
  tags: string[];
}
export interface CreatePostFormData {
  forceFlaggedContent: boolean;
  description: string;
  image?: HTMLImageElement | null;
  emotion?: string | null;
  severity?: number | null;
  visibility: MBVisibility;
  gifUrl?: string | null;
  publicImageUrl?: string;
}
export interface CreatePost {
  description: string;
  visibility: MBVisibility;
  emotion?: string;
  severity?: number;
  gifUrl?: string;
  rawImage?: Buffer;
  publicImageUrl?: string;
  suspended?: boolean;
  userId: UUID;
  hashtags?: string[];
  mentions?: string[];
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
