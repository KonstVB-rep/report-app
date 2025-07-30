// app/api/check-tokens/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { jwtVerify } from "jose";

const accessTokenSecretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);

export async function GET() {
  const cookieStore = await cookies(); // await обязателен!
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    if (!accessToken) throw new Error("No token");
    await jwtVerify(accessToken, accessTokenSecretKey);
    return NextResponse.json({ isValid: true });
  } catch {
    return NextResponse.json({ isValid: false });
  }
}
