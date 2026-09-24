import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const occasions = [
  {
    title: "Birthday",
    subtitle: "Milestone & Theme Cakes",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Birthday",
  },
  {
    title: "Anniversary",
    subtitle: "Romantic & Tiered Florals",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Anniversary",
  },
  {
    title: "Wedding",
    subtitle: "Grand Tiered Masterpieces",
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Wedding",
  },
  {
    title: "Baby Celebration",
    subtitle: "Showers, Naming & 1st Years",
    image: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Baby+Celebration",
  },
  {
    title: "Kids",
    subtitle: "Superhero, Fantasy & Fun",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Kids",
  },
  {
    title: "Graduation",
    subtitle: "Success & New Chapters",
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Graduation",
  },
  {
    title: "Just Because",
    subtitle: "Bento, Desserts & Tea Cakes",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=800&auto=format&fit=crop",
    href: "/cakes?occasion=Just+Because",
  },
];

export default function OccasionDiscovery() {
  return (
    <section className="py-16 md:py-24 bg-[var(--surface-alt)]/60 border-y border-[var(--surface-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--primary)]">
            Curated For Every Milestone
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
            What Are You Celebrating?
          </h2>
          <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-3 leading-relaxed">
            Every celebration in Rajahmundry has its own rhythm. Select your special occasion to explore tailored cake designs and flavours.
          </p>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {occasions.map((occ) => (
            <Link
              key={occ.title}
              href={occ.href}
              className="group relative rounded-xl overflow-hidden aspect-4/5 bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs hover:shadow-md transition-shadow duration-300"
            >
              <Image
                src={occ.image}
                alt={`${occ.title} celebration cakes`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-108"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/85 via-[var(--foreground)]/25 to-transparent transition-opacity group-hover:from-[var(--foreground)]/90" />

              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-end text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[var(--primary-foreground)]">
                      {occ.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[var(--accent-champagne-light)] mt-0.5 line-clamp-1">
                      {occ.subtitle}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-[var(--primary)] transition-all">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:text-[var(--primary)] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
