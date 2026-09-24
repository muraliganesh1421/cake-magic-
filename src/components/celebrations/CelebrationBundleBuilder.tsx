"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types";
import { Sparkles, MessageCircle, Plus, Check } from "lucide-react";
import { buildWhatsAppLink } from "@/config/site";

interface CelebrationBundleBuilderProps {
  cakes: Product[];
  accessories: Product[];
}

export default function CelebrationBundleBuilder({
  cakes,
  accessories,
}: CelebrationBundleBuilderProps) {
  const [selectedCake, setSelectedCake] = useState<Product>(cakes[0] || null);
  const [selectedTopper, setSelectedTopper] = useState<Product | null>(
    accessories.find((a) => a.subcategory === "Cake Topper") || null
  );
  const [selectedCandles, setSelectedCandles] = useState<Product | null>(
    accessories.find((a) => a.subcategory === "Candles") || null
  );

  const whatsappMessage = `Hi Cake Magic, I would like to enquire about a Celebration Party Bundle:
1. Cake: ${selectedCake ? selectedCake.name : "None selected"}
2. Cake Topper: ${selectedTopper ? selectedTopper.name : "None"}
3. Candles/Popper: ${selectedCandles ? selectedCandles.name : "None"}

Location: Rajahmundry
Could you please share availability and the combined bundle quotation?`;

  return (
    <div className="bg-[var(--surface-alt)] p-6 sm:p-10 rounded-3xl border border-[var(--surface-border)] shadow-md">
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-blush-light)] text-[var(--accent-blush-dark)] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated Party Pairing</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Build Your Complete Celebration Bundle
        </h2>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1.5">
          Bundle your cake with matching cake toppers and celebration candles. Enquire together for unified party coordination in Rajahmundry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Select Cake */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] block">
            1. Select Cake
          </span>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--surface-alt)]">
            {selectedCake && (
              <Image
                src={selectedCake.images[0]}
                alt={selectedCake.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <select
              value={selectedCake?.id}
              onChange={(e) => {
                const found = cakes.find((c) => c.id === e.target.value);
                if (found) setSelectedCake(found);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] font-medium text-[var(--foreground)]"
            >
              {cakes.map((cake) => (
                <option key={cake.id} value={cake.id}>
                  {cake.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 2: Select Topper */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] block">
            2. Select Topper
          </span>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--surface-alt)]">
            {selectedTopper && (
              <Image
                src={selectedTopper.images[0]}
                alt={selectedTopper.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <select
              value={selectedTopper?.id || ""}
              onChange={(e) => {
                const found = accessories.find((a) => a.id === e.target.value);
                setSelectedTopper(found || null);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] font-medium text-[var(--foreground)]"
            >
              <option value="">No topper</option>
              {accessories
                .filter((a) => a.subcategory === "Cake Topper")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Step 3: Select Candles or Sparkler */}
        <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] space-y-3">
          <span className="text-xs uppercase font-bold tracking-wider text-[var(--foreground-muted)] block">
            3. Sparklers & Candles
          </span>
          <div className="relative aspect-video rounded-xl overflow-hidden bg-[var(--surface-alt)]">
            {selectedCandles && (
              <Image
                src={selectedCandles.images[0]}
                alt={selectedCandles.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div>
            <select
              value={selectedCandles?.id || ""}
              onChange={(e) => {
                const found = accessories.find((a) => a.id === e.target.value);
                setSelectedCandles(found || null);
              }}
              className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] font-medium text-[var(--foreground)]"
            >
              <option value="">No extra candles/sparklers</option>
              {accessories
                .filter((a) => a.subcategory !== "Cake Topper")
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bundle Action */}
      <div className="mt-8 pt-6 border-t border-[var(--surface-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[var(--foreground-muted)] block">Bundle Pricing</span>
          <span className="text-base font-bold text-[var(--primary)]">
            Price on enquiry &bull; Package discount confirmed on WhatsApp
          </span>
        </div>

        <a
          href={buildWhatsAppLink(whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="tap-target px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs sm:text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center gap-2 shadow-xs"
        >
          <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
          <span>Enquire Bundle on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
