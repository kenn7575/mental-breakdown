"use server";
import { getDriver } from "../../neo4j";
import type { Record, Session } from "neo4j-driver";
import { Comment, Post, User } from "../../types";

export async function getPosts(): Promise<Post[]> {
  return await new Promise(async (resolve, reject) => {
    // Create a new user
    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      //check if user already exists
      const result = await session.run(
        `MATCH (u:User)-[posted:POSTED]->(p:Post)
OPTIONAL MATCH (p)<-[reactions:REACTED_TO]-(reactor:User)
WITH u, p, posted, 
     collect({reaction: reactions, reactor: reactor}) AS reactionData
OPTIONAL MATCH (p)<-[:WRITTEN_FOR]-(comments:Comment)
WITH u, p, posted, reactionData, 
     COUNT(comments) AS commentCount
RETURN u, p, posted, reactionData, commentCount`
      );
      if (!result.records.length) {
        reject("No posts found");
      }
      const postsWithUsers = result.records.map((record) => {
        const post = record.get("p").properties;
        const user = record.get("u").properties;
        const posted = record.get("posted").properties;

        const reactionData = (record.get("reactionData") as Record).map(
          (reactionItem) => ({
            type: "relationship",
            id: reactionItem.reaction.identity.toString(),
            created_at: reactionItem.reaction.properties.created_at,
            reaction_type: reactionItem.reaction.properties.reaction_type,
            post_id: post.id,
            user_id: reactionItem.reactor.properties.id,
            user_name: reactionItem.reactor.properties.username,
            user_profile_picture:
              reactionItem.reactor.properties.profile_picture,
          })
        );

        const commentCount = record.get("commentCount").toInt();

        return {
          type: "node",
          ...post,
          user: user,
          posted_at: new Date(posted.posted_at).toDateString(),
          user_id: user.id,
          reaction_count: reactionData.length,
          reactions: reactionData,
          comment_count: commentCount,
        };
      });

      console.log(postsWithUsers);
      resolve(postsWithUsers);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get posts: " + JSON.stringify(error));
    } finally {
      session && session.close();
    }
  });
}
