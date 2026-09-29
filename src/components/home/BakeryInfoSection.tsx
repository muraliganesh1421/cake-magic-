import { MapPin, Phone, Clock, Truck, ShieldCheck, Camera } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function BakeryInfoSection() {
  return (
    <section className="py-12 md:py-16 bg-[var(--surface-alt)] border-t border-[var(--surface-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: About Cake Magic & Location */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--surface)] border border-[var(--surface-border)] text-xs text-[var(--foreground-muted)] font-medium">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)]"></span>
              <span>Serving Rajahmundry Celebrations Since 2015</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
              Visit Our Rajahmundry Bakery Studio
            </h2>

            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed max-w-xl">
              Freshly baking celebration cakes, custom designer cakes, pastries, and treats daily. Located conveniently on Jawaharlal Nehru Road in Prakasam Nagar.
            </p>

            {/* Business Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Bakery Address</span>
                </div>
                <p className="text-xs text-[var(--foreground)] leading-relaxed">
                  {siteConfig.address}
                </p>
                <a
                  href={siteConfig.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-semibold text-[var(--primary)] hover:underline inline-block pt-1"
                >
                  Get Directions on Google Maps &rarr;
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary)]">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Orders &amp; Enquiries</span>
                </div>
                <div className="text-xs text-[var(--foreground)] space-y-0.5 pt-0.5">
                  <p>
                    <a href="tel:+917358084648" className="hover:underline font-semibold">
                      +91 73580 84648
                    </a>{" "}
                    (WhatsApp / Primary)
                  </p>
                  <p>
                    <a href="tel:+919966094799" className="hover:underline text-[var(--foreground-muted)]">
                      +91 99660 94799
                    </a>
                  </p>
                  <p>
                    <a href="tel:+919848181144" className="hover:underline text-[var(--foreground-muted)]">
                      +91 98481 81144
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Operational Highlights */}
          <div className="lg:col-span-5 space-y-3">
            <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs space-y-4">
              <h3 className="font-serif text-sm font-bold text-[var(--foreground)] pb-2 border-b border-[var(--surface-border)]">
                Bakery Hours &amp; Delivery Policies
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">Store &amp; Order Hours:</span>
                    <p className="text-[var(--foreground-muted)]">Monday to Sunday: 09:00 AM – 10:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Truck className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">Doorstep Delivery:</span>
                    <p className="text-[var(--foreground-muted)]">
                      Prakasam Nagar, Danavaipeta, Srinivas Nagar, Morampudi, Kambala Cheruvu &amp; nearby areas.
                    </p>
                    <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                      ✓ Free delivery on orders above ₹1500
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">Pure Vegetarian &amp; Eggless:</span>
                    <p className="text-[var(--foreground-muted)]">
                      Dedicated eggless baking options available across all signature and custom cakes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-1">
                  <Camera className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[var(--foreground)]">Follow on Instagram:</span>
                    <p>
                      <a
                        href={siteConfig.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--primary)] font-semibold hover:underline"
                      >
                        {siteConfig.instagramHandle} &rarr;
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
