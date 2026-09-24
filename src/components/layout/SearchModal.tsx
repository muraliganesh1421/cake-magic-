"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Sparkles, ArrowRight } from "lucide-react";
import { Product } from "@/types";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (e) {
        console.error("Search fetch error", e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Cake Magic creations"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--surface-border)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[var(--surface-border)] bg-[var(--surface-alt)]/50">
          <Search className="w-5 h-5 text-[var(--foreground-muted)] shrink-0 mr-3" />
          <input
            type="search"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chocolate truffle, red velvet, eggless, bento, croissants..."
            className="w-full bg-transparent border-none outline-none text-base text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-full hover:bg-[var(--surface-border)] text-[var(--foreground-muted)] mr-1"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-medium px-2.5 py-1 rounded bg-[var(--surface)] border border-[var(--surface-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[var(--surface-border)]/50">
          {loading && (
            <div className="py-8 text-center text-sm text-[var(--foreground-muted)] animate-pulse">
              Searching bakery & cakes in Rajahmundry...
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-base font-serif text-[var(--foreground)]">No direct match found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm text-[var(--foreground-muted)] mt-1.5 max-w-md mx-auto">
                Have a specific design in mind? You can send an enquiry directly or use our Custom Cake Builder.
              </p>
              <Link
                href="/custom-cakes"
                onClick={onClose}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Design Custom Cake
              </Link>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)] px-1">
                Found {results.length} item{results.length > 1 ? "s" : ""}
              </div>
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/cakes/${product.slug}`}
                  onClick={onClose}
                  className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-[var(--surface-alt)] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden relative shrink-0 bg-[var(--surface-alt)]">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="48px"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                          {product.name}
                        </span>
                        {product.eggless && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)]">
                            Eggless
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--foreground-muted)] line-clamp-1 mt-0.5">
                        {product.subcategory} &bull; {product.sizes.slice(0, 2).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-2">
                    <span className="text-xs font-medium text-[var(--primary)]">
                      {product.startingPrice ? `From ₹${product.startingPrice}` : "Price on enquiry"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!query && (
            <div className="py-6 space-y-4">
              <div className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Chocolate Truffle",
                  "Eggless",
                  "Red Velvet",
                  "Bento Cake",
                  "Lotus Biscoff",
                  "Milk Bread",
                  "Cheesecake",
                  "Brownie"
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-full bg-[var(--surface-alt)] hover:bg-[var(--surface-border)] text-[var(--foreground)] border border-[var(--surface-border)] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
