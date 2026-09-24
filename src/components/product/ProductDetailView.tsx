"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { MessageCircle, Check, Send, Sparkles, Calendar, Clock, MapPin, CheckCircle2, ChevronRight } from "lucide-react";
import { siteConfig, buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";
import ProductCard from "@/components/ui/ProductCard";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailView({
  product,
  relatedProducts,
}: ProductDetailViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedFlavour, setSelectedFlavour] = useState(product.flavours[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [deliveryType, setDeliveryType] = useState<"Pickup" | "Delivery">("Pickup");
  const [address, setAddress] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const displayPrice = product.startingPrice
    ? `From ₹${product.startingPrice}`
    : "Price on enquiry";

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setErrorMessage("Please provide your name and contact phone number.");
      return;
    }
    setSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: customerName,
          phone: customerPhone,
          product: product.name,
          productId: product.id,
          size: selectedSize,
          quantity,
          date: deliveryDate,
          time: deliveryTime,
          deliveryType,
          address: deliveryType === "Delivery" ? address : "In-store pickup, Rajahmundry",
          message: `Flavour: ${selectedFlavour}${cakeMessage ? ` | Piping Message: "${cakeMessage}"` : ""}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || "Unable to register enquiry. Please reach us on WhatsApp.");
      }
    } catch {
      setErrorMessage("Network issue. Please connect directly via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Hi Cake Magic, I'm interested in ordering ${product.name}.
Size: ${selectedSize}
Flavour: ${selectedFlavour}
Quantity: ${quantity}
Eggless: ${product.eggless ? "Yes" : "Regular"}
Date: ${deliveryDate || "Upcoming"}
Delivery/Pickup: ${deliveryType}
${deliveryType === "Delivery" && address ? `Delivery Location: ${address}\n` : ""}${cakeMessage ? `Message on Cake: "${cakeMessage}"\n` : ""}
Could you please confirm pricing and availability?`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-[var(--foreground-muted)] mb-8">
        <Link href="/" className="hover:text-[var(--primary)]">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)]" />
        <Link href={`/${product.category}`} className="capitalize hover:text-[var(--primary)]">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--foreground-subtle)]" />
        <span className="text-[var(--foreground)] font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-[var(--surface-alt)] border border-[var(--surface-border)] shadow-md">
            <Image
              src={product.images[selectedImage] || product.images[0]}
              alt={product.name}
              fill
              priority
              className="object-cover transition-all duration-300"
              sizes="(max-width: 1024px) 100vw, 550px"
            />
            {product.eggless && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] text-xs font-bold border border-[var(--badge-eggless-border)] shadow-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[var(--badge-eggless-text)]"></span>
                <span>100% Eggless</span>
              </div>
            )}
            {product.availableToday && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-[var(--badge-gold-bg)] text-[var(--badge-gold-text)] text-xs font-bold border border-[var(--badge-gold-border)] shadow-xs">
                Available Today
              </div>
            )}
          </div>

          {/* Thumbnails if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === idx
                      ? "border-[var(--primary)] ring-2 ring-[var(--accent-blush)]"
                      : "border-[var(--surface-border)] opacity-70 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Local Craftsmanship Note */}
          <div className="p-4 rounded-2xl bg-[var(--surface-alt)]/60 border border-[var(--surface-border)] text-xs text-[var(--foreground-muted)] space-y-1.5">
            <div className="font-semibold text-[var(--foreground)] flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[var(--primary)]" />
              <span>Baked Fresh in Rajahmundry, Andhra Pradesh</span>
            </div>
            <p>
              Pre-booking required for celebration sizes and custom inscriptions. Counter pickup available at our Rajahmundry store or local home delivery.
            </p>
          </div>
        </div>

        {/* Right Column: Specifications & Enquiry Builder */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[var(--accent-blush-dark)]">
                {product.subcategory}
              </span>
              {product.customizable && (
                <span className="text-xs text-[var(--foreground-muted)] flex items-center gap-1">
                  &bull; <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blush-dark)]" /> Customizable
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)] mt-1.5">
              {product.name}
            </h1>

            <div className="mt-2 text-xl font-bold text-[var(--primary)]">
              {displayPrice}
            </div>

            <p className="mt-4 text-sm sm:text-base text-[var(--foreground-muted)] leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="border-t border-[var(--surface-border)] pt-6 space-y-5">
            {/* Size Selector */}
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`tap-target text-xs sm:text-sm px-4 py-2.5 rounded-xl border font-semibold transition-all ${
                      selectedSize === size
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                        : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--surface-border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Flavour Options */}
            {product.flavours.length > 0 && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-2">
                  Flavour Variation
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {product.flavours.map((flv) => (
                    <button
                      key={flv}
                      type="button"
                      onClick={() => setSelectedFlavour(flv)}
                      className={`tap-target text-xs px-3.5 py-2 rounded-xl border font-medium transition-all ${
                        selectedFlavour === flv
                          ? "bg-[var(--accent-blush-light)] text-[var(--foreground)] border-[var(--accent-blush-dark)] font-semibold"
                          : "bg-[var(--surface)] text-[var(--foreground-muted)] border-[var(--surface-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      {flv}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Message on Cake */}
            {product.customizable && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-2">
                  Piping Inscription (Optional)
                </label>
                <input
                  type="text"
                  placeholder='e.g. "Happy 25th Anniversary Mom & Dad"'
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  maxLength={40}
                  className="w-full text-sm p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
                <span className="text-[10px] text-[var(--foreground-subtle)] mt-1 block">
                  Maximum 40 characters piped on cake or sugar plaque.
                </span>
              </div>
            )}

            {/* Date, Time & Delivery Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-1.5">
                  Required Date
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-1.5">
                  Fulfillment Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("Pickup")}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      deliveryType === "Pickup"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                        : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--surface-border)]"
                    }`}
                  >
                    Store Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("Delivery")}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors ${
                      deliveryType === "Delivery"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                        : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--surface-border)]"
                    }`}
                  >
                    Local Delivery
                  </button>
                </div>
              </div>
            </div>

            {deliveryType === "Delivery" && (
              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] mb-1.5">
                  Delivery Address in Rajahmundry
                </label>
                <textarea
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment/House No, Landmark, Area (e.g. Danavaipeta, Tilak Road, Morampudi)"
                  className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            )}
          </div>

          {/* Enquiry Submission Box */}
          <div className="p-6 rounded-2xl bg-[var(--surface-alt)] border border-[var(--surface-border)] space-y-4">
            {submitted ? (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[var(--badge-eggless-text)] mx-auto" />
                <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                  Enquiry Registered for {product.name}
                </h3>
                <p className="text-xs text-[var(--foreground-muted)] max-w-sm mx-auto">
                  Cake Magic has received your enquiry. We will verify availability and confirm pricing shortly.
                </p>
                <a
                  href={buildWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                  <span>Confirm on WhatsApp Now</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3">
                <h3 className="font-serif text-base font-bold text-[var(--foreground)]">
                  Enquire / Reserve Cake
                </h3>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Submit your contact details and Cake Magic will confirm design availability and final quote.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--foreground-muted)] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ananya"
                      className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[var(--foreground-muted)] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="tap-target flex-1 py-3 px-4 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Submitting..." : "Send Cake Enquiry"}</span>
                  </button>

                  <a
                    href={buildWhatsAppLink(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target flex-1 py-3 px-4 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold hover:bg-[var(--surface)] transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Related Cakes Section */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-12 border-t border-[var(--surface-border)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[var(--foreground-muted)]">
                Handcrafted Pairings
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-1">
                You May Also Like
              </h2>
            </div>
            <Link
              href="/cakes"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              View all cakes &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
