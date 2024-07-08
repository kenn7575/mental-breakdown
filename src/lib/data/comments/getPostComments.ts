"use server";
import { getDriver } from "../../neo4j";
import type { Session } from "neo4j-driver";
import { Comment, User } from "../../types";
export async function getPostComments(postId: string): Promise<Comment[]> {
  return await new Promise(async (resolve, reject) => {
    // Create a new user
    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      //check if user already exists
      const result = await session.run(
        `MATCH (p:Post{id:"${postId}"})<-[:WRITTEN_FOR]-(comment:Comment)<-[commented:COMMENTED]-(user:User)
          RETURN comment, commented, user ORDER BY comment.created_at DESC;`
      );
      if (!result.records.length) {
        resolve([]);
      }
      const commentsFull = result.records.map((record) => {
        const comment: Comment = record.get("comment").properties;
        const user: User = record.get("user").properties;
        const commented = record.get("commented").properties;

        const c = {
          ...comment,
          created_at: new Date(commented.created_at).toString(),
          user_id: user.id,
          user_name: user.username,
          user_firstname: user.firstname,
          user_lastname: user.lastname,
          user_profile_picture: user.profile_picture,
        };

        return c;
      });

      resolve(commentsFull);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to get posts: " + JSON.stringify(error));
    } finally {
      session && session.close();
    }
  });
}
