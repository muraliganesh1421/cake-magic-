import { NextResponse } from "next/server";
import { getAutomationLogs } from "@/lib/events";

export async function GET() {
  try {
    const logs = getAutomationLogs();
    return NextResponse.json(logs);
  } catch (err) {
    console.error("Failed to read automation logs:", err);
    return NextResponse.json({ error: "Failed to load automation logs" }, { status: 500 });
  }
}
