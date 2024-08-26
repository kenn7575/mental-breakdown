import sharp from "sharp";

export async function streamToBuffer(
  stream: ReadableStream<Uint8Array>
): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
export async function convertToWebP(buffer: Buffer): Promise<Buffer> {
  try {
    const webpBuffer = await sharp(buffer).webp().toBuffer();

    return webpBuffer;
  } catch (error) {
    console.error("Error converting to webp", error);
    throw error;
  }
}
