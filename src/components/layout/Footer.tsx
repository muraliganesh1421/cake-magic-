import Link from "next/link";
import Image from "next/image";
import { siteConfig, buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";
import { MapPin, Phone, Clock, MessageCircle, Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--surface-alt)] border-t border-[var(--surface-border)] text-[var(--foreground)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border border-[var(--surface-border-strong)]/60 shadow-xs shrink-0 bg-[#F9F6F0]">
                <Image
                  src="/logo.jpg"
                  alt="Cake Magic Logo"
                  fill
                  sizes="56px"
                  className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div>
                <span className="font-serif text-2xl md:text-3xl font-bold tracking-wider uppercase text-[var(--primary)] leading-none block">
                  Cake Magic
                </span>
                <span className="block text-xs uppercase tracking-[0.2em] text-[var(--foreground-muted)] font-medium mt-1">
                  Bespoke Cakes &bull; Rajahmundry
                </span>
              </div>
            </Link>
            <p className="text-sm text-[var(--foreground-muted)] leading-relaxed max-w-sm">
              Artisanal patisserie crafting celebration cakes, designer bento boxes, eggless creations, and daily fresh bakery treats in Rajahmundry, Andhra Pradesh.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppLink(WhatsAppTemplates.generalEnquiry())}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h2 className="font-serif text-base font-semibold text-[var(--foreground)]">Explore</h2>
            <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/cakes" className="hover:text-[var(--primary)] transition-colors">
                  All Celebration Cakes
                </Link>
              </li>
              <li>
                <Link href="/custom-cakes" className="hover:text-[var(--primary)] transition-colors font-medium text-[var(--primary)]">
                  Design Your Cake
                </Link>
              </li>
              <li>
                <Link href="/eggless" className="hover:text-[var(--primary)] transition-colors">
                  Eggless Cakes
                </Link>
              </li>
              <li>
                <Link href="/desserts" className="hover:text-[var(--primary)] transition-colors">
                  Brownies & Desserts
                </Link>
              </li>
              <li>
                <Link href="/bakery" className="hover:text-[var(--primary)] transition-colors">
                  Fresh Bakery & Breads
                </Link>
              </li>
              <li>
                <Link href="/celebrations" className="hover:text-[var(--primary)] transition-colors">
                  Party Essentials
                </Link>
              </li>
            </ul>
          </div>

          {/* Occasions */}
          <div className="space-y-3">
            <h2 className="font-serif text-base font-semibold text-[var(--foreground)]">Celebrations</h2>
            <ul className="space-y-2 text-sm text-[var(--foreground-muted)]">
              <li>
                <Link href="/cakes?occasion=Birthday" className="hover:text-[var(--primary)] transition-colors">
                  Birthday Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?occasion=Anniversary" className="hover:text-[var(--primary)] transition-colors">
                  Anniversary Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?occasion=Wedding" className="hover:text-[var(--primary)] transition-colors">
                  Wedding Cakes
                </Link>
              </li>
              <li>
                <Link href="/cakes?occasion=Kids" className="hover:text-[var(--primary)] transition-colors">
                  Kids & Cartoon Themes
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-[var(--primary)] transition-colors">
                  Cake Magic Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[var(--primary)] transition-colors">
                  About Cake Magic
                </Link>
              </li>
            </ul>
          </div>

          {/* Store & Local Contact (Rule 2 compliant) */}
          <div className="space-y-3">
            <h2 className="font-serif text-base font-semibold text-[var(--foreground)]">Store & Location</h2>
            <div className="space-y-2.5 text-xs text-[var(--foreground-muted)]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                <span>
                  {siteConfig.hasOwnerAddress
                    ? siteConfig.address
                    : "Rajahmundry, Andhra Pradesh, India"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--primary)] shrink-0" />
                <span>
                  {siteConfig.hasOwnerHours
                    ? `Hours: ${siteConfig.openingHours}`
                    : "Pre-orders & celebration enquiries open daily"}
                </span>
              </div>
              {siteConfig.hasOwnerPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[var(--primary)] shrink-0" />
                  <span>{siteConfig.phone}</span>
                </div>
              )}
              <div className="flex items-start gap-2 pt-1 text-[11px] text-[var(--foreground-subtle)]">
                <ShieldCheck className="w-4 h-4 text-[var(--badge-eggless-text)] shrink-0" />
                <span>Advance order recommended for multi-tier and custom designer themes.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-8 border-t border-[var(--surface-border)] flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--foreground-muted)] gap-4">
          <p>
            &copy; {new Date().getFullYear()} Cake Magic Rajahmundry. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="hover:text-[var(--primary)]">
              Contact Us
            </Link>
            <span>&bull;</span>
            <Link href="/custom-cakes/status" className="hover:text-[var(--primary)]">
              Order Status
            </Link>
            <span>&bull;</span>
            <Link href="/admin" className="text-[var(--foreground-subtle)] hover:text-[var(--foreground)]">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
