import { getStorage } from "firebase-admin/storage";

import pkg from "firebase-admin";

try {
  // Vercel;
  const raw = process.env.FB_PRIVATE_KEY;
  const key = raw?.replaceAll("[REPLACE]", "\n");
  console.warn("key", key);
  pkg.initializeApp({
    credential: pkg.credential.cert({
      projectId: process.env.FB_PROJECT_ID,
      privateKey:
        process.env.NODE_ENV == "production" ? key : process.env.FB_PRIVATE_KEY,
      clientEmail: process.env.FB_CLIENT_EMAIL,
    }),
  });

  console.log("Firebase admin initialized");
} catch (error: any) {
  if (!/already exists/.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}

export const adminStorage = getStorage();
