"use server";
import { getDriver } from "../../neo4j";
import type { Record, Session } from "neo4j-driver";
import { Comment, Post, User } from "../../types";

export async function getPosts(): Promise<Post[]> {
  const driver = await getDriver();
  const session: Session = driver.session();

  try {
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
      throw new Error("No posts found");
    }

    const postsWithUsers = result.records.map((record) => {
      const post = record.get("p").properties;
      const user = record.get("u").properties;
      const posted = record.get("posted").properties;

      const reactionData = (record.get("reactionData") as Array<any>)
        .map((reactionItem) => {
          if (reactionItem.reaction && reactionItem.reactor) {
            return {
              type: "relationship",
              id: reactionItem.reaction.properties.id,
              created_at: reactionItem.reaction.properties.created_at,
              reaction_type: reactionItem.reaction.properties.reaction_type,
              post_id: post.id,
              user_id: reactionItem.reactor.properties.id,
              user_name: reactionItem.reactor.properties.username,
              user_profile_picture:
                reactionItem.reactor.properties.profile_picture,
            };
          }
          return null;
        })
        .filter((r: any) => r !== null); // Filter out null reactions

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

    return postsWithUsers;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get posts: " + JSON.stringify(error));
  } finally {
    await session.close();
  }
}
