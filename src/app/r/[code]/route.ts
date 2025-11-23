// Route to redirect to the original URL
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function GET(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  // Get the original URL from the database
  const originalUrl = await redis.get(`${code}`);
  if (!originalUrl) {
    return NextResponse.redirect(new URL("/404", request.url));
  }
  // Perform a temporary redirect to the original URL (302 redirect)
  return NextResponse.redirect(originalUrl as string, {
    status: 302,
  });
}