import { z } from "zod";

export const createPostSchema = z.object({
  description: z
    .string()
    .min(10, "The description must be at least 10 characters in length.")
    .max(1000, "You exited the maximun number of characters which is 1000."),
  image: z.any().nullish(),
  gifURL: z.string().nullish(),
  severity: z.number().nullish(),
  emotion: z.string().nullish(),
  visibility: z.enum(["public", "private", "anonymous"]),
});
