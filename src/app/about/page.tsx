import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Sparkles, Heart, Clock, Award, ShieldCheck, MapPin, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Cake Magic Rajahmundry",
  description:
    "Learn about Cake Magic, an artisanal patisserie and bespoke cake studio serving Rajahmundry, Andhra Pradesh with fresh baking, fine chocolate, and celebratory craftsmanship.",
};

export default function AboutPage() {
  const values = [
    {
      title: "Craftsmanship",
      icon: Sparkles,
      desc: "Every tier, buttercream flower, and chocolate ganache is hand-piped by dedicated cake decorators with meticulous attention to detail.",
    },
    {
      title: "Freshness",
      icon: Clock,
      desc: "We bake to order in Rajahmundry. No stale warehouse storage—pure dairy butter, fresh milk, and rich Belgian cocoa in every sponge.",
    },
    {
      title: "Celebration",
      icon: Heart,
      desc: "Whether a 1st birthday, silver wedding jubilee, or quiet teatime treat, we believe a great cake turns any gathering into an unforgettable memory.",
    },
    {
      title: "Personalization",
      icon: ShieldCheck,
      desc: "No two celebrations are identical. From custom flavour profiles to bespoke theme sculpting, your imagination shapes our kitchen.",
    },
  ];

  return (
    <div className="w-full bg-[var(--background)] py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 md:space-y-24">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
              Artisanal Bakery &bull; Rajahmundry
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] tracking-tight leading-tight">
              The Story Behind <br />
              <span className="italic text-[var(--primary)] font-normal">Cake Magic</span>
            </h1>
            <div className="space-y-4 text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
              <p>
                Cake Magic was founded with a singular ambition in Rajahmundry (Rajamahendravaram): to bring European patisserie elegance, authentic Belgian chocolate mastery, and uncompromised freshness to local celebrations.
              </p>
              <p>
                From celebratory multi-tier wedding cakes to minimalist Korean bento boxes and wholesome daily bakery breads, our kitchen operates on the belief that a cake should taste just as heavenly as it looks.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/custom-cakes"
                className="tap-target inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-md group"
              >
                <span>Design Your Cake</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop"
              alt="Cake Magic artisan kitchen baking in Rajahmundry"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
          </div>
        </div>

        {/* Brand Values */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
              Our Principles
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-2">
              Crafted With Purpose
            </h2>
            <p className="text-sm text-[var(--foreground-muted)] mt-2">
              Four commitments that guide every bake, every batch, and every celebration order.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent-blush-light)] text-[var(--primary)] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store & Location Section */}
        <div className="rounded-3xl bg-[var(--surface-alt)] border border-[var(--surface-border)] p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              <span>Visit Us in Rajahmundry</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Experience the Aroma of Fresh Baking
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
              Drop by our bakery counter in Rajahmundry to explore today&apos;s fresh bakes, pick up dessert tubs, or consult with our team on upcoming celebration cakes.
            </p>
            <div className="text-xs text-[var(--foreground-muted)] space-y-1">
              <div><strong>Address:</strong> {siteConfig.address}</div>
              <div><strong>Hours:</strong> {siteConfig.openingHours}</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="tap-target px-6 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs sm:text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-xs text-center"
            >
              Visit Cake Magic
            </Link>
            <Link
              href="/cakes"
              className="tap-target px-6 py-3.5 rounded-xl border border-[var(--surface-border-strong)] text-[var(--foreground)] text-xs sm:text-sm font-semibold hover:bg-[var(--surface)] transition-all text-center"
            >
              Explore Cakes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
