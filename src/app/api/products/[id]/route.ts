import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const success = store.deleteProduct(id);
  return NextResponse.json({ success });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const updated = store.saveProduct({ ...body, id });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("PUT /api/products/[id] error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
