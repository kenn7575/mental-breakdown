import "server-only";
import { getDriver } from "../../neo4j";
import type { Session } from "neo4j-driver";
import { zodValidate } from "@/lib/zodValidate";
import { CreatePost } from "@/lib/types/post";
import { CreatePostSchema } from "@/lib/zodSchemas";
import { getTokenPayload } from "@/app/actions/getTokenPayload";
import { UUID } from "crypto";

export async function createPost(data: CreatePost): Promise<
  | {
      success: true;
      postId: UUID;
    }
  | { success: false }
> {
  return new Promise(async (resolve, reject) => {
    // Validate the data
    const result = zodValidate(CreatePostSchema, data);
    if (!result.success) {
      reject({ success: false, message: "Data not valid" });
    }
    const loggedInUser = await getTokenPayload();
    if (!loggedInUser?.id || loggedInUser?.id !== data.userId) {
      reject({
        success: false,
        message: "Not logged in or not authorized to perform this action.",
      });
    }
    const driver = await getDriver();
    const session = driver.session();
    const tx = session.beginTransaction();

    let postId: null | UUID = null;

    //check if user exists
    try {
      const userResult = await tx.run(
        `MATCH (u:User {id: $userId}) RETURN u LIMIT 1`,
        { userId: data.userId }
      );

      if (!userResult.records.length) {
        reject({ success: false, message: "User not found" });
      }
      const userData = userResult.records[0].get("u").properties;

      console.log("Starting post upload🔄", {
        userId: userData.id,
        description: data.description,
        rawImage: data.rawImage || null,
        visibility: data.visibility,
        emotion: data.emotion || null,
        severity: data.severity || null,
        gifUrl: data.gifUrl || null,
        publicImageUrl: data.publicImageUrl || null,
        suspended: data.suspended || false,
        displayUserId:
          data.visibility.toString() === "anonymous" ? null : userData.id,
      });

      // Create the post
      const postResult = await tx.run(
        `
        MATCH (u:User {id: $userId})
        
        CREATE (p:Post {
            description: $description,
            id: toString(randomUUID()),
            createdAt: datetime(),
            rawImage: coalesce($rawImage, null),
            userId: coalesce($displayUserId, null),
            visibility: $visibility,
            emotion: coalesce($emotion, null),
            severity: coalesce($severity, null),
            gifUrl: coalesce($gifUrl, null),
            publicImageUrl: coalesce($publicImageUrl, null),
            suspended: coalesce($suspended, false)
        })
        CREATE (u)-[r:POSTED]->(p)
        RETURN u, p, r
        `,
        {
          userId: userData.id,
          description: data.description,
          rawImage: data.rawImage || null,
          visibility: data.visibility,
          emotion: data.emotion || null,
          severity: data.severity || null,
          gifUrl: data.gifUrl || null,
          publicImageUrl: data.publicImageUrl || null,
          suspended: data.suspended || false,
          displayUserId:
            data.visibility.toString() === "anonymous" ? null : userData.id,
        }
      );
      if (!postResult.records.length) {
        throw new Error("Failed to create post or link to user.");
      }
      const postData = postResult.records[0].get("p").properties;
      postId = postData.id || null;

      // Create the hashtags and link to the post
      if (data.hashtags?.length) {
        const hashtagsResult = await tx.run(
          `
          MATCH (p:Post {id: $postId})
          UNWIND $hashtags as hashtag
          MERGE (h:Hashtag {name: hashtag})
          MERGE (p)-[r:TAGGED]->(h)

          RETURN p, r
          `,
          { hashtags: data.hashtags, postId: postData.id }
        );

        if (!hashtagsResult.records.length) {
          throw new Error("Failed to create post or link to user.");
        }

        console.log("🚀 ~ data.mentions:", data.mentions);
        // Create the mentions(username[] stripped from "@") and link to the post and mentioned user
        if (data.mentions?.length) {
          const mentionsResult = await tx.run(
            `
          MATCH (p:Post {id: $postId})

          UNWIND $mentions AS mention

          // Only match users that exist
          MATCH (m:User {username: mention})

          // Create the MENTIONED relationship only for existing users
          MERGE (p)-[r:MENTIONED]->(m)

          RETURN p, collect(r) AS relationships
            `,
            {
              mentions: data.mentions,
              postId: postData.id,
            }
          );

          if (!mentionsResult.records.length) {
            throw new Error("Failed to create post or link to user.");
          }
        }
      }

      // Commit the transaction
      await tx.commit();
    } catch (error) {
      console.error("An error occurred:", error);
      // If an error occurs, roll back the transaction
      if (tx) {
        await tx.rollback();
      }
      reject({ success: false });
    } finally {
      // Close the session
      if (session) {
        await session.close();
      }
    }
    if (postId !== null) {
      resolve({ success: true, postId: postId });
    } else {
      reject({ success: false });
    }
  });
}
