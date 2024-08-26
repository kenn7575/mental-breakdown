import { getStorage } from "firebase-admin/storage";

import pkg, { ServiceAccount } from "firebase-admin";
import serviceAccount from "../../service-account.json";

try {
  // Vercel;
  const raw = process.env.FIREBASE_PRIVATE_KEY;
  const key = raw?.replaceAll("[REPLACE]", "\n");

  if (!pkg.apps.length) {
    const creds = {
      credential: pkg.credential.cert(serviceAccount as ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    };

    pkg.initializeApp(creds);
  }
  console.log("Firebase admin initialized");
} catch (error: any) {
  if (!/already exists/.test(error.message)) {
    console.error("Firebase admin initialization error", error.stack);
  }
}
export const adminStorage = getStorage();
