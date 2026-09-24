import { store } from "@/lib/store";
import Hero from "@/components/home/Hero";
import OccasionDiscovery from "@/components/home/OccasionDiscovery";
import FeaturedCakes from "@/components/home/FeaturedCakes";
import CustomCakeFeature from "@/components/home/CustomCakeFeature";
import CakeFinder from "@/components/home/CakeFinder";
import EgglessBanner from "@/components/home/EgglessBanner";
import SocialProof from "@/components/home/SocialProof";
import InstagramFeed from "@/components/home/InstagramFeed";

export default function HomePage() {
  const products = store.getProducts().filter((p) => p.active);
  const reviews = store.getReviews().filter((r) => r.active);

  return (
    <div className="flex flex-col w-full">
      {/* Editorial Hero */}
      <Hero />

      {/* Occasion Discovery Cards */}
      <OccasionDiscovery />

      {/* Signature Featured Cakes */}
      <FeaturedCakes products={products} />

      {/* Custom Cake Visual Transformation Section */}
      <CustomCakeFeature />

      {/* Interactive 3-Question Cake Finder */}
      <CakeFinder products={products} />

      {/* Dedicated Eggless Feature */}
      <EgglessBanner />

      {/* Genuine Social Proof & Reviews */}
      <SocialProof reviews={reviews} />

      {/* Fresh From Our Kitchen Gallery */}
      <InstagramFeed />
    </div>
  );
}
