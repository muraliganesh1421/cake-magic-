"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Package, MapPin, ArrowRight } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order") || "";
  const customerName = params.get("name") || "Customer";

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--accent-blush-light)] flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-[var(--primary)]" />
          </div>
        </div>

        {/* Heading */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-[var(--foreground)]">
            Order Confirmed! 🎂
          </h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            Thank you, <strong>{customerName}</strong>! Your cake is in expert hands.
          </p>
        </div>

        {/* Order ID Card */}
        <div className="bg-[var(--surface)] rounded-2xl border-2 border-[var(--primary)]/40 p-6 space-y-1">
          <p className="text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
            Your Order Number
          </p>
          <p className="font-mono text-2xl font-bold text-[var(--primary)]">{orderId}</p>
          <p className="text-xs text-[var(--foreground-muted)]">
            Save this number to track your order
          </p>
        </div>

        {/* What happens next */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 text-left space-y-3">
          <h2 className="font-serif text-sm font-bold text-[var(--foreground)]">What happens next?</h2>
          <ul className="space-y-2.5">
            {[
              {
                icon: "📞",
                text: "Cake Magic will call you within 2 hours to confirm your order.",
              },
              {
                icon: "🎂",
                text: "Your cake will be freshly baked with care.",
              },
              {
                icon: "🚚",
                text: "You will be notified when your order is ready for pickup/delivery.",
              },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-xs text-[var(--foreground-muted)]">
                <span className="text-base shrink-0 mt-0.5">{step.icon}</span>
                <span>{step.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/track?order=${orderId}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm hover:bg-[var(--primary-hover)] transition-colors"
          >
            <Package className="w-4 h-4" />
            Track My Order
          </Link>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] font-semibold text-sm hover:bg-[var(--surface-alt)] transition-colors"
          >
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Store info */}
        <div className="flex items-center justify-center gap-2 text-xs text-[var(--foreground-muted)]">
          <MapPin className="w-3.5 h-3.5" />
          <span>Cake Magic — Rajahmundry, Andhra Pradesh</span>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-[var(--foreground-muted)] text-sm">Loading…</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
