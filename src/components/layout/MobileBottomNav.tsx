"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Wand2, ClipboardList, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Explore", href: "/cakes", icon: Compass },
    { label: "Custom", href: "/custom-cakes", icon: Wand2, highlight: true },
    { label: "Orders", href: "/custom-cakes/status", icon: ClipboardList },
  ];

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--surface-border)] shadow-lg safe-bottom">
      <nav className="grid grid-cols-5 h-16" aria-label="Mobile Bottom Navigation">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center tap-target relative transition-colors ${
                isActive
                  ? "text-[var(--primary)] font-semibold"
                  : "text-[var(--foreground-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {item.highlight && (
                <span className="absolute -top-1 right-1/4 w-2 h-2 rounded-full bg-[var(--accent-blush-dark)]"></span>
              )}
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* WhatsApp Link as fifth tab */}
        <a
          href={buildWhatsAppLink(WhatsAppTemplates.generalEnquiry())}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center tap-target text-[var(--success)] hover:text-[var(--primary)] transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <div className="w-8 h-8 rounded-full bg-[var(--badge-eggless-bg)] flex items-center justify-center text-[var(--success)] shadow-xs">
            <MessageCircle className="w-4 h-4 stroke-[2]" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-medium text-[var(--success)]">WhatsApp</span>
        </a>
      </nav>
    </div>
  );
}
