"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, MessageCircle } from "lucide-react";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Something Interrupted Our Oven
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
          We encountered an unexpected issue while loading this page. You can try refreshing or contact Cake Magic directly on WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="tap-target w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          <a
            href={buildWhatsAppLink(WhatsAppTemplates.generalEnquiry())}
            target="_blank"
            rel="noopener noreferrer"
            className="tap-target w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp Cake Magic</span>
          </a>
        </div>
      </div>
    </div>
  );
}
