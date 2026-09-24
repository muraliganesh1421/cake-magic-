export interface SiteConfig {
  name: string;
  tagline: string;
  locationCity: string;
  locationState: string;
  locationLabel: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  openingHours: string;
  deliveryPolicy: string;
  googleMapsEmbedUrl?: string;
  googleMapsDirectionsUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  currency: string;
}

export const siteConfig: SiteConfig = {
  name: "Cake Magic",
  tagline: "Bespoke cakes & bakery creations in Rajahmundry",
  locationCity: "Rajahmundry (Rajamahendravaram)",
  locationState: "Andhra Pradesh",
  locationLabel: "Rajahmundry, Andhra Pradesh, India",
  
  // Rule 2 compliant owner-verified placeholders
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "[OWNER VERIFIED PHONE]",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "[OWNER VERIFIED WHATSAPP]",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "[OWNER VERIFIED EMAIL]",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "[OWNER VERIFIED ADDRESS, RAJAHMUNDRY]",
  openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS || "[OWNER VERIFIED HOURS]",
  deliveryPolicy: "[OWNER VERIFIED DELIVERY POLICY]",
  googleMapsDirectionsUrl: "https://maps.google.com/?q=Cake+Magic+Rajahmundry",
  instagramHandle: "@cakemagic_rajahmundry",
  instagramUrl: "https://instagram.com/[OWNER_VERIFIED_INSTAGRAM]",
  currency: "₹",
};

/**
 * Clean helper to construct WhatsApp click-to-chat links with prefilled messages
 */
export function buildWhatsAppLink(message: string): string {
  const number = siteConfig.whatsappNumber;
  const isPlaceholder = number.includes("[OWNER");
  
  // If owner hasn't placed actual phone number yet, use generic api or alert-friendly fallback
  const cleanNumber = isPlaceholder ? "" : number.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message);
  
  if (!cleanNumber) {
    // Falls back to direct web interface where user can select recipient or copy text
    return `https://wa.me/?text=${encodedText}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export const WhatsAppTemplates = {
  productEnquiry: (productName: string, size?: string, date?: string) => {
    return `Hi Cake Magic, I'm interested in ${productName}.${size ? ` I'd like ${size}` : ""}${date ? ` for ${date}` : ""}. Could you please confirm price and availability?`;
  },
  customCakeEnquiry: (params: {
    occasion: string;
    flavour: string;
    size: string;
    eggless: string;
    message?: string;
    date: string;
    deliveryType: string;
    location?: string;
  }) => {
    return `Hi Cake Magic, I'd like to enquire about a custom cake.

Occasion: ${params.occasion}
Flavour: ${params.flavour}
Size: ${params.size}
Eggless: ${params.eggless}
Message: ${params.message || "None"}
Date: ${params.date}
Delivery/Pickup: ${params.deliveryType}
Location: ${params.location || "Rajahmundry"}`;
  },
  todayAvailability: () => {
    return "Hi Cake Magic, I'd like to know about today's fresh cakes and immediate counter availability in Rajahmundry.";
  },
  generalEnquiry: () => {
    return "Hi Cake Magic, I would like to make an enquiry regarding your bespoke celebration cakes.";
  },
};
