import { z } from "zod";
export const CreateUserSchema = z.object({
  email: z.string().email().trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 i length" })
    .max(64, { message: "Password must be less than 64 in length" }),
});
export const LoginUserSchema = z.object({
  email: z.string().email().trim(),
  password: z
    .string()
    .max(64, { message: "Password must be less than 64 in length" }),
});
export const createPostReactionSchema = z.object({
  post_id: z.string().uuid(),
  reaction_type: z.string(),
});
export const createPostCommentSchema = z.object({
  post_id: z.string().uuid(),
  comment: z.string().min(1),
});
export const createPostCommentReactionSchema = z.object({
  post_comment_id: z.string().uuid(),
  reaction_type: z.string(),
});

export const CreatePostFormDataSchema = z.object({
  description: z
    .string({ message: "Description must of type string." })
    .min(20, { message: "Description must be at least 20 characters long." })
    .max(1000, { message: "Description must be atmost 1000 characters long." }),
  visibility: z.enum(["public", "friends", "anonymous"], {
    message: "Visibility must be either public, friends or anonymous.",
  }),
  emotion: z
    .string({ message: "Emotion must be of type string." })
    .optional()
    .nullish(),
  severity: z
    .number({ message: "Severity must be of type number." })
    .optional()
    .nullish(),
  gifUrl: z
    .string({ message: "Gif url must be of type string." })
    .optional()
    .nullish(),
  forceFlaggedContent: z.boolean({ message: "Force must be of type boolean." }),
});
export const CreatePostSchema = z.object({
  description: z.string(),
  visibility: z.string(),
  emotion: z.string().optional(),
  severity: z.number().optional(),
  gifUrl: z.string().optional(),
  rawImage: z.string().base64().optional(),
  publicImageUrl: z.string().optional(),
  suspended: z.boolean().optional(),
  userId: z.string().uuid(),
  hashtags: z.array(z.string()).optional(),
  mentions: z.array(z.string()).optional(),
});

export const createModerationReportSchema = z.object({
  postId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string(),
  flags: z.array(z.string()),
  action: z.string(),
});
