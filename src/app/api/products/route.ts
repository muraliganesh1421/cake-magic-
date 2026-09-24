import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const eggless = searchParams.get("eggless");
  const availableToday = searchParams.get("availableToday");
  const featured = searchParams.get("featured");
  const q = searchParams.get("q");

  let products = store.getProducts().filter((p) => p.active);

  if (category) {
    products = products.filter((p) => p.category === category);
  }
  if (eggless === "true") {
    products = products.filter((p) => p.eggless);
  }
  if (availableToday === "true") {
    products = products.filter((p) => p.availableToday);
  }
  if (featured === "true") {
    products = products.filter((p) => p.featured);
  }
  if (q) {
    const query = q.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.flavours.some((f) => f.toLowerCase().includes(query)) ||
        p.subcategory.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.category) {
      return NextResponse.json({ error: "Name and category are required" }, { status: 400 });
    }
    const slug = body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const saved = store.saveProduct({
      ...body,
      id: body.id || `prod-${Date.now()}`,
      slug,
      active: body.active ?? true,
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/products error:", err);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
