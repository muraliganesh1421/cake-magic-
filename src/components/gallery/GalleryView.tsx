"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { GalleryItem } from "@/types";
import { Sparkles, ArrowRight, Eye, MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/config/site";

interface GalleryViewProps {
  items: GalleryItem[];
}

export default function GalleryView({ items }: GalleryViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Birthday",
    "Kids",
    "Wedding",
    "Anniversary",
    "Designer",
    "Bento",
    "Photo Cakes",
    "Celebrations",
  ];

  const filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
          Celebration Portfolio
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
          Cake Magic Gallery
        </h1>
        <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2.5">
          Browse bespoke birthday themes, grand multi-tiered wedding gateaux, and Korean bento creations crafted for clients across Rajahmundry.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`tap-target text-xs px-4 py-2 rounded-xl font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-xs"
                  : "bg-[var(--surface-alt)] text-[var(--foreground)] border border-[var(--surface-border)] hover:bg-[var(--surface-border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl overflow-hidden bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative aspect-square w-full bg-[var(--surface-alt)] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[var(--foreground)] line-clamp-1">
                  {item.title}
                </h3>
                {item.flavour && (
                  <p className="text-xs text-[var(--foreground-muted)] line-clamp-1 mt-1">
                    Flavour: {item.flavour}
                  </p>
                )}
                {item.occasion && (
                  <span className="text-[11px] text-[var(--accent-blush-dark)] font-medium mt-0.5 block">
                    {item.occasion}
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-[var(--surface-border)] flex items-center justify-between gap-2">
                <Link
                  href={`/custom-cakes?refOccasion=${encodeURIComponent(item.category)}&flavour=${encodeURIComponent(item.flavour || "")}`}
                  className="tap-target text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Find Similar</span>
                </Link>

                <a
                  href={buildWhatsAppLink(
                    `Hi Cake Magic, I love this cake from your gallery: "${item.title}" (${item.category}). Could you share feasibility and pricing for an upcoming event in Rajahmundry?`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target p-2 rounded-xl text-[var(--primary)] hover:bg-[var(--surface-alt)] transition-colors"
                  aria-label="Enquire about this cake on WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
