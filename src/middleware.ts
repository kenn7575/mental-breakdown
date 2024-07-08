import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("TOKEN")?.value;
  const headers = new Headers(request.headers);

  //get the relative path
  const path = new URL(request.url).pathname;

  if (!token) {
    headers.set("user", JSON.stringify(null));
    return NextResponse.next();
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  try {
    const { payload } = await jwtVerify(token, secret);
    headers.set("user", JSON.stringify(payload));
  } catch (error) {
    headers.set("user", JSON.stringify(null));
    request.cookies.delete("TOKEN");
  }

  return NextResponse.next({
    request: {
      headers: headers,
    },
  });
}

export const config = {
  matcher: ["/", "/login", "/sign-up", "/app"],
};
