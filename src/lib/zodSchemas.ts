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
