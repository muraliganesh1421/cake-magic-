import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, MapPin, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--background)] pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-12 left-1/4 w-72 h-72 bg-[var(--accent-champagne)]/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-24 right-10 w-96 h-96 bg-[var(--accent-blush-light)]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Local Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--surface-alt)] border border-[var(--surface-border)] text-xs font-semibold text-[var(--foreground)] shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Rajahmundry &bull; Rajamahendravaram</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-[1.12]">
              Your Celebration <br />
              <span className="italic font-normal text-[var(--primary)]">
                Deserves Its Own Cake.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-xl leading-relaxed">
              Bespoke cakes, timeless favourites and freshly baked treats, crafted for every special moment in Rajahmundry.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/cakes"
                className="tap-target px-7 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Explore Cakes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/custom-cakes"
                className="tap-target px-6 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border-strong)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent-blush-dark)]" />
                <span>Design Your Cake</span>
              </Link>
            </div>

            {/* Trust Line */}
            <div className="pt-4 border-t border-[var(--surface-border)]/80 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium text-[var(--foreground-muted)]">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--badge-eggless-text)]" />
                <span>Rajahmundry Local Delivery</span>
              </div>
              <span className="hidden sm:inline text-[var(--surface-border-strong)]">&bull;</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--badge-eggless-text)]" />
                <span>Custom Cakes to Order</span>
              </div>
              <span className="hidden sm:inline text-[var(--surface-border-strong)]">&bull;</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--badge-eggless-text)]" />
                <span>Eggless Options</span>
              </div>
              <span className="hidden sm:inline text-[var(--surface-border-strong)]">&bull;</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[var(--badge-eggless-text)]" />
                <span>Bakery & Desserts</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Column (Mobile Prioritized & High-Res) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Cake Presentation */}
              <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-[var(--surface)] bg-[var(--surface-alt)]">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
                  alt="Cake Magic Belgian Chocolate Truffle Celebration Cake in Rajahmundry"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Inset Badge */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--surface-border)] shadow-lg flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-blush-dark)]">
                      Artisanal Signature
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-bold text-[var(--foreground)]">
                      Belgian Dark Truffle Royale
                    </h3>
                  </div>
                  <Link
                    href="/cakes/belgian-chocolate-truffle"
                    className="tap-target px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors shrink-0"
                  >
                    View Cake
                  </Link>
                </div>
              </div>

              {/* Secondary Floating Mini Card */}
              <div className="hidden sm:flex absolute -bottom-6 -left-6 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xl max-w-xs items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
                  <Image
                    src="https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=300&auto=format&fit=crop"
                    alt="Bento mini cake"
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--badge-eggless-text)]">
                    Available Today
                  </span>
                  <p className="text-xs font-serif font-bold text-[var(--foreground)]">
                    Korean Aesthetic Bento
                  </p>
                  <span className="text-[11px] text-[var(--foreground-muted)]">
                    Perfect for 1&ndash;2 people
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
