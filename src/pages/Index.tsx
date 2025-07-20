import { HeroSection } from "@/components/HeroSection";
import { SwissverseTimeline } from "@/components/SwissverseTimeline";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { ResourcesGrid } from "@/components/ResourcesGrid";
import { Footer } from "@/components/Footer";
import { SwissCharacter } from "@/components/SwissCharacter";

const Index = () => {
  return (
    <div className="min-h-screen relative">
      {/* Hero with integrated 3D character */}
      <div className="relative">
        <HeroSection />
        <SwissCharacter isHero={true} />
      </div>
      <SwissverseTimeline />
      <ProjectsShowcase />
      <ResourcesGrid />
      <Footer />
    </div>
  );
};

export default Index;
