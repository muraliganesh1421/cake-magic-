"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, CheckCircle2, AlertCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { CustomCakeRequest } from "@/types";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

export default function OrderStatusPage() {
  const [lookupValue, setLookupValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CustomCakeRequest[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupValue.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/custom-requests");
      if (res.ok) {
        const data: CustomCakeRequest[] = await res.json();
        const cleanQuery = lookupValue.trim().toLowerCase();
        const matches = data.filter(
          (r) =>
            r.id.toLowerCase() === cleanQuery ||
            r.phone.includes(cleanQuery) ||
            r.customerName.toLowerCase().includes(cleanQuery)
        );
        setResults(matches);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: CustomCakeRequest["status"]) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Reviewing":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Confirmed":
        return "bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border-[var(--badge-eggless-border)]";
      case "Payment Pending":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-stone-100 text-stone-600 border-stone-200";
      default:
        return "bg-stone-100 text-stone-600 border-stone-200";
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Check Your Cake Request Status
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-2">
          Enter your Request ID (e.g. REQ-2026-001) or 10-digit mobile number to view progress.
        </p>
      </div>

      <div className="bg-[var(--surface)] p-6 rounded-3xl border border-[var(--surface-border)] shadow-md">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[var(--foreground-subtle)]" />
            <input
              type="text"
              value={lookupValue}
              onChange={(e) => setLookupValue(e.target.value)}
              placeholder="e.g. REQ-2026-001 or 98480..."
              required
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="tap-target px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {loading ? "Checking..." : "Look Up"}
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div className="mt-8 pt-6 border-t border-[var(--surface-border)] space-y-4">
            {results.length > 0 ? (
              results.map((req) => (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-[var(--surface-alt)] border border-[var(--surface-border)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-[var(--foreground-muted)] uppercase tracking-wider">
                        {req.id}
                      </span>
                      <h2 className="font-serif text-lg font-bold text-[var(--foreground)] mt-0.5">
                        {req.occasion} Cake &bull; {req.flavour}
                      </h2>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold border ${getStatusBadge(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-[var(--foreground-muted)] pt-2 border-t border-[var(--surface-border)]">
                    <div>
                      <span className="block text-[10px] uppercase font-semibold">Size</span>
                      <span className="font-medium text-[var(--foreground)]">{req.size}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold">Eggless</span>
                      <span className="font-medium text-[var(--foreground)]">
                        {req.eggless ? "Yes" : "Regular"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold">Date</span>
                      <span className="font-medium text-[var(--foreground)]">
                        {req.deliveryDate || "Pending"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-semibold">Fulfillment</span>
                      <span className="font-medium text-[var(--foreground)]">{req.deliveryType}</span>
                    </div>
                  </div>

                  {req.message && (
                    <div className="text-xs text-[var(--foreground-muted)] italic">
                      Inscription: &ldquo;{req.message}&rdquo;
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <a
                      href={buildWhatsAppLink(`Hi Cake Magic, checking update for custom cake request ${req.id}.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[var(--primary)] hover:underline inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat with Cake Magic about this order</span>
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="font-serif text-lg font-bold text-[var(--foreground)]">
                  No request found for &ldquo;{lookupValue}&rdquo;
                </p>
                <p className="text-xs text-[var(--foreground-muted)] mt-1 max-w-sm mx-auto">
                  Please verify your 10-digit mobile number or enquiry ID. Or message us directly on WhatsApp.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/custom-cakes"
          className="text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--primary)] inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Custom Cake Builder</span>
        </Link>
      </div>
    </div>
  );
}
