"use client";

import { useState, useMemo } from "react";
import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { Filter, X, Search, Sparkles, RefreshCw, Check } from "lucide-react";
import Link from "next/link";

interface CatalogueViewProps {
  initialProducts: Product[];
  initialCategory?: string;
  initialOccasion?: string;
  initialEggless?: boolean;
}

export default function CatalogueView({
  initialProducts,
  initialCategory,
  initialOccasion,
  initialEggless = false,
}: CatalogueViewProps) {
  const [search, setSearch] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState<string>(initialOccasion || "All");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("All");
  const [selectedEggless, setSelectedEggless] = useState<boolean>(initialEggless);
  const [availableTodayOnly, setAvailableTodayOnly] = useState<boolean>(false);
  const [customizableOnly, setCustomizableOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract distinct subcategories and occasions
  const subcategories = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (p.subcategory) set.add(p.subcategory);
    });
    return ["All", ...Array.from(set)];
  }, [initialProducts]);

  const occasions = [
    "All",
    "Birthday",
    "Anniversary",
    "Wedding",
    "Baby Celebration",
    "Kids",
    "Graduation",
    "Just Because",
  ];

  // Filtering
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search
      if (search) {
        const q = search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesFlavour = product.flavours.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesFlavour) return false;
      }

      // Occasion
      if (selectedOccasion !== "All") {
        if (!product.occasions || !product.occasions.includes(selectedOccasion)) {
          return false;
        }
      }

      // Subcategory / Flavor style
      if (selectedSubcategory !== "All") {
        if (product.subcategory !== selectedSubcategory) {
          return false;
        }
      }

      // Eggless
      if (selectedEggless && !product.eggless) {
        return false;
      }

      // Available Today
      if (availableTodayOnly && !product.availableToday) {
        return false;
      }

      // Customizable
      if (customizableOnly && !product.customizable) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "featured") {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [
    initialProducts,
    search,
    selectedOccasion,
    selectedSubcategory,
    selectedEggless,
    availableTodayOnly,
    customizableOnly,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearch("");
    setSelectedOccasion("All");
    setSelectedSubcategory("All");
    setSelectedEggless(false);
    setAvailableTodayOnly(false);
    setCustomizableOnly(false);
    setSortBy("featured");
  };

  const activeFiltersCount =
    (selectedOccasion !== "All" ? 1 : 0) +
    (selectedSubcategory !== "All" ? 1 : 0) +
    (selectedEggless ? 1 : 0) +
    (availableTodayOnly ? 1 : 0) +
    (customizableOnly ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-[var(--surface-border)]">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
            Patisserie Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-1">
            Celebration Cakes
          </h1>
          <p className="text-sm text-[var(--foreground-muted)] mt-1.5 max-w-xl">
            Explore our curated menu of celebration cakes in Rajahmundry. Available for pre-booking, pickup, or local delivery.
          </p>
        </div>

        {/* Quick Counts & Mobile Filter Trigger */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden tap-target flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--surface-border-strong)] bg-[var(--surface)] text-xs font-semibold text-[var(--foreground)] shadow-xs"
          >
            <Filter className="w-4 h-4 text-[var(--primary)]" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-xs font-medium text-[var(--foreground-muted)]">
            Showing {filteredProducts.length} cake{filteredProducts.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Main Grid with Sidebar on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-6 sticky top-28">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <Filter className="w-4 h-4 text-[var(--primary)]" />
                <span>Filters</span>
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={resetFilters}
                  className="text-xs text-[var(--primary)] hover:underline font-medium"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Search within catalogue */}
            <div>
              <label className="block text-xs uppercase font-semibold text-[var(--foreground-muted)] mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--foreground-subtle)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Flavour, name..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            {/* Quick Checkbox Badges */}
            <div className="space-y-2.5 pt-2 border-t border-[var(--surface-border)]">
              <label className="flex items-center gap-2.5 text-xs text-[var(--foreground)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedEggless}
                  onChange={(e) => setSelectedEggless(e.target.checked)}
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="font-medium">100% Eggless Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[var(--foreground)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableTodayOnly}
                  onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="font-medium">Available Today</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[var(--foreground)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={customizableOnly}
                  onChange={(e) => setCustomizableOnly(e.target.checked)}
                  className="rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                />
                <span className="font-medium">Customizable Message</span>
              </label>
            </div>

            {/* Occasion Filter */}
            <div className="pt-2 border-t border-[var(--surface-border)]">
              <label className="block text-xs uppercase font-semibold text-[var(--foreground-muted)] mb-2">
                Occasion
              </label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {occasions.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedOccasion === occ
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
                    }`}
                  >
                    <span>{occ}</span>
                    {selectedOccasion === occ && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Style / Subcategory */}
            <div className="pt-2 border-t border-[var(--surface-border)]">
              <label className="block text-xs uppercase font-semibold text-[var(--foreground-muted)] mb-2">
                Style / Flavour
              </label>
              <div className="space-y-1">
                {subcategories.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      selectedSubcategory === sub
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                        : "text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
                    }`}
                  >
                    <span>{sub}</span>
                    {selectedSubcategory === sub && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid & Controls */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Filters Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[var(--surface-alt)]/60 p-3 rounded-2xl border border-[var(--surface-border)]">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-[var(--foreground-muted)] mr-1">
                Active:
              </span>
              {selectedOccasion !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[var(--surface)] text-[var(--foreground)] border border-[var(--surface-border)]">
                  {selectedOccasion}
                  <button onClick={() => setSelectedOccasion("All")}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {selectedSubcategory !== "All" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[var(--surface)] text-[var(--foreground)] border border-[var(--surface-border)]">
                  {selectedSubcategory}
                  <button onClick={() => setSelectedSubcategory("All")}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {selectedEggless && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)]">
                  Eggless
                  <button onClick={() => setSelectedEggless(false)}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {availableTodayOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-[var(--badge-gold-bg)] text-[var(--badge-gold-text)] border border-[var(--badge-gold-border)]">
                  Available Today
                  <button onClick={() => setAvailableTodayOnly(false)}>
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {activeFiltersCount === 0 && (
                <span className="text-xs text-[var(--foreground-muted)] italic">
                  All cakes showing
                </span>
              )}
            </div>

            {/* Sorting select */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-select" className="text-xs font-medium text-[var(--foreground-muted)]">
                Sort:
              </label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs py-1.5 px-2.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                <option value="featured">Featured First</option>
                <option value="name-asc">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center bg-[var(--surface)] rounded-3xl border border-[var(--surface-border)] p-8">
              <p className="font-serif text-2xl font-bold text-[var(--foreground)]">
                {availableTodayOnly
                  ? "No cakes are currently marked available today."
                  : "No cakes found matching your selection."}
              </p>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-2 max-w-md mx-auto">
                Try clearing active filters or explore designing a bespoke custom cake tailored to your exact taste.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="tap-target px-4 py-2 rounded-xl border border-[var(--surface-border-strong)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)]"
                >
                  Clear Filters
                </button>
                <Link
                  href="/custom-cakes"
                  className="tap-target px-5 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] shadow-xs inline-flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Design Custom Cake</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter cakes"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-xs sm:max-w-sm bg-[var(--surface)] h-full overflow-y-auto p-6 flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--surface-border)]">
                <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                  Filter Cakes
                </h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Toggles */}
              <div className="space-y-3">
                <label className="flex items-center justify-between text-sm text-[var(--foreground)]">
                  <span>100% Eggless Only</span>
                  <input
                    type="checkbox"
                    checked={selectedEggless}
                    onChange={(e) => setSelectedEggless(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between text-sm text-[var(--foreground)]">
                  <span>Available Today</span>
                  <input
                    type="checkbox"
                    checked={availableTodayOnly}
                    onChange={(e) => setAvailableTodayOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
                <label className="flex items-center justify-between text-sm text-[var(--foreground)]">
                  <span>Customizable</span>
                  <input
                    type="checkbox"
                    checked={customizableOnly}
                    onChange={(e) => setCustomizableOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                </label>
              </div>

              {/* Occasion Selection */}
              <div className="pt-4 border-t border-[var(--surface-border)]">
                <label className="block text-xs uppercase font-semibold text-[var(--foreground-muted)] mb-2">
                  Occasion
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {occasions.map((occ) => (
                    <button
                      key={occ}
                      onClick={() => setSelectedOccasion(occ)}
                      className={`text-xs p-2 rounded-lg border text-center transition-colors ${
                        selectedOccasion === occ
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                          : "border-[var(--surface-border)] text-[var(--foreground)]"
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--surface-border)] flex gap-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl border border-[var(--surface-border)] text-xs font-semibold text-[var(--foreground)]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
