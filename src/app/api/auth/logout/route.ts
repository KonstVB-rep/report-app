import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: "Вы вышли из системы" },
      { status: 200 }
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Произошла ошибка" }, { status: 500 });
  }
}
