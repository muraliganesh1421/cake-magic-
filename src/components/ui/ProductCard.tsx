"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0] || "/placeholder-cake.jpg";

  return (
    <div className="group flex flex-col bg-[var(--surface)] rounded-xl border border-[var(--surface-border)] overflow-hidden transition-all duration-300 hover:border-[var(--surface-border-strong)] hover:shadow-sm">
      {/* Image Container */}
      <Link href={`/cakes/${product.slug}`} className="relative aspect-4/3 w-full overflow-hidden bg-[var(--surface-alt)] block">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />

        {/* Relevant Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 pointer-events-none">
          {product.eggless ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[var(--surface)]/95 text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--badge-eggless-text)]"></span>
              Eggless
            </span>
          ) : product.availableToday ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--surface)]/95 text-[var(--badge-gold-text)] border border-[var(--badge-gold-border)] shadow-xs">
              Available Today
            </span>
          ) : null}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link href={`/cakes/${product.slug}`} className="block group-hover:text-[var(--primary)] transition-colors">
            <h3 className="font-serif text-base sm:text-lg font-bold text-[var(--foreground)] line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-[var(--foreground-muted)] line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-[var(--surface-border)] flex items-center justify-between gap-3">
          {product.startingPrice ? (
            <span className="text-sm font-semibold text-[var(--primary)]">
              ₹{product.startingPrice}
            </span>
          ) : (
            <span className="text-[11px] text-[var(--foreground-muted)]">
              {product.sizes[0] ? `From ${product.sizes[0]}` : "Made to order"}
            </span>
          )}

          <Link
            href={`/cakes/${product.slug}`}
            className="tap-target px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[var(--surface-alt)] hover:bg-[var(--primary)] hover:text-[var(--primary-foreground)] text-[var(--foreground)] transition-colors inline-flex items-center gap-1 group/btn"
          >
            <span>View Cake</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
