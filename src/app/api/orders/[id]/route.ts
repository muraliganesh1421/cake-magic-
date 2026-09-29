import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { OrderStatusType } from "@/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = store.getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  return NextResponse.json(order);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    let updated = null;
    if (body.staffId) {
      updated = store.reassignOrder(id, body.staffId);
    }
    if (body.status) {
      updated = store.updateOrderStatus(id, body.status as OrderStatusType);
    }
    if (!updated) {
      return NextResponse.json({ error: "Order not found or invalid update" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PATCH /api/orders/[id]/status error:", err);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
