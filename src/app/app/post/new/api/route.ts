import { getTokenPayload } from "@/app/actions/getTokenPayload";
import {
  CreatePost as CreatePostType,
  CreatePostFormData,
} from "@/lib/types/post";
import { NextRequest, NextResponse } from "next/server";
import {
  convertToWebP,
  streamToBuffer,
} from "@/lib/Server/functions/imageProcessing";
import { uploadFileToFirebaseStorage } from "@/lib/firebaseStorage/uploadImage";
import { CreatePostFormDataSchema } from "@/lib/zodSchemas";
import { moderateText } from "@/lib/Server/functions/moderationHandler";
import { ActionResponse, CreateModerationReport } from "@/lib/types/moderation";
import { createPost } from "@/lib/database/posts/post";
import { UUID } from "crypto";
import { createModerationReport } from "@/lib/database/moderation/post";
import { Truck } from "lucide-react";

type responseType = {
  success: boolean;
  fieldErrors?: any;
  moderations?: object;
  action?: string;
  serverError?: string;
};
export async function POST(
  req: NextRequest
): Promise<NextResponse<responseType>> {
  //steps
  //1. get user
  //2. get form data
  //3 validate using zod
  //4. Modate the description using openai
  //5. process the image
  //6. upload image
  //7. detect hashtags and mentions in the description
  //8. upload post to AuraDB
  //9. Handle flaged moderation

  //1. get user
  const user = await getTokenPayload();
  if (!user || !user.id)
    return NextResponse.json(
      { serverError: "User not found", success: false },
      { status: 401 }
    );

  //2. get form data
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const fields = JSON.parse(
    formData.get("data") as string
  ) as CreatePostFormData;
  console.log("🚀 ~ POST ~ fields:", fields);

  //3. validate using zod
  const schemaResult = CreatePostFormDataSchema.safeParse(fields);
  if (!schemaResult.success) {
    const flatErrors = schemaResult.error.flatten();

    return NextResponse.json(
      { fieldErrors: flatErrors.fieldErrors, success: false },
      { status: 400 }
    );
  }

  //? start assembling the post data
  const postData: CreatePostType = {
    description: schemaResult.data.description,
    visibility: schemaResult.data.visibility,
    userId: user.id,
  };

  //4. Modate the descripxtion using openai
  const moderation = await moderateText(fields.description);
  console.log("🚀 ~ moderation:", moderation);

  if (moderation.flags?.length > 0) {
    const allowUpload = moderation.action !== ActionResponse.QUARANTINE;

    //if forceFlaggedContent is true, the user has ben warned
    // of the moderation and decided to post anyway.
    if (allowUpload && !fields.forceFlaggedContent) {
      //warn user of potentiel violation
      return NextResponse.json(
        { success: false, moderation: moderation },
        { status: 400 }
      );
    }

    //suspend post if its contains heavy moderation
    const suspendPost =
      moderation.action === ActionResponse.SUSPEND ||
      moderation.action === ActionResponse.QUARANTINE;
    if (suspendPost) postData.suspended = true;
  }

  if (schemaResult.data.emotion) postData.emotion = schemaResult.data.emotion;
  if (schemaResult.data.severity)
    postData.severity = schemaResult.data.severity;
  if (schemaResult.data.gifUrl) postData.gifUrl = schemaResult.data.gifUrl;

  //5 - 6. process and upload the image
  if (file && !fields.gifUrl) {
    //check if type is image
    if (!file.type.startsWith("image")) {
      return NextResponse.json(
        { error: "File uploaded is not an image", success: false },
        { status: 400 }
      );
    }
    try {
      if (fields.visibility === "friends") {
        //uplod directly to database
        const buffer = await streamToBuffer(file.stream());
        const webpBuffer = await convertToWebP(buffer);
        postData.rawImage = webpBuffer;
      } else {
        //upload to firebase
        postData.publicImageUrl = await uploadFileToFirebaseStorage(file, user);
      }
    } catch (error) {
      console.error("Error handling file upload:", error);
      return NextResponse.json(
        { error: "Error uploading image", success: false },
        { status: 500 }
      );
    }
  }

  //7. detect hashtags and mentions in the description
  const hashtags = fields.description.match(/#[a-zA-Z0-9]+/g);
  if (hashtags) {
    postData.hashtags = hashtags.map((tag) => tag.toLowerCase());
  }

  const mentions = fields.description.match(/@[a-zA-Z0-9]+/g);
  if (mentions) {
    postData.mentions = mentions.map((mention) =>
      mention.toLowerCase().slice(1)
    );
  }

  console.log("🚀 ~ postData:", postData);

  //8. upload post to AuraDB
  let postId: null | UUID = null;
  try {
    const res = await createPost(postData);
    console.log("🚀 ~ success:", res.success);
    if (!res.success) {
      return NextResponse.json(
        { error: "Error creating post", success: false },
        { status: 500 }
      );
    }
    postId = res.postId;
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Error creating post", success: false },
      { status: 500 }
    );
  }

  //9. moderate post
  if (moderation.action !== ActionResponse.NONE) {
    const MRData: CreateModerationReport = {
      action: moderation.action,
      userId: user.id,
      postId,
      content: fields.description,
      flags: moderation.flags,
    };
    try {
      createModerationReport(MRData);
    } catch (error) {
      console.error("Could not create report", error);
    }
    if (moderation.action === ActionResponse.QUARANTINE) {
      //lock user
    }
  }

  return NextResponse.json({ success: true });
}
