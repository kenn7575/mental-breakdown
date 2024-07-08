"use server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getDriver } from "@/lib/neo4j";
import { CreateUserSchema } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
import type { Session } from "neo4j-driver";
import { createToken } from "./createAuthToken";
export async function createUser(
  prevState: any,
  formData: FormData
): Promise<{
  success: boolean;
  fieldErrors?: { email: string[]; password: string[] };
  serverError?: string;
  data?: any;
}> {
  // Get the form data
  const rawFormData = {
    password: formData.get("password"),
    email: formData.get("email"),
  };

  // Validate the form data
  const results = zodValidate(CreateUserSchema, rawFormData);
  if (results.success === false) {
    return results;
  }

  const { password, email } = results.data as {
    password: string;
    email: string;
  };

  // Hash the password
  const saltRounds = process.env.SALT_ROUNDS || 10;

  const passwordHash = await bcrypt.hash(password, Number(saltRounds));

  // Create a new user
  const driver = await getDriver();
  let session: Session | null = null;
  let user: any = null;
  try {
    session = driver.session();

    //check if user already exists
    const userExists = await session.run(
      "MATCH (u:User {email: $email}) RETURN u",
      { email: email }
    );

    if (userExists.records.length) {
      return {
        success: false,
        serverError: "User with that email already exists.",
      };
    }

    const users = await session.run(
      `
      CREATE (u:User {
      id: toString(randomUUID()),
      email: $email, 
      joined_date: $joined_date, 
      password: $password, 
      bio: $bio, 
      xp: $xp, 
      color_theme: $color_theme, 
      email_verified: $email_verified, 
      email_notifications: $email_notifications 
    }) RETURN u, elementId(u) as id;`,
      {
        email: email,
        joined_date: new Date().toISOString(),
        password: passwordHash,
        bio: "", // Convert null to empty string or handle appropriately
        xp: 0,
        color_theme: "dark",
        email_verified: false,
        email_notifications: false,
      }
    );
    if (!users.records.length) {
      return { success: false, serverError: "Failed to create user." };
    }
    user = users.records[0].get("u").properties;

    // Return the user
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create user: " + JSON.stringify(error));
  } finally {
    session && session.close();
  }

  // create a jose jwt and safe it in a cookie

  createToken(user);

  return { success: true, data: user };
}
