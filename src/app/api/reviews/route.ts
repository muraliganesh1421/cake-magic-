import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const reviews = store.getReviews().filter((r) => r.active);
  return NextResponse.json(reviews);
}
