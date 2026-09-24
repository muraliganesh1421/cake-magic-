import { Metadata } from "next";
import { siteConfig, buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";
import { Phone, MessageCircle, Mail, MapPin, Clock, Navigation, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Store Location | Cake Magic Rajahmundry",
  description:
    "Contact Cake Magic in Rajahmundry, Andhra Pradesh. Store address, phone, WhatsApp ordering, opening hours, and Google Maps directions.",
};

export default function ContactPage() {
  // Schema.org LocalBusiness structured data
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "Bakery",
    name: "Cake Magic",
    image: "https://cakemagic-rajahmundry.com/images/og-cake-magic.jpg",
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressLocality: "Rajahmundry",
      addressRegion: "Andhra Pradesh",
      addressCountry: "IN",
    },
    url: "https://cakemagic-rajahmundry.com",
    priceRange: "$$",
    servesCuisine: "Bakery, Cakes, Desserts",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <div className="w-full bg-[var(--background)] py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[var(--foreground-muted)]">
              Store &amp; Enquiries &bull; Rajahmundry
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] mt-2">
              Connect With Cake Magic
            </h1>
            <p className="text-sm md:text-base text-[var(--foreground-muted)] mt-2.5">
              Have questions about custom designs, party orders, or today&apos;s fresh bake availability? We&apos;re here to assist you.
            </p>
          </div>

          {/* Quick Action Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* WhatsApp */}
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                  WhatsApp Ordering
                </h2>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Design consultations, flavour suggestions, photo reference sharing, and delivery slot confirmations.
                </p>
                <div className="text-xs font-semibold text-[var(--foreground)] pt-1">
                  {siteConfig.hasOwnerPhone ? siteConfig.whatsappNumber : "Direct Messaging Available"}
                </div>
              </div>
              <a
                href={buildWhatsAppLink(WhatsAppTemplates.generalEnquiry())}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target w-full py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>

            {/* Direct Consultation / Store Contact */}
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-blush-light)] text-[var(--primary)] flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                  Celebration Enquiries
                </h2>
                <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                  Discuss celebration themes, multi-tier wedding cakes, or immediate counter cake availability in Rajahmundry.
                </p>
                <div className="text-xs font-semibold text-[var(--foreground)] pt-1">
                  {siteConfig.hasOwnerPhone ? siteConfig.phone : "Rajahmundry &bull; Serving Local Orders"}
                </div>
              </div>
              {siteConfig.hasOwnerPhone ? (
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="tap-target w-full py-2.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold hover:bg-[var(--surface-alt)] transition-all flex items-center justify-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Store</span>
                </a>
              ) : (
                <a
                  href={buildWhatsAppLink("Hi Cake Magic, I would like to consult about an upcoming celebration order in Rajahmundry.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target w-full py-2.5 rounded-xl border border-[var(--primary)] text-[var(--primary)] text-xs font-semibold hover:bg-[var(--surface-alt)] transition-all flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Enquire Online</span>
                </a>
              )}
            </div>

            {/* Location & Directions */}
            <div className="p-6 rounded-xl bg-[var(--surface)] border border-[var(--surface-border)] shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-champagne)]/60 text-[var(--foreground)] flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="font-serif text-lg font-bold text-[var(--foreground)]">
                  Location &amp; Delivery
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  {siteConfig.hasOwnerAddress ? siteConfig.address : "Rajahmundry (Rajamahendravaram), Andhra Pradesh"}
                </p>
                <div className="text-xs text-[var(--foreground-muted)] pt-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span>{siteConfig.hasOwnerHours ? siteConfig.openingHours : "Pre-orders open daily"}</span>
                </div>
              </div>
              <a
                href={siteConfig.googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target w-full py-2.5 rounded-xl border border-[var(--surface-border-strong)] text-[var(--foreground)] text-xs font-semibold hover:bg-[var(--surface-alt)] transition-all flex items-center justify-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-[var(--primary)]" />
                <span>Get Directions</span>
              </a>
            </div>
          </div>

          {/* Google Maps / Local Area Section */}
          <div className="rounded-3xl overflow-hidden bg-[var(--surface)] border border-[var(--surface-border)] shadow-md grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 p-8 sm:p-10 space-y-4 flex flex-col justify-center">
              <span className="text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                Local Presence
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                Serving Rajahmundry &bull; Rajamahendravaram
              </h2>
              <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed">
                We cater to celebration deliveries across prime neighbourhoods in Rajahmundry including Danavaipeta, Tilak Road, Morampudi, Kambala Cheruvu, Prakash Nagar, and adjoining localities.
              </p>
              <div className="pt-2 space-y-2 text-xs text-[var(--foreground-muted)]">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--badge-eggless-text)]" />
                  <span>Carefully packed temperature-safe cake boxes</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--badge-eggless-text)]" />
                  <span>In-store pickup or scheduled celebration dispatch</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-[var(--surface-alt)] min-h-[350px] relative flex items-center justify-center p-6 text-center">
              {/* Google Maps Embed / Interactive Pin Fallback */}
              <div className="w-full h-full min-h-[300px] rounded-2xl bg-white border border-[var(--surface-border)] p-8 flex flex-col items-center justify-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-[var(--accent-blush-light)] text-[var(--primary)] flex items-center justify-center shadow-xs">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[var(--foreground)]">
                    Cake Magic Patisserie
                  </h3>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1 max-w-sm">
                    {siteConfig.hasOwnerAddress ? siteConfig.address : "Rajahmundry (Rajamahendravaram), Andhra Pradesh"}
                  </p>
                </div>
                <a
                  href={siteConfig.googleMapsDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target px-6 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center gap-2 shadow-xs"
                >
                  <Navigation className="w-4 h-4 text-[var(--accent-blush)]" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
