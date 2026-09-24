"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { MessageCircle, Sparkles, Eye, Check } from "lucide-react";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";
import QuickViewModal from "./QuickViewModal";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const primaryImage = product.images[0] || "/placeholder-cake.jpg";
  const displayPrice = product.startingPrice
    ? `From ₹${product.startingPrice}`
    : "Price on enquiry";

  const defaultSize = product.sizes[0] || "1 kg";
  const whatsappUrl = buildWhatsAppLink(
    WhatsAppTemplates.productEnquiry(product.name, defaultSize)
  );

  return (
    <>
      <div className="group flex flex-col bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[var(--surface-border-strong)]">
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full overflow-hidden bg-[var(--surface-alt)]">
          <Link href={`/cakes/${product.slug}`} className="block w-full h-full">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </Link>

          {/* Badges Container */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
            {product.eggless && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)] shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--badge-eggless-text)]"></span>
                Eggless
              </span>
            )}
            {product.availableToday && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[var(--badge-gold-bg)] text-[var(--badge-gold-text)] border border-[var(--badge-gold-border)] shadow-xs">
                Available Today
              </span>
            )}
          </div>

          {/* Quick View Button (hover desktop, always accessible on touch) */}
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-[var(--surface)]/90 backdrop-blur-xs text-[var(--foreground)] opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--surface)] shadow-md text-xs font-medium flex items-center gap-1.5"
            aria-label={`Quick view ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span className="hidden sm:inline">Quick View</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-medium tracking-wide uppercase text-[var(--foreground-muted)]">
                {product.subcategory}
              </span>
              {product.customizable && (
                <span className="text-[10px] font-medium text-[var(--accent-blush-dark)] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Customizable
                </span>
              )}
            </div>

            <Link href={`/cakes/${product.slug}`} className="block group-hover:text-[var(--primary)] transition-colors">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--foreground)] line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 mt-1.5 leading-relaxed">
              {product.description}
            </p>

            {/* Available Sizes List */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {product.sizes.map((size) => (
                <span
                  key={size}
                  className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--foreground-muted)] border border-[var(--surface-border)]"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          {/* Price & Action Row */}
          <div className="mt-5 pt-3.5 border-t border-[var(--surface-border)] flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] text-[var(--foreground-muted)] uppercase tracking-wider">
                Price
              </span>
              <span className="text-sm sm:text-base font-bold text-[var(--primary)]">
                {displayPrice}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Link
                href={`/cakes/${product.slug}`}
                className="tap-target px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface-alt)] hover:bg-[var(--surface-border)] text-[var(--foreground)] transition-colors inline-flex items-center justify-center"
              >
                Details
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-hover)] transition-colors inline-flex items-center gap-1.5 shadow-xs"
                aria-label={`Enquire about ${product.name} on WhatsApp`}
              >
                <MessageCircle className="w-3.5 h-3.5 text-[var(--accent-blush)]" />
                <span>Enquire</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={product}
      />
    </>
  );
}
