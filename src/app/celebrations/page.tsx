import { store } from "@/lib/store";
import ProductCard from "@/components/ui/ProductCard";
import CelebrationBundleBuilder from "@/components/celebrations/CelebrationBundleBuilder";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celebrations & Party Essentials | Cake Magic Rajahmundry",
  description:
    "Party poppers, sparkling candles, bespoke acrylic toppers, and celebration bundles in Rajahmundry.",
};

export default function CelebrationsPage() {
  const partyItems = store
    .getProducts()
    .filter((p) => p.category === "celebrations" && p.active);

  const cakes = store
    .getProducts()
    .filter((p) => p.category === "cakes" && p.active);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
          Party Styling &bull; Rajahmundry
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
          Celebrations &amp; Essentials
        </h1>
        <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2.5">
          Elevate your cake cutting moments with acrylic toppers, slow-burning sparkler candles, and festive party accessories.
        </p>
      </div>

      {/* Future-Ready Celebration Bundle Builder */}
      <CelebrationBundleBuilder cakes={cakes} accessories={partyItems} />

      {/* Individual Party Accessories */}
      <div>
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[var(--foreground)]">
            Individual Celebration Essentials
          </h2>
          <p className="text-xs text-[var(--foreground-muted)] mt-1">
            Add these accessories to any cake enquiry or pickup in store.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {partyItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
