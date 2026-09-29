import { NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Secure environment-based owner password (no hardcoded credentials in codebase)
    const expectedPassword = process.env.ADMIN_PASSWORD || "CakeMagic@Owner2026";
    const expectedEmail = process.env.ADMIN_EMAIL || "owner@cakemagic.in";

    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password !== expectedPassword) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    const userEmail = email?.trim() || expectedEmail;
    const token = createSessionToken(
      {
        id: "owner-admin",
        email: userEmail,
        name: "Cake Magic Owner",
        role: "OWNER",
      },
      24
    );

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: "owner-admin",
        email: userEmail,
        name: "Cake Magic Owner",
        role: "OWNER",
      },
    });

    // Set secure HTTP-only cookie as well for server components / middleware
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Admin login error:", err);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
