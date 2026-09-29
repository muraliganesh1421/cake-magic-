"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { BusinessSettingsData } from "@/types";

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const [settings, setSettings] = useState<BusinessSettingsData | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setSettings(data))
      .catch(() => null);
  }, []);

  if (!isCartOpen) return null;

  const deliveryCharge = settings?.deliveryCharge ?? 50;
  const freeThreshold = settings?.freeDeliveryThreshold ?? 1500;
  const isFreeDelivery = subtotal >= freeThreshold;
  const finalDeliveryFee = items.length === 0 ? 0 : isFreeDelivery ? 0 : deliveryCharge;
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const totalAmount = subtotal + finalDeliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[var(--surface)] shadow-2xl flex flex-col border-l border-[var(--surface-border)]">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[var(--surface-border)] flex items-center justify-between bg-[var(--surface-alt)]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[var(--accent)]" />
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--foreground)]">Your Cart</h2>
              <span className="text-xs bg-[var(--primary)] text-[var(--background)] px-2 py-0.5 rounded-full font-medium">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-full hover:bg-[var(--surface-border)] text-[var(--foreground)]/70 hover:text-[var(--foreground)] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Banner */}
          {items.length > 0 && (
            <div className="bg-[var(--accent)]/10 px-4 py-2.5 text-xs text-[var(--primary)] border-b border-[var(--accent)]/20 flex items-center justify-between">
              {isFreeDelivery ? (
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  🎉 You unlocked FREE Delivery in Rajahmundry!
                </span>
              ) : (
                <span>
                  Add <strong>₹{remainingForFree}</strong> more for <strong>FREE Delivery</strong> in Rajahmundry
                </span>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--foreground)]/60">
                <div className="w-16 h-16 rounded-full bg-[var(--surface-alt)] border border-[var(--surface-border)] flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-[var(--foreground)]/40" />
                </div>
                <p className="font-serif text-lg font-bold text-[var(--foreground)] mb-1">Your cart is empty</p>
                <p className="text-xs max-w-xs mb-6 text-[var(--foreground)]/60">
                  Explore our handcrafted celebration cakes baked fresh to order in Rajahmundry.
                </p>
                <Link
                  href="/cakes"
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 rounded-full bg-[var(--primary)] text-[var(--background)] text-sm font-medium hover:bg-[var(--primary-dark)] transition-colors"
                >
                  Explore Cakes
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl bg-[var(--surface-alt)] border border-[var(--surface-border)]"
                >
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[var(--surface)]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif text-sm font-bold text-[var(--foreground)] line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[var(--foreground)]/40 hover:text-red-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px] text-[var(--foreground)]/70">
                        {item.size && (
                          <span className="bg-[var(--surface)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded-md">
                            {item.size}
                          </span>
                        )}
                        {item.flavour && (
                          <span className="bg-[var(--surface)] border border-[var(--surface-border)] px-1.5 py-0.5 rounded-md">
                            {item.flavour}
                          </span>
                        )}
                        {item.eggless && (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-md font-semibold">
                            100% Eggless
                          </span>
                        )}
                      </div>

                      {item.cakeMessage && (
                        <p className="text-[11px] text-[var(--accent)] font-medium italic mt-1 line-clamp-1">
                          Piping: &ldquo;{item.cakeMessage}&rdquo;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--surface-border)]/50">
                      <div className="flex items-center gap-2 border border-[var(--surface-border)] rounded-lg bg-[var(--surface)] px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-[var(--foreground)] min-w-[14px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[var(--foreground)]/70 hover:text-[var(--foreground)]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-bold text-sm text-[var(--foreground)]">₹{item.totalPrice}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[var(--surface-border)] bg-[var(--surface-alt)] space-y-3">
              <div className="space-y-1.5 text-xs text-[var(--foreground)]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[var(--foreground)]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery (Rajahmundry)</span>
                  <span className="font-semibold text-[var(--foreground)]">
                    {finalDeliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${finalDeliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[var(--foreground)] pt-2 border-t border-[var(--surface-border)]">
                  <span>Estimated Total</span>
                  <span className="text-[var(--primary)] font-serif text-lg">₹{totalAmount}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-[var(--primary)] text-[var(--background)] font-medium text-sm hover:bg-[var(--primary-dark)] active:scale-98 transition-all shadow-md"
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
