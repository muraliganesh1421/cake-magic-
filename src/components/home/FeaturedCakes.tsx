import Link from "next/link";
import { Product } from "@/types";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight } from "lucide-react";

interface FeaturedCakesProps {
  products: Product[];
}

export default function FeaturedCakes({ products }: FeaturedCakesProps) {
  const featured = products
    .filter((p) => p.category === "cakes" && p.featured)
    .slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
              Signature Patisserie Creations
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-1.5">
              Made for the Moment
            </h2>
            <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2 max-w-xl">
              From decadent Belgian dark chocolate truffle to artisanal Lotus Biscoff, every recipe is hand-baked with premium ingredients.
            </p>
          </div>

          <Link
            href="/cakes"
            className="tap-target inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--primary)] hover:underline self-start md:self-auto"
          >
            <span>View All Cakes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
