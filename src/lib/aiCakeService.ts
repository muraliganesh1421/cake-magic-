export interface DreamCakeInput {
  occasion: string;
  flavour: string;
  size: string;
  eggless: boolean;
  styleTheme?: string;
  colourPreference?: string;
  cakeMessage?: string;
  referenceImage: string | null;
  deliveryDate?: string;
  deliveryType?: string;
  additionalNotes?: string;
}

export interface DreamCakeConcept {
  id: string;
  title: string;
  designSummary: string;
  occasion: string;
  flavour: string;
  size: string;
  eggless: boolean;
  theme: string;
  colour: string;
  colours: { name: string; hex: string }[];
  cakeMessage: string;
  deliveryDate: string;
  deliveryType: string;
  additionalNotes: string;
  referenceImage: string | null;
  aiImageGenerated: boolean;
  aiImageUrl: string | null;
  createdAt: string;
}

/**
 * List of available flavours sourced strictly from Cake Magic's authentic product data
 */
export const AVAILABLE_FLAVOURS = [
  "Belgian Dark Chocolate Truffle",
  "Classic Red Velvet Cream Cheese",
  "Lotus Biscoff Speculoos",
  "Butterscotch Praline Crunch",
  "Madagascar Vanilla Bean",
  "Fresh Strawberry & Chantilly Cream",
  "Alfonso Mango & Passionfruit",
  "German Black Forest & Morello Cherry",
  "Choco Hazelnut Praline",
] as const;

/**
 * Available cake sizing standards in the patisserie
 */
export const AVAILABLE_SIZES = [
  "500g (Bento / Petite 2-3 serves)",
  "1 kg (Standard 6-8 serves)",
  "1.5 kg (Party 10-12 serves)",
  "2 kg (Celebration 16-20 serves)",
  "3+ kg (Grand Tiered)",
] as const;

/**
 * Available celebration occasions
 */
export const AVAILABLE_OCCASIONS = [
  "Birthday",
  "Anniversary",
  "Wedding",
  "Baby Celebration",
  "Kids",
  "Graduation",
  "Just Because",
  "Other",
] as const;

/**
 * Curated artisanal design styles/themes
 */
export const AVAILABLE_STYLES = [
  "Modern Minimalist",
  "Vintage Lambeth Piping",
  "Floral Botanical",
  "Royal Opulent Metallic",
  "Playful Theme Sculpted",
  "Textured Buttercream Palette",
] as const;

/**
 * Popular color harmonies
 */
export const AVAILABLE_COLOUR_THEMES = [
  { label: "Black & Antique Gold", colours: [{ name: "Obsidian", hex: "#1C1513" }, { name: "Antique Gold", hex: "#D4AF37" }] },
  { label: "Ivory & Warm Champagne", colours: [{ name: "Warm Ivory", hex: "#FAF7F2" }, { name: "Champagne", hex: "#EBDBC9" }] },
  { label: "Muted Blush & Rose", colours: [{ name: "Blush", hex: "#E8C5BD" }, { name: "Rose Cocoa", hex: "#8C594D" }] },
  { label: "Pastel Meadow & Mint", colours: [{ name: "Sage", hex: "#A8BAA8" }, { name: "Soft Ivory", hex: "#FAF7F2" }] },
  { label: "Dusty Navy & Silver", colours: [{ name: "Navy", hex: "#2E3D4F" }, { name: "Silver Leaf", hex: "#C5C7CB" }] },
] as const;

/**
 * Generate a refined cake design concept from customer input.
 * Architected so a real AI image service can be connected cleanly.
 * If no image API key is provided, it reliably provides the concept analysis
 * without faking an image.
 */
