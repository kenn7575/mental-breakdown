"use server";
import { getDriver } from "../../../neo4j";
import type { Session } from "neo4j-driver";
import { DeletePostComment } from "../../../types";

import { zodValidate } from "@/lib/zodValidate";
import { getTokenPayload } from "@/lib/data/getTokenPayload";

export async function detelePostComment(
  commentId: string | undefined
): Promise<{
  status: "success" | "error";
}> {
  return await new Promise(async (resolve, reject) => {
    // validate the data

    if (!commentId) {
      throw new Error("No comment id");
    }
    const user = await getTokenPayload();

    if (!user?.id) {
      reject("User not found");
    }

    // Create a new user
    const driver = await getDriver();
    let session: Session | null = null;

    try {
      session = driver.session();

      //Detele comment
      await session.run(`match (c:Comment {id: $commentId}) DETACH DELETE c;`, {
        commentId: commentId,
      });
      resolve({
        status: "success",
      });
    } catch (error) {
      console.error(error);
      resolve({ status: "error" });
    } finally {
      session && session.close();
    }
  });
}
