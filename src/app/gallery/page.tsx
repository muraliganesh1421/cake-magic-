import { store } from "@/lib/store";
import GalleryView from "@/components/gallery/GalleryView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Celebration Cake Gallery | Cake Magic Rajahmundry",
  description:
    "Explore our portfolio of handcrafted celebration cakes, wedding tiers, kids theme cakes, and bento designs in Rajahmundry.",
};

export default function GalleryPage() {
  const items = store.getGallery();

  return (
    <div className="w-full bg-[var(--background)]">
      <GalleryView items={items} />
    </div>
  );
}
