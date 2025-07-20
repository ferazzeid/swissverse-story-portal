import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDown, Sparkles, Globe, Zap } from "lucide-react";

export const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
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
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 slide-in-left">
          <span className="text-gradient">Welcome to the</span>{" "}
          <span className="relative text-white uppercase">
            SWISSVERSE
            {/* Shiny background effect */}
            <div className="absolute inset-0 -z-10 bg-white/20 blur-xl rounded-lg animate-pulse" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-white/10 via-white/30 to-white/10 blur-2xl rounded-lg" />
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 slide-in-right">
          Where <span className="text-white uppercase">SWISS</span> helps build the future of{" "}
          <span className="text-gradient">Web3</span>, <span className="text-gradient">NFTs</span>, and{" "}
          <span className="text-gradient">Metaverse</span>
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { icon: Globe, text: "Metaverse Explorer" },
            { icon: Zap, text: "Web3 Pioneer" },
            { icon: Sparkles, text: "NFT Creator" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full card-glow text-sm md:text-base"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <item.icon size={20} className="text-primary" />
              <span>{item.text}</span>
            </div>
          ))}
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
  );
};