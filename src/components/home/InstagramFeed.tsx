import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";

function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const kitchenShots = [
  {
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    caption: "Finishing Belgian chocolate ganache tiers",
  },
  {
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?q=80&w=600&auto=format&fit=crop",
    caption: "Velvety cream cheese piping for Red Velvet",
  },
  {
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop",
    caption: "Korean Bento cake lettering details",
  },
  {
    image: "https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600&auto=format&fit=crop",
    caption: "Lotus biscoff caramel drip in progress",
  },
];

export default function InstagramFeed() {
  return (
    <section className="py-16 md:py-24 bg-[var(--surface)] border-t border-[var(--surface-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
              Behind the Scenes
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-1.5">
              Fresh From Our Kitchen
            </h2>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
              Daily baking, intricate piping, and celebration reveals in Rajahmundry.
            </p>
          </div>

          <a
            href={siteConfig.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--surface-border-strong)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors shadow-xs"
          >
            <InstagramIcon className="w-4 h-4 text-[var(--primary)]" />
            <span>Follow Cake Magic</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
          </a>
        </div>

        {/* Clean Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kitchenShots.map((item, idx) => (
            <div
              key={idx}
              className="group relative aspect-square rounded-xl overflow-hidden bg-[var(--surface-alt)] border border-[var(--surface-border)]"
            >
              <Image
                src={item.image}
                alt={item.caption}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4 text-center">
                <span className="text-white text-xs font-medium">
                  {item.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
