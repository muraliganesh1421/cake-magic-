import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const requests = store.getCustomRequests();
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.customerName || !body.phone || !body.occasion) {
      return NextResponse.json(
        { error: "Customer name, phone number, and occasion are required" },
        { status: 400 }
      );
    }
    const newRequest = store.createCustomRequest({
      customerName: body.customerName,
      phone: body.phone,
      whatsapp: body.whatsapp || body.phone,
      occasion: body.occasion,
      flavour: body.flavour || "Vanilla Bean",
      size: body.size || "1 kg",
      eggless: Boolean(body.eggless),
      message: body.message || "",
      referenceImage: body.referenceImage || "",
      deliveryDate: body.deliveryDate || "",
      deliveryTime: body.deliveryTime || "",
      deliveryType: body.deliveryType || "Pickup",
      address: body.address || "",
      notes: body.notes || "",
    });
    return NextResponse.json(newRequest, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/custom-requests error:", err);
    return NextResponse.json({ error: "Failed to create custom request" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }
    const updated = store.updateCustomRequestStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PATCH /api/custom-requests error:", err);
    return NextResponse.json({ error: "Failed to update custom request" }, { status: 500 });
  }
}
