"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import { X, MessageCircle, Send, CheckCircle, Calendar, Sparkles } from "lucide-react";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function QuickViewModal({
  isOpen,
  onClose,
  product,
}: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedFlavour, setSelectedFlavour] = useState(product.flavours[0] || "");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [date, setDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      setErrorMessage("Please enter your name and phone number.");
      return;
    }
    setLoading(true);
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
          date,
          deliveryType: "Pickup",
          message: `Flavour: ${selectedFlavour}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || "Unable to submit enquiry right now. Please use WhatsApp.");
      }
    } catch {
      setErrorMessage("Network issue. Please connect directly via WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const whatsappMessage = WhatsAppTemplates.productEnquiry(
    product.name,
    selectedSize,
    date
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-[var(--surface)] rounded-2xl shadow-2xl border border-[var(--surface-border)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex justify-end p-3 border-b border-[var(--surface-border)] bg-[var(--surface-alt)]/40">
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[var(--surface-border)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Product Media */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[var(--surface-alt)]">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 400px"
              />
              {product.eggless && (
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] text-xs font-semibold border border-[var(--badge-eggless-border)]">
                  Eggless
                </div>
              )}
            </div>
            <p className="text-[11px] text-[var(--foreground-muted)] text-center italic">
              Crafted fresh for celebration orders in Rajahmundry
            </p>
          </div>

          {/* Details & Action Form */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase font-semibold tracking-wider text-[var(--foreground-muted)]">
                {product.subcategory} &bull; {product.category}
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)] mt-1">
                {product.name}
              </h2>
              <div className="text-sm font-semibold text-[var(--primary)] mt-1">
                {product.startingPrice ? `Starting from ₹${product.startingPrice}` : "Price on enquiry"}
              </div>

              <p className="text-xs text-[var(--foreground-muted)] mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Sizes */}
              <div className="mt-4">
                <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selectedSize === s
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                          : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flavours */}
              {product.flavours.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[var(--foreground)] mb-1.5">
                    Flavour Note
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.flavours.map((flv) => (
                      <button
                        key={flv}
                        type="button"
                        onClick={() => setSelectedFlavour(flv)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          selectedFlavour === flv
                            ? "bg-[var(--accent-blush-light)] text-[var(--foreground)] border-[var(--accent-blush-dark)]"
                            : "bg-[var(--surface-alt)] text-[var(--foreground-muted)] border-[var(--surface-border)]"
                        }`}
                      >
                        {flv}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Enquiry / WhatsApp Section */}
            <div className="mt-6 pt-4 border-t border-[var(--surface-border)]">
              {submitted ? (
                <div className="bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] p-4 rounded-xl text-center space-y-2 border border-[var(--badge-eggless-border)]">
                  <CheckCircle className="w-6 h-6 mx-auto" />
                  <p className="font-semibold text-xs">Enquiry Submitted Successfully</p>
                  <p className="text-[11px]">
                    Cake Magic will confirm availability for {product.name} ({selectedSize}).
                  </p>
                  <a
                    href={buildWhatsAppLink(whatsappMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs underline font-semibold mt-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Open WhatsApp to confirm faster
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmitEnquiry} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--foreground-muted)] shrink-0" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                      aria-label="Required Date"
                    />
                  </div>

                  {errorMessage && (
                    <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{loading ? "Sending..." : "Submit Enquiry"}</span>
                    </button>
                    <a
                      href={buildWhatsAppLink(whatsappMessage)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold hover:bg-[var(--surface-alt)] transition-all flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat on WhatsApp</span>
                    </a>
                  </div>
                </form>
              )}

              <div className="mt-3 text-center">
                <Link
                  href={`/cakes/${product.slug}`}
                  onClick={onClose}
                  className="text-xs text-[var(--foreground-muted)] hover:text-[var(--primary)] underline"
                >
                  View full product specifications & related cakes &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
