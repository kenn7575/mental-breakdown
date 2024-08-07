import { getTokenPayload } from "@/app/actions/getTokenPayload";
import { CreatePost, User } from "@/lib/types";
import { NextApiRequest, NextApiResponse } from "next";

import { getDownloadURL } from "firebase-admin/storage";

import { NextRequest, NextResponse } from "next/server";

import { adminStorage } from "@/lib/firebaseAdmin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  console.log("🚀 ~ POST ~ file:", file);
  const dataString = formData.get("data") as string | null;
  console.log("🚀 ~ POST ~ dataString:", dataString);

  if (!file || !dataString) {
    console.error("Missing file or data");
    return NextResponse.json(
      { error: "Missing file or data" },
      { status: 400 }
    );
  }

  adminStorage
    .bucket("posts/public")
    .upload(file.name, {
      destination: file.name,
      public: true,
    })
    .then((response) => {
      console.log("🚀 ~ file uploaded ~ response:", response);
    });

  console.log("returning data");
  return NextResponse.json({ succses: true });
}

// const data = JSON.parse(dataString);
// console.log("🚀 ~ POST ~ data:", data);

// upload image to firebase
// if (fields.visibility !== "friends") {
//   const privateBucket = adminStorage.bucket("posts/private");
//   const file = privateBucket.file(data.image);
// } else {
//   //upload without generating public url
//   const publicBucket = adminStorage.bucket("posts/public");
// }
