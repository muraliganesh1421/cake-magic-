export interface SiteConfig {
  name: string;
  tagline: string;
  establishedYear: number;
  locationCity: string;
  locationState: string;
  locationLabel: string;
  phone: string;
  phones: string[];
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
  hasOwnerPhone: boolean;
  hasOwnerAddress: boolean;
  hasOwnerHours: boolean;
}

export const siteConfig: SiteConfig = {
  name: "Cake Magic",
  tagline: "Fresh cakes, custom cakes & desserts in Rajahmundry",
  establishedYear: 2015,
  locationCity: "Rajamahendravaram (Rajahmundry)",
  locationState: "Andhra Pradesh",
  locationLabel: "Prakasam Nagar, Rajahmundry, Andhra Pradesh, India",
  
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+91 73580 84648",
  phones: ["+91 73580 84648", "+91 99660 94799", "+91 98481 81144"],
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917358084648",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@cakemagic.in",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "Jawaharlal Nehru Road, beside Abhaya Clinic, Srinivas Nagar, Prakasam Nagar, Rajamahendravaram, AP 533103",
  openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS || "Monday to Sunday: 09:00 AM - 10:00 PM",
  deliveryPolicy: "Fresh baking to order. Local delivery and store pickup available across Rajahmundry.",
  googleMapsDirectionsUrl: "https://maps.google.com/?q=Cake+Magic+Jawaharlal+Nehru+Road+Rajahmundry",
  instagramHandle: "@cakemagic_rjy_official",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/cakemagic_rjy_official/",
  currency: "₹",
  hasOwnerPhone: true,
  hasOwnerAddress: true,
  hasOwnerHours: true,
};

/**
 * Clean helper to construct WhatsApp click-to-chat links with prefilled messages
 */
export function buildWhatsAppLink(message: string): string {
  const number = siteConfig.whatsappNumber || "917358084648";
  const cleanNumber = number.replace(/[^0-9]/g, "");
  const encodedText = encodeURIComponent(message);
  
  if (!cleanNumber) {
    return `https://wa.me/?text=${encodedText}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export const WhatsAppTemplates = {
  productEnquiry: (productName: string, size?: string, date?: string) => {
    return `Hi Cake Magic, I would like to order ${productName}.${size ? ` Size: ${size}.` : ""}${date ? ` Required for: ${date}.` : ""} Please confirm availability.`;
  },
  customCakeEnquiry: (params: {
    occasion: string;
    flavour: string;
    size: string;
    eggless: string;
    theme?: string;
    colour?: string;
    message?: string;
    date?: string;
    deliveryType?: string;
    notes?: string;
  }) => {
    return [
      `*Cake Magic Custom Cake Request*`,
      ``,
      `Occasion: ${params.occasion}`,
      `Flavour: ${params.flavour}`,
      `Size: ${params.size}`,
      `Eggless: ${params.eggless}`,
      `Theme: ${params.theme || "Custom"}`,
      `Message on Cake: ${params.message || "None"}`,
      `Required Date: ${params.date || "Upcoming"}`,
      `Fulfillment: ${params.deliveryType || "Local Delivery in Rajahmundry"}`,
      params.notes ? `Special Notes: ${params.notes}` : ``,
      ``,
      `Please let me know the price quotation and confirmation.`,
    ].filter(Boolean).join("\n");
  },
  todayAvailability: () => {
    return "Hi Cake Magic, I would like to know about today's fresh counter cakes available in Rajahmundry.";
  },
  generalEnquiry: () => {
    return "Hi Cake Magic, I would like to enquire about ordering a cake for an upcoming celebration in Rajahmundry.";
  },
};
