import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Clock, MapPin, Search } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative bg-[var(--background)] pt-6 pb-10 md:pt-10 md:pb-14 border-b border-[var(--surface-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface-alt)] border border-[var(--surface-border)] text-xs text-[var(--foreground-muted)] font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Freshly Baking Daily in Rajahmundry &bull; Est. 2015</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--foreground)] leading-tight">
              Make Every Celebration <br className="hidden sm:inline" />
              <span className="text-[var(--primary)] italic font-normal">Sweeter.</span>
            </h1>

            <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-xl leading-relaxed">
              Fresh cakes, custom cakes &amp; desserts in Rajahmundry. Baked to order with 100% eggless options, same-day delivery, and doorstep fulfillment.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/cakes"
                className="tap-target px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs sm:text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-xs flex items-center gap-2 group"
              >
                <span>Shop Cakes</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/custom-cakes"
                className="tap-target px-5 py-3 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] hover:bg-[var(--surface-alt)] text-[var(--foreground)] text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-[var(--accent-blush-dark)]" />
                <span>Custom Cakes</span>
              </Link>

              <Link
                href="/track"
                className="tap-target px-4 py-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--surface-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track Order</span>
              </Link>
            </div>

            {/* Micro Trust Points */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[var(--primary)]" />
                Prakasam Nagar, Rajamahendravaram
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                Open 9 AM – 10 PM
              </span>
              <span>&bull;</span>
              <span>Free Delivery Above ₹1500</span>
            </div>
          </div>

          {/* Right Hero Visual Banner */}
          <div className="lg:col-span-5">
            <div className="relative aspect-16/11 sm:aspect-16/10 lg:aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-[var(--surface-border)] bg-[var(--surface)]">
              <Image
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=900&auto=format&fit=crop"
                alt="Cake Magic Belgian Chocolate Truffle Celebration Cake"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 450px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[var(--surface)]/95 backdrop-blur-xs border border-[var(--surface-border)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--badge-eggless-text)] block">
                    ★ Best Seller in Rajahmundry
                  </span>
                  <p className="font-serif text-xs sm:text-sm font-bold text-[var(--foreground)]">
                    Belgian Chocolate Truffle
                  </p>
                </div>
                <Link
                  href="/cakes/belgian-chocolate-truffle"
                  className="tap-target px-3 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors shrink-0"
                >
                  Order ₹850
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
