import { NextResponse } from "next/server";
import { store } from "@/lib/store";

/**
 * GET /api/orders — Returns all orders (admin/staff use, no auth in demo)
 * In production, add authentication middleware here.
 */
export async function GET() {
  const orders = store.getOrders();
  return NextResponse.json(orders);
}
