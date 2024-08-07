"use server";

import { MBEmotion, MBSeverity } from "@/lib/types";
import { createPostSchema } from "../zodSchemas/createPostSchema";

export async function uploadPost({
  description,
  image,
  gifURL,
  emotion,
  severity,
  visibility,
}: {
  description: string;
  image: HTMLImageElement | null;
  gifURL: string | null;
  emotion: MBEmotion | null;
  severity: MBSeverity | null;
  visibility: string;
}) {
  const result = createPostSchema.safeParse({
    description,
    image,
    gifURL,
    emotion,
    severity,
    visibility,
  });

  if (!result.success) {
    console.log("Checks failed");

    return result.error.flatten();
  }

  console.log("Passes checks");
}
