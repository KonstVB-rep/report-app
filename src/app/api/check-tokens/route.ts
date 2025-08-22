// app/api/check-tokens/route.ts
'use server'
// import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { jwtVerify } from "jose";

const accessTokenSecretKey = new TextEncoder().encode(
  process.env.JWT_SECRET_KEY
);

export async function GET(request: NextRequest) {
  // const cookieStore = await cookies(); 
  // const accessToken = cookieStore.get("accessToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;



  console.log(accessToken, 'accessToken');

  try {
    if (!accessToken) throw new Error("No token");
    const { payload } = await jwtVerify(accessToken, accessTokenSecretKey);

    return NextResponse.json({ isValid: true, payload });
  } catch {
    return NextResponse.json({ isValid: false });
  }
}
