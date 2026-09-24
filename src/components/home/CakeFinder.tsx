"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, RefreshCw, ArrowRight, Check } from "lucide-react";
import { Product } from "@/types";

interface CakeFinderProps {
  products: Product[];
}

export default function CakeFinder({ products }: CakeFinderProps) {
  const [occasion, setOccasion] = useState<string>("Birthday");
  const [recipient, setRecipient] = useState<string>("Family / Parents");
  const [taste, setTaste] = useState<string>("Chocolate");

  const occasions = ["Birthday", "Anniversary", "Kids", "Wedding", "Celebrations"];
  const recipients = ["Kids / Children", "Partner / Spouse", "Family / Parents", "Friends & Colleagues"];
  const tastes = ["Chocolate", "Fruit & Tangy", "Caramel & Nutty", "Eggless Special"];

  // Recommendation matcher logic
  const matchedProducts = products.filter((p) => {
    if (p.category !== "cakes") return false;

    // Filter by eggless if user specifically chose Eggless Special
    if (taste === "Eggless Special" && !p.eggless) return false;

    // Check taste preference match
    if (taste === "Chocolate") {
      const isChoc =
        p.subcategory.toLowerCase().includes("chocolate") ||
        p.name.toLowerCase().includes("chocolate") ||
        p.name.toLowerCase().includes("black forest") ||
        p.flavours.some((f) => f.toLowerCase().includes("choc"));
      if (!isChoc) return false;
    }

    if (taste === "Fruit & Tangy") {
      const isFruit =
        p.subcategory.toLowerCase().includes("fruit") ||
        p.name.toLowerCase().includes("red velvet") ||
        p.name.toLowerCase().includes("fruit") ||
        p.flavours.some((f) => f.toLowerCase().includes("fruit") || f.toLowerCase().includes("berry"));
      if (!isFruit) return false;
    }

    if (taste === "Caramel & Nutty") {
      const isNutty =
        p.name.toLowerCase().includes("biscoff") ||
        p.name.toLowerCase().includes("butterscotch") ||
        p.name.toLowerCase().includes("pistachio");
      if (!isNutty) return false;
    }

    return true;
  }).slice(0, 3);

  // Fallback to top products if strict filter matches fewer than 2
  const displayRecommendations =
    matchedProducts.length >= 2
      ? matchedProducts
      : products.filter((p) => p.category === "cakes" && p.featured).slice(0, 3);

  return (
    <section className="py-20 bg-[var(--surface-alt)]/50 border-t border-[var(--surface-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-champagne)]/60 text-xs font-semibold text-[var(--accent-champagne-foreground)] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Lightweight Interactive Guide</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)]">
            Not Sure What to Choose?
          </h2>
          <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2">
            Answer 3 simple questions and let us suggest the ideal handcrafted creation for your moment in Rajahmundry.
          </p>
        </div>

        {/* Wizard Controls */}
        <div className="max-w-4xl mx-auto bg-[var(--surface)] p-6 sm:p-8 rounded-3xl border border-[var(--surface-border)] shadow-md space-y-6">
          {/* Question 1: Occasion */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-2.5">
              1. What is the occasion?
            </label>
            <div className="flex flex-wrap gap-2">
              {occasions.map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setOccasion(occ)}
                  className={`tap-target text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all ${
                    occasion === occ
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                      : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface-border)] border border-[var(--surface-border)]"
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Who is it for? */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-2.5">
              2. Who are you celebrating with?
            </label>
            <div className="flex flex-wrap gap-2">
              {recipients.map((rec) => (
                <button
                  key={rec}
                  type="button"
                  onClick={() => setRecipient(rec)}
                  className={`tap-target text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all ${
                    recipient === rec
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                      : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface-border)] border border-[var(--surface-border)]"
                  }`}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Taste Preference */}
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-2.5">
              3. What flavour profile do they love?
            </label>
            <div className="flex flex-wrap gap-2">
              {tastes.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTaste(t)}
                  className={`tap-target text-xs sm:text-sm px-4 py-2 rounded-xl font-medium transition-all ${
                    taste === t
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                      : "bg-[var(--surface-alt)] text-[var(--foreground)] hover:bg-[var(--surface-border)] border border-[var(--surface-border)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Showcase */}
        <div className="mt-12 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6 px-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Recommended for your {occasion} celebration ({recipient})
            </h3>
            <span className="text-xs text-[var(--foreground-muted)]">
              {displayRecommendations.length} tailored recommendations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayRecommendations.map((product) => (
              <div
                key={product.id}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div className="relative aspect-4/3 w-full bg-[var(--surface-alt)]">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 300px"
                  />
                  {product.eggless && (
                    <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)]">
                      Eggless
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-base font-bold text-[var(--foreground)] line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 mt-1">
                      {product.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--surface-border)] flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--primary)]">
                      {product.startingPrice ? `From ₹${product.startingPrice}` : "Price on enquiry"}
                    </span>
                    <Link
                      href={`/cakes/${product.slug}`}
                      className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/cakes"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--primary)] underline"
            >
              Browse entire catalogue of celebration cakes &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
