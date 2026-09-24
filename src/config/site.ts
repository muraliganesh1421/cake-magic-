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
  hasOwnerPhone: boolean;
  hasOwnerAddress: boolean;
  hasOwnerHours: boolean;
}

export const siteConfig: SiteConfig = {
  name: "Cake Magic",
  tagline: "Bespoke cakes & bakery creations in Rajahmundry",
  locationCity: "Rajahmundry (Rajamahendravaram)",
  locationState: "Andhra Pradesh",
  locationLabel: "Rajahmundry, Andhra Pradesh, India",
  
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
  address: process.env.NEXT_PUBLIC_STORE_ADDRESS || "Rajahmundry, Andhra Pradesh",
  openingHours: process.env.NEXT_PUBLIC_OPENING_HOURS || "Pre-orders & celebration enquiries open daily",
  deliveryPolicy: "Fresh baking to order. Local delivery and store pickup available across Rajahmundry.",
  googleMapsDirectionsUrl: "https://maps.google.com/?q=Cake+Magic+Rajahmundry",
  instagramHandle: "@cakemagic_rajahmundry",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://instagram.com",
  currency: "₹",
  hasOwnerPhone: Boolean(process.env.NEXT_PUBLIC_CONTACT_PHONE && !process.env.NEXT_PUBLIC_CONTACT_PHONE.startsWith("[")),
  hasOwnerAddress: Boolean(process.env.NEXT_PUBLIC_STORE_ADDRESS && !process.env.NEXT_PUBLIC_STORE_ADDRESS.startsWith("[")),
  hasOwnerHours: Boolean(process.env.NEXT_PUBLIC_OPENING_HOURS && !process.env.NEXT_PUBLIC_OPENING_HOURS.startsWith("[")),
};

/**
 * Clean helper to construct WhatsApp click-to-chat links with prefilled messages
 */
export function buildWhatsAppLink(message: string): string {
  const number = siteConfig.whatsappNumber;
  const isPlaceholder = !number || number.includes("[OWNER");
  
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
    theme?: string;
    colour?: string;
    message?: string;
    date?: string;
    deliveryType?: string;
    notes?: string;
  }) => {
    return [
      `Cake Magic Custom Cake Request`,
      ``,
      `Occasion: ${params.occasion}`,
      `Flavour: ${params.flavour}`,
      `Size: ${params.size}`,
      `Eggless: ${params.eggless}`,
      `Theme: ${params.theme || "Bespoke Patisserie"}`,
      `Colour: ${params.colour || "Artisanal palette"}`,
      `Message: ${params.message || "None"}`,
      `Preferred Date: ${params.date || "To be confirmed"}`,
      `Delivery/Pickup: ${params.deliveryType || "Rajahmundry Delivery / Pickup"}`,
      params.notes ? `Additional Notes: ${params.notes}` : `Additional Notes: None`,
      ``,
      `Please confirm availability and final pricing.`,
    ].join("\n");
  },
  todayAvailability: () => {
    return "Hi Cake Magic, I'd like to know about today's fresh cakes and immediate counter availability in Rajahmundry.";
  },
  generalEnquiry: () => {
    return "Hi Cake Magic, I would like to make an enquiry regarding your bespoke celebration cakes.";
  },
};
