"use server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { User } from "@/lib/types";

export async function getTokenPayload(): Promise<User | null> {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) {
    throw new Error("Missing JWT_SECRET in .env");
  }

  const token = cookies().get("TOKEN")?.value;
  if (!token) {
    return null;
  }

  const secret = new TextEncoder().encode(SECRET);

  const { payload } = (await jwtVerify(token, secret)) as { payload: User };
  return payload;
}
