"use server";
import { getDriver } from "@/lib/neo4j";
import type { Session } from "neo4j-driver";
import { CreatePostCommentReaction, Post } from "@/lib/types";
import { createPostCommentReactionSchema as cpcrs } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
import { getTokenPayload } from "@/lib/data/getTokenPayload";
import { revalidatePath } from "next/cache";

export async function createPostCommentReaction(
  data: CreatePostCommentReaction
): Promise<{
  status: "added" | "updated" | "error" | "deleted";
  postId?: string;
}> {
  console.log("🚀 ~ data:", data);

  return new Promise(async (resolve, reject) => {
    // Validate the data
    const result = zodValidate(cpcrs, data);
    if (!result.success) {
      throw new Error("Invalid data");
    }

    const user = await getTokenPayload();

    if (!user?.id) {
      reject("Not logged in");
      return;
    }

    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      // Start a transaction
      const tx = session.beginTransaction();

      // Check if the user has already reacted to the post
      const reactionExists = await tx.run(
        `MATCH (:User{id:$userId})-[r:REACTED_TO]->(:Comment{id:$commentId})-[:WRITTEN_FOR]->(p:Post)
         RETURN r, p;`,
        { userId: user.id, commentId: data.post_comment_id }
      );

      if (reactionExists.records.length) {
        if (data.reaction_type === "none") {
          // Remove the reaction
          const res = await tx.run(
            `MATCH (:User{id:$userId})-[r:REACTED_TO]->(:Comment{id:$commentId})-[:WRITTEN_FOR]->(p:Post)
             DELETE r RETURN  p;`,
            { userId: user.id, commentId: data.post_comment_id }
          );
          const postId: string = res.records[0].get("p").properties?.id;
          if (postId) revalidatePath(`/app/posts/${postId}`);
          revalidatePath(`/app`);

          // Commit the transaction
          await tx.commit();
          resolve({ status: "deleted", postId });
        } else {
          // Update the reaction type and created_at property
          const res = await tx.run(
            `MATCH (u:User{id:$userId})-[r:REACTED_TO]->(:Comment{id:$commentId})-[:WRITTEN_FOR]->(p:Post)
             SET r.reaction_type = $reactionType, r.created_at = $createdAt
             RETURN p;`,
            {
              userId: user.id,
              commentId: data.post_comment_id,
              reactionType: data.reaction_type,
              createdAt: new Date().toISOString(),
            }
          );
          const postId: string = res.records[0].get("p").properties?.id;
          if (postId) revalidatePath(`/app/posts/${postId}`);
          revalidatePath(`/app`);

          // Commit the transaction
          await tx.commit();
          revalidatePath("/app");
          resolve({ status: "updated", postId });
        }
      } else {
        // Create a new reaction
        const res = await tx.run(
          `MATCH (u:User{id:$userId}), (c:Comment{id:$commentId})-[:WRITTEN_FOR]->(p:Post)
           MERGE (u)-[:REACTED_TO{reaction_type:$reactionType, created_at:$createdAt, id: toString(randomUUID())}]->(c) RETURN  p;`,
          {
            userId: user.id,
            commentId: data.post_comment_id,
            reactionType: data.reaction_type,
            createdAt: new Date().toISOString(),
          }
        );
        const postId: string = res.records[0].get("p").properties?.id;
        if (postId) revalidatePath(`/app/posts/${postId}`);
        revalidatePath(`/app`);
        // Commit the transaction
        await tx.commit();
        resolve({ status: "added", postId });
      }
    } catch (error) {
      console.error(error);
      // Rollback the transaction in case of an error
      if (session) {
        const tx = session.beginTransaction();
        await tx.rollback();
      }

      resolve({ status: "error" });
    } finally {
      if (session) {
        await session.close();
      }
    }
  });
}
