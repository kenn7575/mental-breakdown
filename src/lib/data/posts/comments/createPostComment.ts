"use server";
import { getDriver } from "../../../neo4j";
import type { Session } from "neo4j-driver";
import { Comment, CreatePostComment, Post, User } from "../../../types";
import { createPostCommentSchema } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
import { getTokenPayload } from "@/app/actions/getTokenPayload";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
export async function createPostComment(data: CreatePostComment): Promise<{
  status: "success" | "error";
  comment?: Comment;
}> {
  return await new Promise(async (resolve, reject) => {
    // validate the data
    const result = zodValidate(createPostCommentSchema, data);
    if (!result.success) {
      throw new Error("Invalid data");
    }
    const user = await getTokenPayload();

    if (!user?.id) {
      redirect(`/login?redirect=/posts/${data.post_id}`);
    }

    // Create a new user
    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      //create connection from user to cemment and from comment to post
      const result = await session.run(
        `MATCH (user:User {id: $userId})
       MATCH (p:Post {id: $postId})
       CREATE (user)-[commented:COMMENTED {created_at: $createdAt}]->(comment:Comment {id: toString(randomUUID()), comment_text: $commentText, created_at: $createdAt})
       CREATE (comment)-[:WRITTEN_FOR {created_at: $createdAt}]->(p)
       RETURN comment, commented, user, p.id AS p;`,
        {
          userId: user.id,
          postId: data.post_id,
          commentText: data.comment,
          createdAt: new Date().toISOString(),
        }
      );

      if (!result.records.length) {
        throw new Error("Failed to create comment");
      }
      const postId: string = result.records[0].get("p").properties?.id;
      if (postId) revalidatePath(`/app/posts/${postId}`);
      revalidatePath(`/app`);

      const record = result.records[0];

      const comment: Comment = record.get("comment").properties;
      const user1: User = record.get("user").properties;
      const commented = record.get("commented").properties;
      const commentFull = {
        ...comment,
        created_at: new Date(commented.created_at).toDateString(),
        user_id: user1.id,
        user_name: user1.username,
        user_firstname: user1.firstname,
        user_lastname: user1.lastname,
        user_profile_picture: user1.profile_picture,
      };

      resolve({
        status: "success",
        comment: commentFull,
      });
    } catch (error) {
      console.error(error);
      resolve({ status: "error" });
    } finally {
      session && session.close();
    }
  });
}
