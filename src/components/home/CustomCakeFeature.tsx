import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

export default function CustomCakeFeature() {
  return (
    <section className="py-20 md:py-28 bg-[var(--surface)] relative overflow-hidden">
      {/* Background Subtle Flourish */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent-blush-light)]/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--accent-champagne-light)]/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial & Value Proposition */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-blush-light)] border border-[var(--accent-blush)] text-xs font-semibold text-[var(--accent-blush-dark)]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Pastry Studio &bull; Rajahmundry</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] tracking-tight leading-[1.15]">
              Imagine It. <br />
              <span className="italic font-normal text-[var(--primary)]">We&apos;ll Bake It.</span>
            </h2>

            <p className="text-base sm:text-lg text-[var(--foreground-muted)] leading-relaxed">
              Have a cake in mind? Share your inspiration, sketch, or Pinterest reference and let Cake Magic turn it into something memorable for your celebration in Rajahmundry.
            </p>

            {/* Transformation Steps */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--badge-eggless-text)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-[var(--foreground)]">
                    Step 1 &bull; Submit Your Vision:
                  </span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    Choose flavour, size, eggless preference, and upload your reference picture.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--badge-eggless-text)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-[var(--foreground)]">
                    Step 2 &bull; Design Feasibility & Confirmation:
                  </span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    Our master decorator reviews your design and confirms availability with pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[var(--badge-eggless-text)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sm text-[var(--foreground)]">
                    Step 3 &bull; Freshly Baked & Hand-Finished:
                  </span>
                  <p className="text-xs text-[var(--foreground-muted)] mt-0.5">
                    Freshly baked to order in Rajahmundry using premium ingredients.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/custom-cakes"
                className="tap-target px-6 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-md inline-flex items-center gap-2 group"
              >
                <span>Design My Cake</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={buildWhatsAppLink(WhatsAppTemplates.customCakeEnquiry({
                  occasion: "Birthday / Celebration",
                  flavour: "Belgian Chocolate / Red Velvet",
                  size: "1 kg",
                  eggless: "Yes",
                  theme: "Bespoke Design",
                  colour: "As desired",
                  date: "Upcoming",
                  deliveryType: "Pickup / Delivery",
                  notes: "Enquiry for custom cake in Rajahmundry",
                }))}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target px-5 py-3.5 rounded-xl border border-[var(--surface-border-strong)] text-[var(--foreground)] text-sm font-semibold hover:bg-[var(--surface-alt)] transition-colors inline-flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[var(--primary)]" />
                <span>Discuss on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Visual Transformation Showcase */}
          <div className="lg:col-span-6">
            <div className="relative p-3 sm:p-5 rounded-2xl bg-[var(--surface-alt)] border border-[var(--surface-border)] shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Reference Inspiration Card */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/5 border border-dashed border-[var(--surface-border-strong)] bg-white/50 p-3 flex flex-col justify-between">
                  <div className="relative w-full h-3/4 rounded-xl overflow-hidden bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=600&auto=format&fit=crop"
                      alt="Customer reference cake inspiration"
                      fill
                      className="object-cover grayscale-30"
                      sizes="(max-width: 640px) 100vw, 250px"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                      Reference Inspiration
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-[var(--foreground-muted)]">
                      &ldquo;Photo or sketch shared by customer&rdquo;
                    </p>
                  </div>
                </div>

                {/* Cake Magic Creation Card */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/5 border-2 border-[var(--accent-blush-dark)] bg-white p-3 flex flex-col justify-between shadow-lg">
                  <div className="relative w-full h-3/4 rounded-xl overflow-hidden bg-stone-100">
                    <Image
                      src="https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=600&auto=format&fit=crop"
                      alt="Cake Magic handcrafted finished creation"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 250px"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] text-[10px] font-bold shadow-xs">
                      Cake Magic Creation
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="flex items-center justify-center gap-1 text-[var(--accent-blush-dark)]">
                      <Sparkles className="w-3 h-3" />
                      <span className="text-xs font-bold text-[var(--foreground)]">Crafted to Perfection</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="mt-4 p-3 rounded-xl bg-white border border-[var(--surface-border)] flex items-center justify-between text-xs">
                <span className="text-[var(--foreground-muted)]">Need a customized design for Rajahmundry?</span>
                <Link
                  href="/custom-cakes"
                  className="font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                >
                  Start Builder &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
