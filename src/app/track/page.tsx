"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { siteConfig, buildWhatsAppLink } from "@/config/site";
import {
  Package,
  Search,
  Phone,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  AlertCircle,
  ChevronLeft,
  MapPin,
} from "lucide-react";

interface TimelineStep {
  status: string;
  label: string;
  description: string;
  completed: boolean;
  active: boolean;
  timestamp?: string;
}

interface OrderData {
  id: string;
  status: string;
  customerName: string;
  items: Array<{
    productName: string;
    size: string;
    flavour: string;
    quantity: number;
    unitPrice: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: string;
  deliveryDate: string;
  deliveryTime: string;
  address?: string;
  specialInstructions?: string;
  createdAt: string;
  timeline: TimelineStep[];
}

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  PENDING: { color: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", label: "Pending" },
  CONFIRMED: { color: "text-blue-700", bg: "bg-blue-50 border-blue-200", label: "Confirmed" },
  PAID: { color: "text-green-700", bg: "bg-green-50 border-green-200", label: "Paid" },
  PREPARING: { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", label: "Baking in Progress" },
  READY: { color: "text-teal-700", bg: "bg-teal-50 border-teal-200", label: "Ready for Pickup/Dispatch" },
  OUT_FOR_DELIVERY: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200", label: "Out for Delivery" },
  DELIVERED: { color: "text-green-700", bg: "bg-green-50 border-green-200", label: "Delivered ✓" },
  CANCELLED: { color: "text-red-700", bg: "bg-red-50 border-red-200", label: "Cancelled" },
};

function TrackingForm({
  initialOrder,
  initialPhone,
  onResult,
}: {
  initialOrder: string;
  initialPhone: string;
  onResult: (data: OrderData | null, error: string) => void;
}) {
  const [orderId, setOrderId] = useState(initialOrder);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  const fetchOrder = useCallback(
    async (oid: string, ph?: string) => {
      if (!oid.trim()) return;
      setLoading(true);
      try {
        const cleanPhone = (ph || "").trim().replace(/\D/g, "");
        const url = cleanPhone
          ? `/api/orders/track?order=${encodeURIComponent(oid.trim().toUpperCase())}&phone=${encodeURIComponent(cleanPhone)}`
          : `/api/orders/track?order=${encodeURIComponent(oid.trim().toUpperCase())}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) {
          onResult(null, data.error || "Order not found. Please check your order number.");
        } else {
          onResult(data, "");
        }
      } catch {
        onResult(null, "Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [onResult]
  );

  useEffect(() => {
    if (initialOrder && initialOrder.trim()) {
      fetchOrder(initialOrder, initialPhone);
    }
  }, [initialOrder, initialPhone, fetchOrder]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!orderId.trim()) return;
    fetchOrder(orderId, phone);
  }

  return (
    <form onSubmit={handleSearch} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
          Order Number *
        </label>
        <input
          type="text"
          required
          value={orderId}
          onChange={(e) => setOrderId(e.target.value.toUpperCase())}
          placeholder="e.g. CM-20260929-001"
          className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)] placeholder:font-sans"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
          <Phone className="w-3 h-3 inline mr-1" />
          Mobile Number (Optional verification)
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)]"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm hover:bg-[var(--primary-hover)] transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
      >
        <Search className="w-4 h-4" />
        {loading ? "Tracking…" : "Track Order"}
      </button>
    </form>
  );
}

function OrderResult({ order }: { order: OrderData }) {
  const config = STATUS_CONFIG[order.status] || STATUS_CONFIG["PENDING"];
  const formattedDate = order.deliveryDate
    ? new Date(order.deliveryDate).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <div className="space-y-6">
      {/* Status banner */}
      <div className={`rounded-2xl border p-4 flex items-center gap-3 ${config.bg}`}>
        <Package className={`w-6 h-6 shrink-0 ${config.color}`} />
        <div>
          <p className="text-xs font-semibold text-[var(--foreground-muted)]">
            Order {order.id}
          </p>
          <p className={`text-base font-bold ${config.color}`}>{config.label}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5">
        <h3 className="font-serif text-sm font-bold text-[var(--foreground)] mb-4">
          Order Progress
        </h3>
        <ol className="space-y-0">
          {order.timeline.map((step, i) => (
            <li key={step.status} className="flex gap-3">
              {/* Line + dot */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    step.completed
                      ? "bg-[var(--primary)] border-[var(--primary)]"
                      : step.active
                      ? "bg-[var(--accent-blush-light)] border-[var(--primary)]"
                      : "bg-[var(--surface-alt)] border-[var(--surface-border)]"
                  }`}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : step.active ? (
                    <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-[var(--surface-border)]" />
                  )}
                </div>
                {i < order.timeline.length - 1 && (
                  <div
                    className={`w-0.5 flex-1 my-1 min-h-[20px] ${
                      step.completed ? "bg-[var(--primary)]" : "bg-[var(--surface-border)]"
                    }`}
                  />
                )}
              </div>
              {/* Content */}
              <div className="pb-5">
                <p
                  className={`text-xs font-bold ${
                    step.active
                      ? "text-[var(--primary)]"
                      : step.completed
                      ? "text-[var(--foreground)]"
                      : "text-[var(--foreground-muted)]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* Order Details */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 space-y-4">
        <h3 className="font-serif text-sm font-bold text-[var(--foreground)]">Order Details</h3>

        {/* Items */}
        <ul className="space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-xs">
              <span className="text-[var(--foreground)]">
                {item.productName} — {item.size}, {item.flavour}
                {item.quantity > 1 && ` ×${item.quantity}`}
              </span>
              <span className="font-semibold text-[var(--foreground)]">
                ₹{item.unitPrice * item.quantity}
              </span>
            </li>
          ))}
        </ul>

        <div className="border-t border-[var(--surface-border)] pt-3 space-y-1.5">
          <div className="flex justify-between text-xs text-[var(--foreground-muted)]">
            <span>Subtotal</span>
            <span>₹{order.subtotal}</span>
          </div>
          {order.deliveryFee > 0 && (
            <div className="flex justify-between text-xs text-[var(--foreground-muted)]">
              <span>Delivery fee</span>
              <span>₹{order.deliveryFee}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-[var(--foreground)] pt-1">
            <span>Total</span>
            <span className="text-[var(--primary)]">₹{order.total}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="border-t border-[var(--surface-border)] pt-3 space-y-1.5 text-xs text-[var(--foreground-muted)]">
          <div className="flex items-center gap-2">
            {order.deliveryMethod === "DELIVERY" ? (
              <Truck className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <Store className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {order.deliveryMethod === "DELIVERY" ? "Home Delivery" : "Store Pickup"} ·{" "}
              {formattedDate} · {order.deliveryTime}
            </span>
          </div>
          {order.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{order.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Need help */}
      <div className="text-center text-xs text-[var(--foreground-muted)]">
        Need help?{" "}
        <a
          href={buildWhatsAppLink(`Hi Cake Magic, I need assistance with my order ${order.id}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--primary)] font-semibold hover:underline"
        >
          Contact us on WhatsApp →
        </a>
      </div>
    </div>
  );
}

function TrackContent() {
  const params = useSearchParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--surface-border)] bg-[var(--surface)]">
        <div className="max-w-xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl hover:bg-[var(--surface-alt)] text-[var(--foreground-muted)] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl font-bold text-[var(--foreground)]">Track Order</h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              Enter your order details below
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search form */}
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 sm:p-6">
          <TrackingForm
            initialOrder={params.get("order") || ""}
            initialPhone=""
            onResult={(data, err) => {
              setOrder(data);
              setError(err);
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Result */}
        {order && <OrderResult order={order} />}
      </div>
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-[var(--foreground-muted)] text-sm">Loading…</div>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