export function generateCakeConcept(input: DreamCakeInput): DreamCakeConcept {
  const combinedText = `${input.styleTheme || ""} ${input.colourPreference || ""} ${input.additionalNotes || ""}`.toLowerCase();

  // Color palette analysis
  const colours: { name: string; hex: string }[] = [];

  if (combinedText.includes("gold") || combinedText.includes("golden")) {
    colours.push({ name: "Antique Gold", hex: "#D4AF37" });
  }
  if (combinedText.includes("black") || combinedText.includes("dark")) {
    colours.push({ name: "Obsidian Cocoa", hex: "#1C1513" });
  }
  if (combinedText.includes("pink") || combinedText.includes("blush") || combinedText.includes("rose")) {
    colours.push({ name: "Muted Blush", hex: "#E8C5BD" });
  }
  if (combinedText.includes("blue") || combinedText.includes("navy")) {
    colours.push({ name: "Dusty Navy", hex: "#2E3D4F" });
  }
  if (combinedText.includes("white") || combinedText.includes("ivory") || combinedText.includes("cream")) {
    colours.push({ name: "Warm Ivory", hex: "#FAF7F2" });
  }
  if (combinedText.includes("silver") || combinedText.includes("grey")) {
    colours.push({ name: "Silver Leaf", hex: "#C5C7CB" });
  }

  // Fallback palette if none detected
  if (colours.length === 0) {
    colours.push(
      { name: "Rich Cocoa", hex: "#4A2E2B" },
      { name: "Warm Champagne", hex: "#EBDBC9" },
      { name: "Warm Ivory", hex: "#FAF7F2" }
    );
  }

  // Theme resolution
  let theme = input.styleTheme || "Modern Minimalist";
  if (!input.styleTheme) {
    if (combinedText.includes("floral") || combinedText.includes("flower")) {
      theme = "Floral Botanical";
    } else if (combinedText.includes("vintage") || combinedText.includes("retro") || combinedText.includes("piping")) {
      theme = "Vintage Lambeth Piping";
    } else if (combinedText.includes("gold") || combinedText.includes("royal") || combinedText.includes("luxury")) {
      theme = "Royal Opulent Metallic";
    } else if (input.occasion === "Kids" || combinedText.includes("cartoon") || combinedText.includes("superhero")) {
      theme = "Playful Theme Sculpted";
    } else if (input.occasion === "Wedding") {
      theme = "Grand Tiered Elegance";
    }
  }

  const colourLabel = input.colourPreference?.trim() || colours.map((c) => c.name).join(" & ");

  // Concept title
  const occasionTitle = input.occasion === "Other" ? "Celebration" : input.occasion;
  const conceptTitle = `${occasionTitle} Concept — ${input.flavour.split(" ")[0]} & ${colours[0].name}`;

  // Design summary
  const egglessText = input.eggless ? "100% vegetarian eggless sponge" : "signature patisserie sponge";
  const notesText = input.additionalNotes?.trim() ? `incorporating your notes on "${input.additionalNotes.trim()}"` : "with bespoke artisanal detailing";
  const designSummary = `An artisanal celebration design rendered in ${colourLabel}, styled with ${theme} aesthetics, ${notesText}. Built upon a foundation of ${input.flavour} in ${egglessText}, sized at ${input.size.split(" ")[0]}. Hand-finished with crisp edges, balanced textures, and celebratory refinement by Cake Magic.`;

  return {
    id: `concept-${Date.now().toString(36)}`,
    title: conceptTitle,
    designSummary,
    occasion: input.occasion,
    flavour: input.flavour,
    size: input.size,
    eggless: input.eggless,
    theme,
    colour: colourLabel,
    colours,
    cakeMessage: input.cakeMessage?.trim() || "",
    deliveryDate: input.deliveryDate || "",
    deliveryType: input.deliveryType || "Rajahmundry Delivery",
    additionalNotes: input.additionalNotes?.trim() || "",
    referenceImage: input.referenceImage,
    aiImageGenerated: false, // Ready for real API connection; never faked
    aiImageUrl: null,
    createdAt: new Date().toISOString(),
  };
}
