import { store } from "@/lib/store";
import Hero from "@/components/home/Hero";
import OccasionDiscovery from "@/components/home/OccasionDiscovery";
import FeaturedCakes from "@/components/home/FeaturedCakes";
import CustomCakeFeature from "@/components/home/CustomCakeFeature";
import DreamCakeSection from "@/components/home/DreamCakeSection";
import EgglessBanner from "@/components/home/EgglessBanner";
import SocialProof from "@/components/home/SocialProof";
import InstagramFeed from "@/components/home/InstagramFeed";

export default function HomePage() {
  const products = store.getProducts().filter((p) => p.active);
  const reviews = store.getReviews().filter((r) => r.active);

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero: What is Cake Magic? */}
      <Hero />

      {/* 2. Featured Cakes: What can I buy? */}
      <FeaturedCakes products={products} />

      {/* 3. Occasions: What are you celebrating? */}
      <OccasionDiscovery />

      {/* 4. AI Cake Customizer: Create Your Dream Cake */}
      <DreamCakeSection />

      {/* 5. Custom Cake: Can Cake Magic make my idea? */}
      <CustomCakeFeature />

      {/* 6. Eggless Collection Feature */}
      <EgglessBanner />

      {/* 7. Reviews: Can I trust them? */}
      <SocialProof reviews={reviews} />

      {/* 8. Gallery / Kitchen Feed: What kind of cakes do they create? */}
      <InstagramFeed />
    </div>
  );
}
