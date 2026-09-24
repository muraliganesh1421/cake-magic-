import Link from "next/link";
import { ArrowLeft, Home, Sparkles } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--accent-blush-dark)]">
          404 &bull; Page Not Found
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          This Sweet Creation Seems To Have Vanished
        </h1>
        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">
          The page you are looking for might have been moved, renamed, or is currently being freshly baked in our kitchen.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="tap-target w-full sm:w-auto px-6 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/cakes"
            className="tap-target w-full sm:w-auto px-6 py-3 rounded-xl border border-[var(--surface-border-strong)] text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-blush-dark)]" />
            <span>Explore Cakes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
