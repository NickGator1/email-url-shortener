import { nanoid } from "nanoid";

export function generateRandomString(length = 8): string {
  const code = nanoid(length);
  return code;
}