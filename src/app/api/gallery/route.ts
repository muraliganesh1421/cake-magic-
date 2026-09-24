import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const items = store.getGallery();
  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.image || !body.category) {
      return NextResponse.json({ error: "Title, image, and category are required" }, { status: 400 });
    }
    const item = store.addGalleryItem({
      title: body.title,
      image: body.image,
      category: body.category,
      flavour: body.flavour,
      occasion: body.occasion,
      featured: body.featured ?? false,
    });
    return NextResponse.json(item, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/gallery error:", err);
    return NextResponse.json({ error: "Failed to add gallery item" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  const success = store.deleteGalleryItem(id);
  return NextResponse.json({ success });
}
