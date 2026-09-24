import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[var(--background)] pt-8 pb-14 md:pt-16 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Editorial Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Brand Eyebrow */}
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[var(--primary)] block">
                Cake Magic
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] font-medium block">
                Bespoke Cakes &amp; Bakery Creations &bull; Rajahmundry
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[var(--foreground)] leading-[1.12]">
              Your Celebration <br />
              <span className="italic font-normal text-[var(--primary)]">
                Deserves Its Own Cake.
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[var(--foreground-muted)] max-w-lg leading-relaxed">
              Handcrafted celebration cakes, bespoke creations and fresh patisserie, baked for life&apos;s sweetest moments in Rajahmundry.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/cakes"
                className="tap-target px-7 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-xs flex items-center justify-center gap-2 group"
              >
                <span>Explore Cakes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/custom-cakes"
                className="tap-target px-6 py-3.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border-strong)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent-blush-dark)]" />
                <span>Create Your Cake</span>
              </Link>
            </div>

            {/* Trust Line */}
            <div className="pt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--foreground-muted)] font-medium">
              <span>Local Rajahmundry Delivery</span>
              <span className="text-[var(--surface-border-strong)]">&bull;</span>
              <span>100% Eggless Available</span>
              <span className="text-[var(--surface-border-strong)]">&bull;</span>
              <span>Custom Cakes to Order</span>
            </div>
          </div>

          {/* Right Hero Visual Column (Single Strong Presentation) */}
          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden shadow-lg border border-[var(--surface-border)] bg-[var(--surface)]">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
                  alt="Cake Magic Belgian Chocolate Truffle Celebration Cake in Rajahmundry"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 550px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/50 via-transparent to-transparent pointer-events-none" />

                {/* Inset Label */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-[var(--surface)]/95 backdrop-blur-xs border border-[var(--surface-border)] shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--accent-blush-dark)] block">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
