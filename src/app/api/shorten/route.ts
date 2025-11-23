import { NextResponse } from "next/server";
import { generateRandomString } from "@/lib/shortener";
import { redis } from "@/lib/redis";

export async function POST(req: Request) {
  const { urls } = await req.json();

  if (!urls) {
    return NextResponse.json(
      { error: "URLs are required" },
      { status: 400 }
    );
  }

  // Generate a random string for each URL
  const shortCodes = urls.map(() => generateRandomString());

  // Verify the short codes don't already exist in the database
  // If any do, generate a new short code
  const existingShortCodes = await redis.mget(shortCodes.map((code: string) => `${code}`));
  for (let i = 0; i < shortCodes.length; i++) {
    if (existingShortCodes[i]) {
      shortCodes[i] = generateRandomString();
    }
  }

  // Store the short codes and original URLs in the database
  // Create key-value pairs: {code} -> url
  const keyValuePairs: Record<string, string> = {};
  shortCodes.forEach((code: string, index: number) => {
    keyValuePairs[code] = urls[index];
  });
  await redis.mset(keyValuePairs);

  // Return an array of objects containing the short code and the original URL
  return NextResponse.json(Object.entries(keyValuePairs).map(([shortCode, originalUrl]) => ({
    shortCode,
    originalUrl,
  })));
}