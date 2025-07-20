import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Globe, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface HomePageContent {
  section_key: string;
  title: string;
  content: string;
  tag_type: string;
}

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [content, setContent] = useState<HomePageContent[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    fetchHomePageContent();
  }, []);

  const fetchHomePageContent = async () => {
    try {
      const { data, error } = await supabase
        .from('home_page_content')
        .select('section_key, title, content, tag_type')
        .eq('is_active', true);

      if (error) throw error;
      setContent(data || []);
    } catch (error) {
      console.error('Error fetching home page content:', error);
    }
  };

  const getContent = (sectionKey: string) => {
    return content.find(item => item.section_key === sectionKey);
  };

  const renderTitle = (sectionKey: string, defaultText: string, className: string = "") => {
    const item = getContent(sectionKey);
    const text = item?.title || defaultText;
    const tagType = item?.tag_type || 'h1';
    
    return React.createElement(tagType, { className }, text);
  };

  return (
    <>
      <style>
        {`
          @keyframes gentle-glow {
            0%, 100% {
              opacity: 0.85;
              filter: brightness(0.9);
            }
            50% {
              opacity: 1;
              filter: brightness(1.1);
            }
          }
        `}
      </style>
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden select-none"
             style={{ userSelect: 'none', WebkitUserSelect: 'none' }}>
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="absolute inset-0 opacity-30">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Interactive Glow Effect */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: "radial-gradient(circle, hsl(var(--cyber-purple)) 0%, transparent 70%)",
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        {/* Content positioned above the 3D character background */}

        {/* Main Title */}
        <div className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 slide-in-left">
          <span className="text-gradient">Welcome to </span>
          <span 
            className="text-white"
            style={{
              textShadow: `
                0 0 10px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(255, 255, 255, 0.6),
                0 0 30px rgba(255, 255, 255, 0.4),
                0 0 40px rgba(138, 43, 226, 0.8),
                0 0 70px rgba(138, 43, 226, 0.6),
                0 0 80px rgba(138, 43, 226, 0.4)
              `,
              animation: 'gentle-glow 4s ease-in-out infinite'
            }}
          >
            SWISSVERSE
          </span>
        </div>


        {/* Subtitle */}
        <div className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 slide-in-right">
          {renderTitle('hero_subtitle', 'where SWISS helps build the future of Web3, NFT and Metaverse', '')}
        </div>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: Globe, sectionKey: "explorer_title", defaultText: "Metaverse Explorer" },
            { icon: Zap, sectionKey: "pioneer_title", defaultText: "Web3 Pioneer" },
            { icon: Sparkles, sectionKey: "creator_title", defaultText: "NFT Creator" },
          ].map((item, index) => {
            const itemContent = getContent(item.sectionKey);
            return (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 rounded-full card-glow text-sm md:text-base"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <item.icon size={20} className="text-primary" />
                <span>{itemContent?.title || item.defaultText}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            variant="cyber" 
            size="xl" 
            className="group"
            onClick={() => window.open('https://hyperfy.io/swissverse', '_blank')}
          >
            <Globe className="mr-2 group-hover:rotate-12 transition-transform" />
            Visit the Metaverse
          </Button>
          <Button 
            variant="glow" 
            size="xl" 
            className="group"
            onClick={() => window.open('https://x.com/swissverse', '_blank')}
          >
            <Sparkles className="mr-2 group-hover:scale-110 transition-transform" />
            Follow on X
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="animate-bounce">
          <ArrowDown size={32} className="mx-auto text-primary opacity-70" />
        </div>
      </div>
    </section>
    </>
  );
};