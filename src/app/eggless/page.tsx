import { store } from "@/lib/store";
import CatalogueView from "@/components/catalogue/CatalogueView";
import { Metadata } from "next";
import { Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "100% Eggless Cakes | Cake Magic Rajahmundry",
  description:
    "Pure vegetarian and eggless cakes baked fresh in Rajahmundry. Truffle, Red Velvet, Biscoff, and customized celebration designs.",
};

export default function EgglessPage() {
  const egglessProducts = store
    .getProducts()
    .filter((p) => p.category === "cakes" && p.eggless && p.active);

  return (
    <div className="w-full bg-[var(--background)]">
      {/* Intro Header */}
      <div className="bg-[var(--badge-eggless-bg)]/60 border-b border-[var(--badge-eggless-border)] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--surface)] text-xs font-bold text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)] shadow-xs mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>Pure Vegetarian Dedicated Menu</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Big Celebrations. <span className="italic text-[var(--primary)]">Eggless Too.</span>
          </h1>
          <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-3">
            Every product on this page is formulated and baked 100% eggless with supreme moisture, rich crumb structure, and luxurious mouthfeel.
          </p>
        </div>
      </div>

      <CatalogueView
        initialProducts={egglessProducts}
        initialCategory="cakes"
        initialEggless={true}
      />
    </div>
  );
}
