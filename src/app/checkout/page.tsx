"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag,
  Truck,
  Store,
  Calendar,
  Clock,
  MapPin,
  ChevronLeft,
  AlertCircle,
  User,
  Phone,
  Mail,
  MessageSquare,
  Landmark,
} from "lucide-react";

const TIME_SLOTS = [
  "Morning (9 AM – 11 AM)",
  "Afternoon (12 PM – 2 PM)",
  "Evening (5 PM – 7 PM)",
  "Night (7 PM – 9 PM)",
];

function getMinDate(minHours: number): string {
  const d = new Date();
  d.setHours(d.getHours() + minHours);
  return d.toISOString().split("T")[0];
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<"PICKUP" | "DELIVERY">("PICKUP");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(TIME_SLOTS[0]);
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [instructions, setInstructions] = useState("");

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const minDate = getMinDate(24);

  const DELIVERY_FEE = deliveryMethod === "DELIVERY" ? 50 : 0;
  const TOTAL = subtotal + DELIVERY_FEE;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShoppingBag className="w-16 h-16 text-[var(--foreground-muted)] mb-4" />
        <h1 className="font-serif text-2xl font-bold text-[var(--foreground)] mb-2">
          Your cart is empty
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          Add some cakes before checking out.
        </p>
        <Link
          href="/cakes"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm hover:bg-[var(--primary-hover)] transition-colors"
        >
          Browse Cakes
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s/g, "")))
      return setError("Please enter a valid 10-digit Indian mobile number.");
    if (!deliveryDate) return setError("Please select a delivery/pickup date.");
    if (deliveryMethod === "DELIVERY" && !address.trim())
      return setError("Please enter your delivery address.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerPhone: phone.trim(),
          customerEmail: email.trim() || undefined,
          deliveryType: deliveryMethod,
          deliveryDate,
          deliveryTimeSlot: deliveryTime,
          deliveryAddress: deliveryMethod === "DELIVERY" ? address.trim() : "",
          landmark: landmark.trim() || undefined,
          specialInstructions: instructions.trim() || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.name,
            slug: item.slug,
            image: item.image,
            size: item.size,
            flavour: item.flavour,
            eggless: item.eggless,
            cakeMessage: item.cakeMessage,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          paymentMethod: "DEMO_TEST_PAYMENT",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to place order. Please try again.");
      }

      const data = await res.json();
      const orderId = data.order?.id || data.id;
      clearCart();
      router.push(`/checkout/success?order=${orderId}&name=${encodeURIComponent(name.trim())}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <div className="border-b border-[var(--surface-border)] bg-[var(--surface)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
          <Link
            href="/cakes"
            className="p-2 rounded-xl hover:bg-[var(--surface-alt)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Back to cakes"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
              Checkout
            </h1>
            <p className="text-xs text-[var(--foreground-muted)]">
              {items.length} item{items.length > 1 ? "s" : ""} in your order
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT: Order form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Customer Details */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--primary)]" />
                Your Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                    <Phone className="w-3 h-3 inline mr-1" />
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                  <Mail className="w-3 h-3 inline mr-1" />
                  Email (optional — for order confirmation)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)]"
                />
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 sm:p-6 space-y-4">
              <h2 className="font-serif text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--primary)]" />
                Fulfillment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("PICKUP")}
                  className={`py-4 px-3 rounded-xl border-2 text-center transition-all ${
                    deliveryMethod === "PICKUP"
                      ? "border-[var(--primary)] bg-[var(--accent-blush-light)] text-[var(--primary)]"
                      : "border-[var(--surface-border)] text-[var(--foreground-muted)] hover:border-[var(--surface-border-strong)]"
                  }`}
                >
                  <Store className="w-6 h-6 mx-auto mb-1.5" />
                  <div className="font-bold text-sm">Store Pickup</div>
                  <div className="text-xs opacity-70 mt-0.5">Free · Rajahmundry</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("DELIVERY")}
                  className={`py-4 px-3 rounded-xl border-2 text-center transition-all ${
                    deliveryMethod === "DELIVERY"
                      ? "border-[var(--primary)] bg-[var(--accent-blush-light)] text-[var(--primary)]"
                      : "border-[var(--surface-border)] text-[var(--foreground-muted)] hover:border-[var(--surface-border-strong)]"
                  }`}
                >
                  <Truck className="w-6 h-6 mx-auto mb-1.5" />
                  <div className="font-bold text-sm">Home Delivery</div>
                  <div className="text-xs opacity-70 mt-0.5">₹50 · Within Rajahmundry</div>
                </button>
              </div>

              {/* Date + Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                    <Calendar className="w-3 h-3 inline mr-1" />
                    {deliveryMethod === "PICKUP" ? "Pickup" : "Delivery"} Date *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <p className="text-[10px] text-[var(--foreground-muted)] mt-1">
                    Minimum 24 hours preparation required
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                    <Clock className="w-3 h-3 inline mr-1" />
                    Preferred Time Slot *
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery Address */}
              {deliveryMethod === "DELIVERY" && (
                <div className="space-y-3 pt-2 border-t border-[var(--surface-border)]">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      Delivery Address *
                    </label>
                    <textarea
                      rows={2}
                      required={deliveryMethod === "DELIVERY"}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="House/Flat No, Street, Area (e.g. Danavaipeta, Rajahmundry)"
                      className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)] resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1.5">
                      <Landmark className="w-3 h-3 inline mr-1" />
                      Landmark (optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Near SBI Bank, Tilak Road"
                      className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)]"
                    />
                  </div>
                </div>
              )}
            </section>

            {/* Special Instructions */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 sm:p-6 space-y-3">
              <h2 className="font-serif text-base font-bold text-[var(--foreground)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--primary)]" />
                Special Instructions
              </h2>
              <textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any special requests, allergen info, or notes for Cake Magic..."
                className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--foreground-muted)] resize-none"
              />
            </section>

            {/* Demo Payment Notice */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[var(--accent-blush-light)] border border-[var(--accent-blush)]">
              <AlertCircle className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--foreground-muted)]">
                <strong className="text-[var(--foreground)]">Safe Demo Mode:</strong> Payment
                collection is handled by Cake Magic staff on delivery/pickup. No card or UPI details
                are needed right now.
              </p>
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* RIGHT: Order summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-5 space-y-4">
                <h2 className="font-serif text-base font-bold text-[var(--foreground)]">
                  Order Summary
                </h2>

                {/* Items */}
                <ul className="space-y-3 divide-y divide-[var(--surface-border)]">
                  {items.map((item) => (
                    <li key={item.id} className="pt-3 first:pt-0 flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-[var(--surface-border)]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[var(--foreground)] line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[var(--foreground-muted)] mt-0.5">
                          {item.size} · {item.flavour}
                          {item.eggless ? " · Eggless" : ""}
                        </p>
                        {item.cakeMessage && (
                          <p className="text-[11px] text-[var(--foreground-muted)] italic mt-0.5">
                            &ldquo;{item.cakeMessage}&rdquo;
                          </p>
                        )}
                        <p className="text-xs font-semibold text-[var(--primary)] mt-1">
                          ₹{item.unitPrice * item.quantity}
                          {item.quantity > 1 && (
                            <span className="text-[var(--foreground-muted)] font-normal">
                              {" "}
                              (×{item.quantity})
                            </span>
                          )}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="border-t border-[var(--surface-border)] pt-4 space-y-2">
                  <div className="flex justify-between text-xs text-[var(--foreground-muted)]">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--foreground-muted)]">
                    <span>
                      {deliveryMethod === "DELIVERY" ? "Delivery fee" : "Pickup (in-store)"}
                    </span>
                    <span>{DELIVERY_FEE > 0 ? `₹${DELIVERY_FEE}` : "Free"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[var(--foreground)] pt-2 border-t border-[var(--surface-border)]">
                    <span>Total</span>
                    <span className="text-[var(--primary)]">₹{TOTAL}</span>
                  </div>
                  <p className="text-[10px] text-[var(--foreground-muted)] text-center">
                    Payment on {deliveryMethod === "PICKUP" ? "pickup" : "delivery"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm hover:bg-[var(--primary-hover)] active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? "Placing Order…" : `Place Order · ₹${TOTAL}`}
                </button>
              </div>

              <p className="text-[11px] text-center text-[var(--foreground-muted)] px-2">
                By placing this order you agree that Cake Magic, Rajahmundry will confirm
                availability and contact you within 2 hours.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
