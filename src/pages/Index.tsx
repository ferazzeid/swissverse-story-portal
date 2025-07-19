import { HeroSection } from "@/components/HeroSection";
import { StorySection } from "@/components/StorySection";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { ResourcesGrid } from "@/components/ResourcesGrid";
import { Footer } from "@/components/Footer";
import { SwissCharacter } from "@/components/SwissCharacter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StorySection />
      <ProjectsShowcase />
      <ResourcesGrid />
      <Footer />
      <SwissCharacter />
    </div>
  );
};

export default Index;
