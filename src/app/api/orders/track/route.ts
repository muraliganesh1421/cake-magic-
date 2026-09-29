import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("order")?.trim().toUpperCase();
  const phone = searchParams.get("phone")?.trim().replace(/\D/g, "");

  if (!orderId || !phone) {
    return NextResponse.json(
      { error: "Order number and phone number are required" },
      { status: 400 }
    );
  }

  const orders = store.getOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const storedPhone = order.customerPhone.replace(/\D/g, "");
  if (storedPhone !== phone && storedPhone.slice(-10) !== phone.slice(-10)) {
    return NextResponse.json(
      { error: "Phone number does not match order records" },
      { status: 403 }
    );
  }

  // Build a timeline for the order
  const timeline = buildTimeline(order.status, order.createdAt);

  return NextResponse.json({
    id: order.id,
    status: order.status,
    customerName: order.customerName,
    items: order.items,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.totalAmount,
    deliveryMethod: order.deliveryType,
    deliveryDate: order.deliveryDate,
    deliveryTime: order.deliveryTimeSlot,
    address: order.deliveryAddress,
    specialInstructions: order.specialInstructions,
    createdAt: order.createdAt,
    timeline,
  });
}

type OrderStatus = "PENDING" | "CONFIRMED" | "PAID" | "PREPARING" | "READY" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED" | "REFUNDED";

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  completed: boolean;
  active: boolean;
  timestamp?: string;
}

function buildTimeline(currentStatus: string, createdAt: string): TimelineStep[] {
  const statusOrder: OrderStatus[] = [
    "CONFIRMED",
    "PAID",
    "PREPARING",
    "READY",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const labels: Record<OrderStatus, { label: string; description: string }> = {
    PENDING: { label: "Order Placed", description: "Your order has been placed" },
    CONFIRMED: { label: "Confirmed", description: "Cake Magic has confirmed your order" },
    PAID: { label: "Payment Received", description: "Payment confirmed" },
    PREPARING: { label: "Baking in Progress", description: "Your cake is being freshly baked" },
    READY: { label: "Ready for Pickup / Dispatch", description: "Your cake is ready!" },
    OUT_FOR_DELIVERY: { label: "Out for Delivery", description: "Your cake is on the way" },
    DELIVERED: { label: "Delivered", description: "Enjoy your cake! 🎂" },
    CANCELLED: { label: "Cancelled", description: "This order was cancelled" },
    REFUNDED: { label: "Refunded", description: "Refund has been processed" },
  };

  const currentIdx = statusOrder.indexOf(currentStatus as OrderStatus);

  return statusOrder.map((status, idx) => ({
    status,
    label: labels[status].label,
    description: labels[status].description,
    completed: idx < currentIdx,
    active: idx === currentIdx,
    timestamp: idx === 0 ? createdAt : undefined,
  }));
}
