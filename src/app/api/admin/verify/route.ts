import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  let token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/admin_session=([^;]+)/);
    if (match) token = match[1];
  }

  const user = verifySessionToken(token);
  if (!user || user.role !== "OWNER") {
    return NextResponse.json({ valid: false, error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ valid: true, user });
}
