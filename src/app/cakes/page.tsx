import { store } from "@/lib/store";
import CatalogueView from "@/components/catalogue/CatalogueView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cakes & Celebration Creations | Rajahmundry",
  description:
    "Explore our handcrafted celebration cakes in Rajahmundry. Truffles, cheesecakes, bento boxes, eggless options, and custom designer cakes.",
};

interface CakesPageProps {
  searchParams: Promise<{
    occasion?: string;
    eggless?: string;
    availableToday?: string;
  }>;
}

export default async function CakesPage({ searchParams }: CakesPageProps) {
  const params = await searchParams;
  const products = store.getProducts().filter((p) => p.category === "cakes" && p.active);

  const initialOccasion = params.occasion || "All";
  const initialEggless = params.eggless === "true";

  return (
    <div className="w-full bg-[var(--background)]">
      <CatalogueView
        initialProducts={products}
        initialCategory="cakes"
        initialOccasion={initialOccasion}
        initialEggless={initialEggless}
      />
    </div>
  );
}
