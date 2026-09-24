import { CustomerReview } from "@/types";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { siteConfig } from "@/config/site";

interface SocialProofProps {
  reviews: CustomerReview[];
}

export default function SocialProof({ reviews }: SocialProofProps) {
  return (
    <section className="py-20 bg-[var(--surface-alt)]/40 border-t border-[var(--surface-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
            Verified Experiences &bull; Rajahmundry
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
            Made for Celebrations Across Rajahmundry
          </h2>
          <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2">
            Read authentic feedback from families and hosts celebrating birthdays, anniversaries, and milestones with Cake Magic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[var(--surface)] p-6 sm:p-8 rounded-2xl border border-[var(--surface-border)] shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Stars & Source */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1 text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--surface-alt)] text-[var(--foreground-muted)] border border-[var(--surface-border)]">
                    {rev.source}
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-sm text-[var(--foreground)] leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Author & Verification */}
              <div className="mt-6 pt-4 border-t border-[var(--surface-border)] flex items-center justify-between">
                <div>
                  <div className="font-medium text-xs text-[var(--foreground)] flex items-center gap-1.5">
                    <span>{rev.name}</span>
                    {rev.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--badge-eggless-text)]" />
                    )}
                  </div>
                  {rev.date && (
                    <span className="text-[10px] text-[var(--foreground-muted)]">
                      {rev.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Owner note */}
        <div className="mt-10 text-center text-xs text-[var(--foreground-muted)]">
          <p>
            Have you ordered with Cake Magic? We appreciate your genuine reviews and celebration photos on Google.
          </p>
        </div>
      </div>
    </section>
  );
}
