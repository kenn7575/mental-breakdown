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
        `OPTIONAL MATCH (p:Post{id:"${postId}"})<-[:WRITTEN_FOR]-(comment:Comment)<-[commented:COMMENTED]-(user:User)
          RETURN comment, commented, user;`
      );
      if (!result.records.length) {
        reject("No posts found");
      }
      const postsWithUsers = result.records.map((record) => {
        const comment: Comment = record.get("comment").properties;
        const user: User = record.get("user").properties;
        const commented = record.get("commented").properties;

        return {
          ...comment,
          created_at: new Date(commented.created_at).toDateString(),
          user_id: user.id,
          user_name: user.username,
          user_firstname: user.firstname,
          user_lastname: user.lastname,
          user_profile_picture: user.profile_picture,
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
