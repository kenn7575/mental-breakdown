"use server";
import { getDriver } from "../../neo4j";
import type { Session } from "neo4j-driver";
import { CreatePostComment } from "../../types";
import { createPostCommentSchema } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
import { getTokenPayload } from "@/app/actions/decodeAuthToken";
import { redirect } from "next/navigation";
export async function createPostReaction(data: CreatePostComment): Promise<{
  status: "success" | "error";
}> {
  console.log("createPostReaction");
  return await new Promise(async (resolve, reject) => {
    // validate the data
    const result = zodValidate(createPostCommentSchema, data);
    if (!result.success) {
      throw new Error("Invalid data");
    }
    const user = await getTokenPayload();
    console.log("🚀 ~ returnawaitnewPromise ~ user:", user);
    if (!user?.id) {
      redirect(`/login?redirect=/posts/${data.post_id}`);
    }

    // Create a new user
    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      //create connection from user to cemment and from comment to post
      const comment = await session.run(
        `create (u:User{id:"${
          user.id
        }"})-[r:COMMENTED {created_at: "${new Date().toISOString()}"}]->(c:Comment{id: toString(randomUUID()), comment_text: "${
          data.comment
        }", created_at: "${new Date().toISOString()}"})-[commented:WRITTEN_FOR {created_at: "${new Date().toISOString()}"]->(p:Post{id:"${
          data.post_id
        }"})`
      );
      if (!comment.records.length) {
        throw new Error("Failed to create comment");
      }
      resolve({ status: "success" });
    } catch (error) {
      console.error(error);
      resolve({ status: "error" });
    } finally {
      session && session.close();
    }
  });
}
