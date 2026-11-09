import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "wedding2025";
const AUTH_COOKIE_NAME = "admin_token";
// Simple secure token representation for admin session
const STATIC_AUTH_TOKEN = "auth_valid_session_token_wedding2025";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "Invalid password. Access denied." },
        { status: 401 }
      );
    }

    // Set secure, httpOnly cookie for 7 days
    const cookieStore = cookies();
    cookieStore.set(AUTH_COOKIE_NAME, STATIC_AUTH_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json(
      {
        success: true,
        message: "Authentication successful.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[AUTH_ERROR]", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  return NextResponse.json(
    { success: true, message: "Logged out successfully." },
    { status: 200 }
  );
}

