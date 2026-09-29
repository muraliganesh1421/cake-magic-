"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CakeSlice, Wand2, SearchCheck, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, setIsCartOpen } = useCart();

  // Hide on admin routes
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const items = [
    { label: "Home", href: "/", icon: Home },
    { label: "Order Now", href: "/cakes", icon: CakeSlice },
    { label: "Customize", href: "/custom-cakes", icon: Wand2, highlight: true },
    { label: "Track", href: "/track", icon: SearchCheck },
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
                <span className="absolute -top-1 right-1/4 w-2 h-2 rounded-full bg-[var(--accent)]"></span>
              )}
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
              <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Trigger with Live Count */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center tap-target relative text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
          aria-label={`View Cart (${itemCount} items)`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[var(--primary)] text-[var(--background)] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {itemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight font-medium">Cart</span>
        </button>
      </nav>
    </div>
  );
}
