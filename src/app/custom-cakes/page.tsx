import { Metadata } from "next";
import { store } from "@/lib/store";
import CustomCakeWizard from "@/components/custom/CustomCakeWizard";

export const metadata: Metadata = {
  title: "Design Your Custom Celebration Cake | Cake Magic Rajahmundry",
  description:
    "Customise your celebration cake with Cake Magic Rajahmundry. Choose occasion, flavour, size, eggless preference, upload reference photo, and submit request.",
};

export default function CustomCakesPage() {
  const products = store.getProducts();

  // Extract distinct flavours from existing products
  const flavourSet = new Set<string>();
  products.forEach((p) => {
    p.flavours.forEach((f) => flavourSet.add(f));
  });

  const availableFlavours = Array.from(flavourSet);

  return (
    <div className="w-full bg-[var(--background)] min-h-[calc(100vh-80px)]">
      <CustomCakeWizard availableFlavours={availableFlavours} />
    </div>
  );
}
