import { Suspense, lazy, useEffect, useState } from "react";
import { HeroSection } from "@/components/HeroSection";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { logEvent } from "@/integrations/supabase/analytics";

// Lazy-load heavy sections for faster first paint
const SwissCharacterLazy = lazy(() => import("@/components/SwissCharacter").then(m => ({ default: m.SwissCharacter })));
const SwissverseTimelineLazy = lazy(() => import("@/components/SwissverseTimeline").then(m => ({ default: m.SwissverseTimeline })));
const GallerySliderLazy = lazy(() => import("@/components/GallerySlider").then(m => ({ default: m.GallerySlider })));
const YouTubeSectionLazy = lazy(() => import("@/components/YouTubeSection").then(m => ({ default: m.YouTubeSection })));
const ResourcesGridLazy = lazy(() => import("@/components/ResourcesGrid").then(m => ({ default: m.ResourcesGrid })));
const FooterLazy = lazy(() => import("@/components/Footer").then(m => ({ default: m.Footer })));

const Index = () => {
  // Pause 3D by default if user prefers reduced motion
  const [paused3D, setPaused3D] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setPaused3D(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    logEvent("page_view");
  }, []);
  return (
    <div className="min-h-screen relative">
      <SEOHead pageName="home" />
      {/* Hero with integrated 3D character */}
      <div className="relative">
        <HeroSection />

        {/* 3D controls */}
        <div className="absolute right-4 top-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setPaused3D((p) => {
                const next = !p;
                logEvent("3d_toggle", { paused: next });
                return next;
              });
            }}
            aria-pressed={paused3D}
            aria-label={paused3D ? "Enable 3D animations" : "Pause 3D animations"}
            className="hover-scale"
          >
            {paused3D ? "Play 3D" : "Pause 3D"}
          </Button>
        </div>

        <Suspense fallback={null}>
          <SwissCharacterLazy isHero={true} paused={paused3D} />
        </Suspense>
      </div>

      <main id="main">
        <Suspense fallback={<section className="min-h-32" aria-busy="true" />}>
          <SwissverseTimelineLazy />
        </Suspense>
        <Suspense fallback={<section className="min-h-32" aria-busy="true" />}>
          <GallerySliderLazy />
        </Suspense>
        <Suspense fallback={<section className="min-h-32" aria-busy="true" />}>
          <YouTubeSectionLazy />
        </Suspense>
        <Suspense fallback={<section className="min-h-32" aria-busy="true" />}>
          <ResourcesGridLazy />
        </Suspense>
      </main>

      <Suspense fallback={<footer className="min-h-16" aria-busy="true" />}>
        <FooterLazy />
      </Suspense>
    </div>
  );
};

export default Index;
