"use server";

import { getDriver } from "../../neo4j";
import type { Session } from "neo4j-driver";
import { Comment } from "@/lib/types/comment";
import { PostReaction } from "@/lib/types/reaction";
import { User } from "@/lib/types/user";
export async function getPostComments(postId: string): Promise<Comment[]> {
  const driver = await getDriver();
  const session: Session = driver.session();

  try {
    const result = await session.run(
      `MATCH (p:Post {id: $postId})<-[:WRITTEN_FOR]-(comment:Comment)<-[commented:COMMENTED]-(user:User)
       OPTIONAL MATCH (comment)<-[reaction:REACTED_TO]-(reactor:User)
       RETURN comment, commented, user, collect({reaction: reaction, reactor: reactor}) AS reactions
       ORDER BY comment.created_at DESC`,
      { postId }
    );

    if (!result.records.length) {
      return [];
    }

    const commentsFull = result.records.map((record) => {
      const comment = record.get("comment").properties;
      const user = record.get("user").properties;
      const commented = record.get("commented").properties;
      const reactions = record.get("reactions");

      const formattedReactions = reactions
        .map((r: { reaction: any; reactor: any }) => {
          if (r.reaction && r.reactor) {
            return {
              type: "relationship",
              id: r.reaction.properties.id,
              created_at: r.reaction.properties.created_at,
              reaction_type: r.reaction.properties.reaction_type,
              user_id: r.reactor.properties.id,
            };
          }
          return null;
        })
        .filter((r: any) => r !== null); // Filter out null reactions

      return {
        ...comment,
        created_at: new Date(commented.created_at).toString(),
        user_id: user.id,
        user_name: user.username,
        user_firstname: user.firstname,
        user_lastname: user.lastname,
        user_profile_picture: user.profile_picture,
        reactions: formattedReactions,
      };
    });

    console.log("commentsFull", commentsFull[0].reactions[0]);
    return commentsFull;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get posts: " + JSON.stringify(error));
  } finally {
    await session.close();
  }
}
