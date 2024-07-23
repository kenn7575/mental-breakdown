// pages/api/suggestions.ts
// "use server";

import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

const mockHashtags = [
  "#javascript",
  "#react",
  "#nextjs",
  "#typescript",
  "#tailwindcss",
];
const mockUsers = ["@john", "@jane", "@doe", "@smith", "@admin"];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query");
  const type = searchParams.get("type");

  if (typeof query !== "string" || typeof type !== "string") {
    return NextResponse.error();
  }

  const data = type === "hashtag" ? mockHashtags : mockUsers;
  const suggestions = data.filter((item) => item.includes(query));

  return NextResponse.json({
    suggestions: suggestions.map((name, index) => ({
      id: index.toString(),
      name,
    })),
  });
}
