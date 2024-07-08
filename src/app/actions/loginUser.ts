"use server";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { getDriver } from "@/lib/neo4j";
import { LoginUserSchema } from "@/lib/zodSchemas";
import { zodValidate } from "@/lib/zodValidate";
import type { Session } from "neo4j-driver";
import { createToken } from "./createAuthToken";

export async function loginUser(
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
  const results = zodValidate(LoginUserSchema, rawFormData);
  if (results.success === false) {
    return results;
  }

  const { password, email } = results.data as {
    password: string;
    email: string;
  };

  // Create a new user
  const driver = await getDriver();
  let session: Session | null = null;
  let user: any = null;
  try {
    session = driver.session();

    //check if user already exists
    const users = await session.run(
      "MATCH (u:User {email: $email}) RETURN u, elementId(u)",
      {
        email: email,
      }
    );
    if (!users.records.length) {
      return {
        success: false,
        serverError: "Invalid email or password.",
      };
    }
    user = users.records[0].get("u").properties;

    // Check the password
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return {
        success: false,
        serverError: "Invalid email or password.",
      };
    }

    // Return the user
  } catch (error) {
    console.error(error);
    throw new Error("Failed to login user: " + JSON.stringify(error));
  } finally {
    session && session.close();
  }

  // create a jose jwt and safe it in a cookie

  createToken(user);

  return { success: true, data: user };
}
