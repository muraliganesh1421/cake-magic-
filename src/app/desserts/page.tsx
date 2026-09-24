import { store } from "@/lib/store";
import ProductCard from "@/components/ui/ProductCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisanal Desserts & Brownies | Cake Magic Rajahmundry",
  description:
    "Indulge in rich Belgian brownies, molten choco lava, milk tres leches, basque burnt cheesecake, and French macarons in Rajahmundry.",
};

export default function DessertsPage() {
  const desserts = store
    .getProducts()
    .filter((p) => p.category === "desserts" && p.active);

  const subcategories = Array.from(new Set(desserts.map((d) => d.subcategory)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
          Sweet Indulgence &bull; Rajahmundry
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
          Desserts &amp; Confections
        </h1>
        <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2.5">
          From fudgy Belgian chocolate brownies to chilled tres leches and velvety cheesecakes, freshly prepared in our Rajahmundry kitchen.
        </p>

        {/* Subcategory Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {["All Desserts", ...subcategories].map((sub) => (
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
        {desserts.map((dessert) => (
          <ProductCard key={dessert.id} product={dessert} />
        ))}
      </div>
    </div>
  );
}
