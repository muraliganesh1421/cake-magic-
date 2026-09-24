import { store } from "@/lib/store";
import ProductCard from "@/components/ui/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fresh Bakery, Breads & Teatime Treats | Cake Magic Rajahmundry",
  description:
    "Daily fresh milk breads, 100% whole wheat loaves, cardamom rusks, festive plum cakes, and pure butter cashew cookies in Rajahmundry.",
};

export default function BakeryPage() {
  const bakeryItems = store
    .getProducts()
    .filter((p) => p.category === "bakery" && p.active);

  const subcategories = Array.from(new Set(bakeryItems.map((b) => b.subcategory)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
          Baked Daily &bull; Rajahmundry
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
          Fresh Bakery &amp; Breads
        </h1>
        <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2.5">
          Pure butter loaves, twice-baked aromatic rusks, spiced plum cakes, and tea-time crunch, crafted with traditional bakery standards.
        </p>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["All Bakery", ...subcategories].map((sub) => (
            <span
              key={sub}
              className="text-xs px-3 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--surface-border)] text-[var(--foreground)] font-medium"
            >
              {sub}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {bakeryItems.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
