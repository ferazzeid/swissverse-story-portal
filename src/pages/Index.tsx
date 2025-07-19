import { HeroSection } from "@/components/HeroSection";
import { StorySection } from "@/components/StorySection";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { ResourcesGrid } from "@/components/ResourcesGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <StorySection />
      <ProjectsShowcase />
      <ResourcesGrid />
      <Footer />
    </div>
  );
};

export default Index;
