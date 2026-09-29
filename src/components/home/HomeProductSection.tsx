"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types";
import { ArrowRight, Sparkles } from "lucide-react";

interface HomeProductSectionProps {
  products: Product[];
}

type FilterTab =
  | "ALL"
  | "BIRTHDAY"
  | "ANNIVERSARY"
  | "CHOCOLATE"
  | "PHOTO_CAKES"
  | "EGGLESS"
  | "DESSERTS";

export default function HomeProductSection({ products }: HomeProductSectionProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "ALL", label: "All Popular Cakes" },
    { key: "BIRTHDAY", label: "Birthday" },
    { key: "ANNIVERSARY", label: "Anniversary" },
    { key: "CHOCOLATE", label: "Chocolate Specials" },
    { key: "PHOTO_CAKES", label: "Photo Cakes" },
    { key: "EGGLESS", label: "100% Eggless" },
    { key: "DESSERTS", label: "Desserts & Pastries" },
  ];

  const filteredProducts = useMemo(() => {
    switch (activeTab) {
      case "BIRTHDAY":
        return products.filter(
          (p) =>
            p.occasions?.some((o) => o.toLowerCase().includes("birthday")) ||
            p.name.toLowerCase().includes("birthday") ||
            p.category === "cakes"
        );
      case "ANNIVERSARY":
        return products.filter(
          (p) =>
            p.occasions?.some((o) => o.toLowerCase().includes("anniversary") || o.toLowerCase().includes("wedding")) ||
            p.name.toLowerCase().includes("anniversary") ||
            p.name.toLowerCase().includes("red velvet") ||
            p.name.toLowerCase().includes("truffle")
        );
      case "CHOCOLATE":
        return products.filter(
          (p) =>
            p.flavours.some((f) => f.toLowerCase().includes("chocolate") || f.toLowerCase().includes("truffle")) ||
            p.name.toLowerCase().includes("chocolate") ||
            p.name.toLowerCase().includes("truffle")
        );
      case "PHOTO_CAKES":
        return products.filter(
          (p) =>
            p.customizable &&
            (p.name.toLowerCase().includes("photo") ||
              p.description.toLowerCase().includes("photo") ||
              p.category === "cakes")
        );
      case "EGGLESS":
        return products.filter((p) => p.eggless);
      case "DESSERTS":
        return products.filter((p) => p.category === "desserts" || p.category === "bakery");
      case "ALL":
      default:
        return products.filter((p) => p.featured || p.category === "cakes").slice(0, 12);
    }
  }, [products, activeTab]);

  return (
    <section id="menu" className="py-10 md:py-16 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--primary)]">
                Our Fresh Bakery Menu
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface-alt)] font-semibold text-[var(--foreground-muted)]">
                Rajahmundry
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--foreground)] mt-1">
              Choose Your Celebration Cake
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1 max-w-xl">
              Freshly baked with premium chocolate, fresh cream, and natural fruits. Select your size, flavour, and custom message.
            </p>
          </div>

          <Link
            href="/cakes"
            className="tap-target inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline self-start md:self-auto shrink-0"
          >
            <span>View Full Catalogue ({products.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`tap-target text-xs px-4 py-2 rounded-xl whitespace-nowrap font-medium transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs font-semibold"
                    : "bg-[var(--surface-alt)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-border)]/60"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.slice(0, 12).map((product) => {
            const image = product.images[0] || "/placeholder-cake.jpg";
            return (
              <div
                key={product.id}
                className="group flex flex-col bg-[var(--background)] rounded-2xl border border-[var(--surface-border)] overflow-hidden transition-all duration-300 hover:shadow-md hover:border-[var(--primary)]/40"
              >
                {/* Image & Badges */}
                <Link
                  href={`/cakes/${product.slug}`}
                  className="relative aspect-4/3 w-full overflow-hidden bg-[var(--surface-alt)] block"
                >
                  <Image
                    src={image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10 pointer-events-none">
                    {product.eggless && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[var(--surface)]/95 text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)] shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--badge-eggless-text)]"></span>
                        Eggless
                      </span>
                    )}
                  </div>
                </Link>

                {/* Card Details */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-1">
                    <Link
                      href={`/cakes/${product.slug}`}
                      className="block group-hover:text-[var(--primary)] transition-colors"
                    >
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--foreground)] line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="pt-2 border-t border-[var(--surface-border)] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--foreground-muted)] block uppercase font-medium">
                        Starts at
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-[var(--primary)]">
                        ₹{product.startingPrice || 650}
                      </span>
                    </div>

                    <Link
                      href={`/cakes/${product.slug}`}
                      className="tap-target px-3 py-1.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] active:scale-95 transition-all shadow-xs inline-flex items-center gap-1"
                    >
                      <span>Order</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner to Full Catalogue */}
        <div className="mt-8 text-center pt-4">
          <Link
            href="/cakes"
            className="tap-target inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] hover:bg-[var(--surface-border)]/50 text-[var(--foreground)] text-xs sm:text-sm font-semibold transition-colors"
          >
            <span>Browse All {products.length} Celebration Cakes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
