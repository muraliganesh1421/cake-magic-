import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, ShieldCheck } from "lucide-react";

export default function EgglessBanner() {
  return (
    <section className="py-16 md:py-20 bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[var(--surface-alt)] border border-[var(--surface-border)] overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border border-[var(--badge-eggless-border)] text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5" />
              <span>Dedicated Eggless Selection &bull; Rajahmundry</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight leading-tight">
              Big Celebrations. <br />
              <span className="italic text-[var(--primary)] font-normal">Eggless Too.</span>
            </h2>

            <p className="text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed max-w-xl">
              We believe zero compromises should be made on texture, fluffiness, or luxurious mouthfeel. Our eggless cakes are formulated with artisanal precision so every family member and guest enjoys every slice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[var(--foreground-muted)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--badge-eggless-text)] shrink-0" />
                <span>100% Vegetarian options available</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--badge-eggless-text)] shrink-0" />
                <span>Dedicated clean preparation standards</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--badge-eggless-text)] shrink-0" />
                <span>Rich Belgian chocolates & fruit sponges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--badge-eggless-text)] shrink-0" />
                <span>Custom eggless wedding & bento cakes</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/eggless"
                className="tap-target inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-md group"
              >
                <span>Explore Eggless Cakes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:col-span-5 relative h-72 sm:h-96 lg:h-full min-h-[360px] bg-[var(--surface-muted)]">
            <Image
              src="https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=800&auto=format&fit=crop"
              alt="Artisanal eggless celebration cake in Rajahmundry"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/50 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </div>
    </section>
  );
}
