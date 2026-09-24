import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const enquiries = store.getEnquiries();
  return NextResponse.json(enquiries);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customer || !body.phone || !body.product) {
      return NextResponse.json(
        { error: "Customer name, phone, and product are required" },
        { status: 400 }
      );
    }
    const newEnquiry = store.createEnquiry({
      customer: body.customer,
      phone: body.phone,
      product: body.product,
      productId: body.productId,
      size: body.size,
      quantity: Number(body.quantity) || 1,
      date: body.date,
      time: body.time,
      deliveryType: body.deliveryType || "Pickup",
      address: body.address,
      message: body.message,
    });
    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/enquiries error:", err);
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }
    const updated = store.updateEnquiryStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PATCH /api/enquiries error:", err);
    return NextResponse.json({ error: "Failed to update enquiry" }, { status: 500 });
  }
}
