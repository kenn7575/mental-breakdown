"use server";
import { getDriver } from "../../../neo4j";
import type { Session } from "neo4j-driver";
import { CreatePostReaction } from "../../../types";
import { createPostReactionSchema } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
import { getTokenPayload } from "@/app/actions/getTokenPayload";
import { redirect } from "next/navigation";
export async function createPostReaction(data: CreatePostReaction): Promise<{
  status: "added" | "updated" | "error" | "deleted";
}> {
  return new Promise(async (resolve, reject) => {
    // Validate the data
    const result = zodValidate(createPostReactionSchema, data);
    if (!result.success) {
      throw new Error("Invalid data");
    }

    const user = await getTokenPayload();

    if (!user?.id) {
      redirect(`/login?redirect=/posts/${data.post_id}`);
    }

    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      // Start a transaction
      const tx = session.beginTransaction();

      // Check if the user has already reacted to the post
      const reactionExists = await tx.run(
        `MATCH (u:User{id:$userId})-[r:REACTED_TO]->(p:Post{id:$postId})
         RETURN r`,
        { userId: user.id, postId: data.post_id }
      );

      if (reactionExists.records.length) {
        if (data.reaction_type === "none") {
          // Remove the reaction
          await tx.run(
            `MATCH (u:User{id:$userId})-[r:REACTED_TO]->(p:Post{id:$postId})
             DELETE r`,
            { userId: user.id, postId: data.post_id }
          );

          // Commit the transaction
          await tx.commit();
          resolve({ status: "deleted" });
        } else {
          // Update the reaction type and created_at property
          await tx.run(
            `MATCH (u:User{id:$userId})-[r:REACTED_TO]->(p:Post{id:$postId})
             SET r.reaction_type = $reactionType, r.created_at = $createdAt
             RETURN r`,
            {
              userId: user.id,
              postId: data.post_id,
              reactionType: data.reaction_type,
              createdAt: new Date().toISOString(),
            }
          );

          // Commit the transaction
          await tx.commit();
          resolve({ status: "updated" });
        }
      } else {
        // Create a new reaction
        await tx.run(
          `MATCH (u:User{id:$userId}), (p:Post{id:$postId})
           MERGE (u)-[:REACTED_TO{reaction_type:$reactionType, created_at:$createdAt}]->(p)`,
          {
            userId: user.id,
            postId: data.post_id,
            reactionType: data.reaction_type,
            createdAt: new Date().toISOString(),
          }
        );

        // Commit the transaction
        await tx.commit();
        resolve({ status: "added" });
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
