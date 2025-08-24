"use server";

import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

// app/api/check-tokens/route.ts

const accessTokenSecretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;

  try {
    if (!accessToken) throw new Error("No token");
    const { payload } = await jwtVerify(accessToken, accessTokenSecretKey);

    return NextResponse.json({ isValid: true, payload });
  } catch {
    return NextResponse.json({ isValid: false });
  }
}
