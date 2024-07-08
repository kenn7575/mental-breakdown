"use server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function createToken(user: any) {
  const SECRET = process.env.JWT_SECRET;
  if (!SECRET) {
    throw new Error("Missing JWT_SECRET in .env");
  }
  const secret = new TextEncoder().encode(SECRET);
  const jwt = await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1week")
    .sign(secret);

  cookies().set("TOKEN", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
  });
}
