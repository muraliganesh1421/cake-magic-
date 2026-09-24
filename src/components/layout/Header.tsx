"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, Menu, X, MessageCircle, Sparkles, ChevronRight, Phone } from "lucide-react";
import { siteConfig, buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";
import SearchModal from "./SearchModal";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Cakes", href: "/cakes" },
    { label: "Custom Cakes", href: "/custom-cakes", highlight: true },
    { label: "Desserts", href: "/desserts" },
    { label: "Bakery", href: "/bakery" },
    { label: "Celebrations", href: "/celebrations" },
    { label: "Gallery", href: "/gallery" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[var(--surface)]/95 backdrop-blur-md border-b border-[var(--surface-border)] transition-all">
        {/* Top Announcement Bar */}
        <div className="bg-[var(--primary)] text-[var(--primary-foreground)] text-[11px] md:text-xs py-1.5 px-4 text-center font-medium tracking-wide">
          <div className="container mx-auto flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blush)] inline-block animate-pulse"></span>
            <span>Handcrafted Bespoke Cakes & Bakery in Rajahmundry &bull; Pre-book celebration orders on WhatsApp</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 md:h-20">
            {/* Brand Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded-md py-1 group"
            >
              <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full overflow-hidden border border-[var(--surface-border)] shadow-xs shrink-0 bg-[#F9F6F0]">
                <Image
                  src="/logo.jpg"
                  alt="Cake Magic Logo"
                  fill
                  sizes="48px"
                  className="object-contain p-0.5 group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl md:text-2xl tracking-wider font-bold text-[var(--foreground)] uppercase leading-none">
                  Cake Magic
                </span>
                <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-[var(--foreground-muted)] uppercase font-sans font-medium mt-1">
                  Bespoke Patisserie &bull; Rajahmundry
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-medium px-2.5 py-2 rounded-lg transition-colors relative ${
                      isActive
                        ? "text-[var(--primary)] font-semibold bg-[var(--surface-alt)]"
                        : "text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)]/60"
                    } ${link.highlight ? "text-[var(--primary)] font-semibold" : ""}`}
                  >
                    {link.label}
                    {link.highlight && (
                      <span className="ml-1 inline-flex items-center">
                        <Sparkles className="w-3 h-3 text-[var(--accent-blush-dark)] inline" />
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Search Trigger */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="tap-target flex items-center justify-center p-2 rounded-xl text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors"
                aria-label="Search cakes and treats"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* WhatsApp / Quick Order CTA (Desktop) */}
              <a
                href={buildWhatsAppLink(WhatsAppTemplates.generalEnquiry())}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs md:text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                <span>WhatsApp Order</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden tap-target flex items-center justify-center p-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-x-0 top-[calc(theme(spacing.18)+29px)] bottom-0 z-50 bg-black/40 backdrop-blur-xs flex flex-col"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-[var(--surface)] border-b border-[var(--surface-border)] px-5 py-6 shadow-2xl overflow-y-auto max-h-[85vh] divide-y divide-[var(--surface-border)]/60"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Drawer Brand Header */}
              <div className="flex items-center gap-3 pb-4 mb-2">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--surface-border)] shadow-xs shrink-0 bg-[#F9F6F0]">
                  <Image
                    src="/logo.jpg"
                    alt="Cake Magic Logo"
                    fill
                    sizes="48px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-[var(--foreground)] uppercase leading-none block">
                    Cake Magic
                  </span>
                  <span className="text-[10px] tracking-wider text-[var(--foreground-muted)] uppercase font-sans font-medium">
                    Rajahmundry &bull; Patisserie
                  </span>
                </div>
              </div>

              <div className="space-y-1 pb-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-3 rounded-xl text-base transition-colors ${
                        isActive
                          ? "bg-[var(--surface-alt)] font-semibold text-[var(--primary)]"
                          : "text-[var(--foreground)] hover:bg-[var(--surface-alt)]/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {link.label}
                        {link.highlight && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[var(--accent-blush-light)] text-[var(--accent-blush-dark)] border border-[var(--accent-blush)]">
                            Custom
                          </span>
                        )}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--foreground-subtle)]" />
                    </Link>
                  );
                })}
              </div>

              {/* Contact info inside drawer */}
              <div className="pt-4 space-y-3">
                <div className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)] px-3">
                  Rajahmundry Store
                </div>
                <div className="text-xs text-[var(--foreground-muted)] px-3 leading-relaxed">
                  {siteConfig.address}
                </div>
                <div className="px-3 flex flex-col gap-2 pt-2">
                  <a
                    href={buildWhatsAppLink(WhatsAppTemplates.generalEnquiry())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold text-sm shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                    <span>WhatsApp Cake Magic</span>
                  </a>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--surface-border)] text-[var(--foreground)] font-medium text-xs hover:bg-[var(--surface-alt)]"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--foreground-muted)]" />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
