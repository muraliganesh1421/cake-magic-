import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const settings = store.getSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const updated = store.updateSettings(body);
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PATCH /api/settings error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
