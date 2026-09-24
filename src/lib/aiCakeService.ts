export interface DreamCakeInput {
  occasion: "Birthday" | "Anniversary" | "Wedding" | "Kids" | "Other";
  flavour: string;
  description: string;
  referenceImage: string | null;
  size: string;
  eggless: boolean;
  cakeMessage: string;
}

export interface DreamCakeConcept {
  id: string;
  title: string;
  designSummary: string;
  description: string;
  occasion: string;
  flavour: string;
  size: string;
  theme: string;
  colours: { name: string; hex: string }[];
  cakeMessage: string;
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
  "Kids",
  "Other",
] as const;

/**
 * Generate a refined cake concept from customer input.
 * Ready for live AI image integration (DALL-E / Imagen / Stability).
 * When no image API is hooked up, it reliably provides the concept analysis
 * without faking an image.
 */
export function generateCakeConcept(input: DreamCakeInput): DreamCakeConcept {
  const descLower = (input.description || "").toLowerCase();

  // Smart palette extraction based on prompt keywords
  const colours: { name: string; hex: string }[] = [];

  if (descLower.includes("gold") || descLower.includes("golden")) {
    colours.push({ name: "Antique Gold", hex: "#D4AF37" });
  }
  if (descLower.includes("black") || descLower.includes("dark")) {
    colours.push({ name: "Obsidian Cocoa", hex: "#1C1513" });
  }
  if (descLower.includes("pink") || descLower.includes("blush") || descLower.includes("rose")) {
    colours.push({ name: "Muted Blush", hex: "#E8C5BD" });
  }
  if (descLower.includes("blue") || descLower.includes("navy")) {
    colours.push({ name: "Dusty Navy", hex: "#354A5F" });
  }
  if (descLower.includes("white") || descLower.includes("ivory") || descLower.includes("cream")) {
    colours.push({ name: "Warm Ivory", hex: "#FAF7F2" });
  }
  if (descLower.includes("silver") || descLower.includes("grey")) {
    colours.push({ name: "Soft Silver", hex: "#C5C7CB" });
  }

  // Fallback signature palette if no specific colour mentioned
  if (colours.length === 0) {
    colours.push(
      { name: "Rich Cocoa", hex: "#4A2E2B" },
      { name: "Warm Champagne", hex: "#EBDBC9" },
      { name: "Ivory Silk", hex: "#FAF7F2" }
    );
  }

  // Theme detection
  let theme = "Modern Minimalist Elegance";
  if (descLower.includes("floral") || descLower.includes("flower")) {
    theme = "Botanical Floral Palette";
  } else if (descLower.includes("vintage") || descLower.includes("retro") || descLower.includes("piping")) {
    theme = "Victorian Vintage Piping";
  } else if (descLower.includes("gold") || descLower.includes("royal") || descLower.includes("luxury")) {
    theme = "Opulent Royal Metallic";
  } else if (input.occasion === "Kids" || descLower.includes("cartoon") || descLower.includes("superhero")) {
    theme = "Playful Handcrafted Sculpted";
  } else if (input.occasion === "Wedding") {
    theme = "Architectural Tiered Luxury";
  }

  // Title generation
  const occasionTitle = input.occasion === "Other" ? "Celebration" : input.occasion;
  const conceptTitle = `${occasionTitle} Concept — ${input.flavour.split(" ")[0]} & ${colours[0].name}`;

  // Design summary synthesis
  const egglessText = input.eggless ? "100% vegetarian eggless sponge" : "artisanal sponge recipe";
  const descText = input.description.trim() ? `highlighting your vision of "${input.description.trim()}"` : "with bespoke artisanal detailing";
  const designSummary = `A custom-sculpted celebration design rendered in ${colours.map((c) => c.name).join(" and ")}, ${descText}. Constructed on a foundation of ${input.flavour} in ${egglessText}, sized at ${input.size.split(" ")[0]}. Hand-finished with crisp edges, balanced textures, and celebratory refinement by Cake Magic.`;

  return {
    id: `concept-${Date.now().toString(36)}`,
    title: conceptTitle,
    designSummary,
    description: input.description,
    occasion: input.occasion,
    flavour: input.flavour,
    size: input.size,
    theme,
    colours,
    cakeMessage: input.cakeMessage.trim(),
    referenceImage: input.referenceImage,
    aiImageGenerated: false, // Architectural toggle for real image provider connection
    aiImageUrl: null,
    createdAt: new Date().toISOString(),
  };
}
