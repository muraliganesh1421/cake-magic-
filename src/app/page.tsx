import { store } from "@/lib/store";
import Hero from "@/components/home/Hero";
import HomeProductSection from "@/components/home/HomeProductSection";
import CustomCakeFeature from "@/components/home/CustomCakeFeature";
import BakeryInfoSection from "@/components/home/BakeryInfoSection";
import SocialProof from "@/components/home/SocialProof";

export default function HomePage() {
  const products = store.getProducts().filter((p) => p.active);
  const reviews = store.getReviews().filter((r) => r.active);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Compact Hero Banner */}
      <Hero />

      {/* 2. Direct Category Buttons & Product Cards Grid (3-5 second customer ordering) */}
      <HomeProductSection products={products} />

      {/* 3. Custom Cake Section */}
      <CustomCakeFeature />

      {/* 4. Local Rajahmundry Store & Delivery Information */}
      <BakeryInfoSection />

      {/* 5. Customer Trust & Reviews */}
      <SocialProof reviews={reviews} />
    </div>
  );
}
