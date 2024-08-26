import { getDownloadURL } from "firebase-admin/storage";
import { adminStorage } from "../firebaseAdmin";
import {
  convertToWebP,
  streamToBuffer,
} from "../Server/functions/imageProcessing";
import { User } from "../types/user";

export async function uploadFileToFirebaseStorage(
  file: File,
  user: User
): Promise<string> {
  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(`${user.id}/${file.name}`);
  const buffer = await streamToBuffer(file.stream());
  const webpBuffer = await convertToWebP(buffer);

  await fileRef.save(webpBuffer);
  const url = getDownloadURL(fileRef);
  return url;
}
