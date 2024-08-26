import "server-only";
import { getDriver } from "../../neo4j";
import type { Session } from "neo4j-driver";
import { CreateModerationReport } from "@/lib/types/moderation";

import { createModerationReportSchema } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
export async function createModerationReport(
  data: CreateModerationReport
): Promise<{
  success: boolean;
}> {
  return await new Promise(async (resolve, reject) => {
    // validate the data
    const result = zodValidate(createModerationReportSchema, data);
    if (!result.success) {
      reject({ success: false });
    }

    // Create a new user
    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      //create a moderation report
      const queryResult = await session.run(
        `CREATE (m:ModerationReport {
          id: string(randomUUID()),
          userId: $userId,
          action: $action,
          flags: $flags,
          createdAt: datetime(),
          content: $content,})
        MERGE (p:Post {id: $postId})-[:TRIGGERED {createdAt: datetime()}]->(m);`,
        {
          userId: data.userId,
          postId: data.postId,
          action: data.action,
          flags: data.flags.join(","),
          content: data.content,
        }
      );

      if (!queryResult.records.length) {
        throw new Error("Failed to create comment");
      }
    } catch (error) {
      console.error(error);
      reject({ success: false });
    } finally {
      session && session.close();
    }
    resolve({
      success: true,
    });
  });
}
