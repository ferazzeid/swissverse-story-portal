import { HeroSection } from "@/components/HeroSection";
import { SwissverseTimeline } from "@/components/SwissverseTimeline";
import { GallerySlider } from "@/components/GallerySlider";
import { ResourcesGrid } from "@/components/ResourcesGrid";
import { Footer } from "@/components/Footer";
import { SwissCharacter } from "@/components/SwissCharacter";

import { YouTubeSection } from "@/components/YouTubeSection";
import { SEOHead } from "@/components/SEOHead";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      <SEOHead pageName="home" />
      {/* Hero with integrated 3D character */}
      <div className="relative">
        <HeroSection />
        <SwissCharacter isHero={true} />
      </div>
      <SwissverseTimeline />
      <GallerySlider />
      <YouTubeSection />
      <ResourcesGrid />
      <Footer />
    </div>
  );
};

export default Index;
