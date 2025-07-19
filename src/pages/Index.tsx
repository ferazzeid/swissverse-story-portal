import { HeroSection } from "@/components/HeroSection";
import { StorySection } from "@/components/StorySection";
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
      <StorySection />
      <ProjectsShowcase />
      <ResourcesGrid />
      <Footer />
      {/* Small character in bottom-right corner - only show on larger screens */}
      <div className="hidden lg:block">
        <SwissCharacter />
      </div>
    </div>
  );
};

export default Index;
