import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Import timeline images
import laptopImage from "@/assets/timeline-laptop.jpg";
import circuitImage from "@/assets/timeline-circuit.jpg";
import matrixImage from "@/assets/timeline-matrix.jpg";
import communityImage from "@/assets/timeline-community.jpg";

// Import all potential icons
import {
  Calendar, Rocket, Coins, Globe, Cpu, Users, Mountain,
  Sparkles, Zap, Eye, Heart, Star, Trophy, Target, Lightbulb,
  Code, Database, Shield, Lock, Key, Wifi, Cloud, Server, Building, Crown
} from "lucide-react";

interface TimelineMoment {
  id: string;
  year: number;
  year_title: string;
  month: string;
  title: string;
  content: string;
  highlight: string;
  icon_name: string;
  image_url: string | null;
  gradient_class: string;
  display_order: number;
  is_active: boolean;
}

interface TimelineYear {
  year: number;
  title: string;
  moments: TimelineMoment[];
}

// Icon mapping
const iconMap: { [key: string]: React.ComponentType<any> } = {
  calendar: Calendar,
  rocket: Rocket,
  coins: Coins,
  globe: Globe,
  cpu: Cpu,
  users: Users,
  mountain: Mountain,
  sparkles: Sparkles,
  zap: Zap,
  eye: Eye,
  heart: Heart,
  star: Star,
  trophy: Trophy,
  target: Target,
  lightbulb: Lightbulb,
  code: Code,
  database: Database,
  shield: Shield,
  lock: Lock,
  key: Key,
  wifi: Wifi,
  cloud: Cloud,
  server: Server,
  building: Building,
  crown: Crown
};

// Fallback data - same as original timeline
const fallbackTimelineData: TimelineYear[] = [
  {
    year: 2020,
    title: "The Genesis Era",
    moments: [
      {
        id: "genesis-march",
        year: 2020,
        year_title: "The Genesis Era",
        month: "March",
        title: "Digital Birth",
        content: "In March 2020, as the world faced unprecedented challenges, the vision for SWISSVERSE began to take shape. A digital native was born with the mission to bridge traditional systems and revolutionary Web3 technologies.",
        highlight: "Project Genesis",
        icon_name: "rocket",
        image_url: laptopImage,
        gradient_class: "from-purple-500 to-pink-500",
        display_order: 1,
        is_active: true
      }
    ]
  },
  {
    year: 2021,
    title: "Foundation Building",
    moments: [
      {
        id: "foundation-tech",
        year: 2021,
        year_title: "Foundation Building",
        month: "Early 2021",
        title: "Technology Foundation",
        content: "SWISS began developing the core technological infrastructure that would later define the Swissverse. Focus on blockchain integration and decentralized systems architecture.",
        highlight: "Tech Development",
        icon_name: "cpu",
        image_url: circuitImage,
        gradient_class: "from-cyan-500 to-purple-500",
        display_order: 1,
        is_active: true
      },
      {
        id: "foundation-vision",
        year: 2021,
        year_title: "Foundation Building",
        month: "Mid 2021",
        title: "Vision Crystallization",
        content: "The metaverse vision evolved throughout 2021, focusing on creating interconnected digital experiences where NFTs become functional assets that empower creators.",
        highlight: "Vision Development",
        icon_name: "globe",
        image_url: null,
        gradient_class: "from-blue-500 to-cyan-500",
        display_order: 2,
        is_active: true
      }
    ]
  },
  {
    year: 2022,
    title: "Metaverse Evolution",
    moments: [
      {
        id: "metaverse-concept",
        year: 2022,
        year_title: "Metaverse Evolution",
        month: "Early 2022",
        title: "Metaverse Conceptualization",
        content: "SWISS expanded the Swissverse concept to include immersive digital experiences that bridge virtual and physical realities, laying groundwork for the hyperfy revolution.",
        highlight: "Metaverse Architect",
        icon_name: "calendar",
        image_url: matrixImage,
        gradient_class: "from-green-500 to-cyan-500",
        display_order: 1,
        is_active: true
      },
      {
        id: "community-building",
        year: 2022,
        year_title: "Metaverse Evolution",
        month: "Late 2022",
        title: "Community Formation",
        content: "The first Swissverse community began to form, bringing together creators, developers, and visionaries who shared the dream of decentralized digital experiences.",
        highlight: "Community Builder",
        icon_name: "users",
        image_url: communityImage,
        gradient_class: "from-emerald-500 to-green-500",
        display_order: 2,
        is_active: true
      }
    ]
  },
  {
    year: 2023,
    title: "hyperfy Revolution",
    moments: [
      {
        id: "hyperfy-launch",
        year: 2023,
        year_title: "hyperfy Revolution",
        month: "Early 2023",
        title: "hyperfy Era Begins",
        content: "2023 ushered in the hyperfy era. SWISS pioneered new approaches to decentralized experiences, creating innovative protocols that make Web3 accessible to everyone.",
        highlight: "hyperfy Pioneer",
        icon_name: "coins",
        image_url: null,
        gradient_class: "from-orange-500 to-pink-500",
        display_order: 1,
        is_active: true
      },
      {
        id: "hyperfy-evolution",
        year: 2023,
        year_title: "hyperfy Revolution",
        month: "Mid 2023",
        title: "Platform Evolution",
        content: "The hyperfy platform evolved to include advanced features for creators and builders, establishing SWISS as a leading figure in the metaverse revolution.",
        highlight: "Platform Leader",
        icon_name: "mountain",
        image_url: null,
        gradient_class: "from-red-500 to-orange-500",
        display_order: 2,
        is_active: true
      }
    ]
  }
];

export const SwissverseTimeline = () => {
  const [timelineData, setTimelineData] = useState<TimelineYear[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_content')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Group moments by year
        const groupedData = groupMomentsByYear(data);
        setTimelineData(groupedData);
      } else {
        // Use fallback data if no database content
        setTimelineData(fallbackTimelineData);
      }
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      // Use fallback data on error
      setTimelineData(fallbackTimelineData);
    } finally {
      setIsLoading(false);
    }
  };

  const groupMomentsByYear = (moments: TimelineMoment[]): TimelineYear[] => {
    const groups: { [year: number]: TimelineYear } = {};
    
    moments.forEach(moment => {
      if (!groups[moment.year]) {
        groups[moment.year] = {
          year: moment.year,
          title: moment.year_title,
          moments: []
        };
      }
      groups[moment.year].moments.push(moment);
    });
    
    return Object.values(groups).sort((a, b) => a.year - b.year);
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Calendar;
  };

  if (isLoading) {
    return (
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white uppercase">SWISSVERSE</span>{" "}
            <span className="text-gradient">Story</span>
          </h2>
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-96 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 max-w-6xl mx-auto relative overflow-hidden">
      {/* Flowing wave SVG background */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1200 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.4" />
              <stop offset="50%" stopColor="rgb(236, 72, 153)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="wave2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(236, 72, 153)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="rgb(59, 130, 246)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {/* Wave 1 */}
          <path 
            d="M0,400 C150,300 350,500 600,400 C850,300 1050,500 1200,400 L1200,800 L0,800 Z" 
            fill="url(#wave1)"
            className="animate-wave"
            style={{transformOrigin: 'center', animation: 'wave 15s ease-in-out infinite'}}
          />
          
          {/* Wave 2 */}
          <path 
            d="M0,500 C200,400 400,600 600,500 C800,400 1000,600 1200,500 L1200,800 L0,800 Z" 
            fill="url(#wave2)"
            className="animate-float"
            style={{transformOrigin: 'center', animation: 'float 20s ease-in-out infinite reverse'}}
          />
        </svg>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-white uppercase">SWISSVERSE</span>{" "}
          <span className="text-gradient">Story</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Journey through the evolution of <span className="text-white uppercase font-semibold">SWISS</span> and discover the vision that drives the <span className="text-white uppercase font-semibold">SWISSVERSE</span> forward
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Central Timeline Line - stops before the "To be continued" section */}
        <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 via-green-500 to-orange-500 transform -translate-x-1/2 rounded-full shadow-lg" style={{ height: 'calc(100% - 120px)' }} />

        <div className="space-y-24">
          {timelineData.map((yearData, yearIndex) => (
            <div key={yearData.year} className="relative">
              {/* Year Marker */}
              <div className="flex items-center justify-center mb-12">
                <div className="relative">
                  {/* Year Node */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center card-glow shadow-2xl z-10 relative">
                    <div className="text-2xl font-bold text-white">
                      {yearData.year}
                    </div>
                  </div>
                  
                  {/* Year Title - positioned to the side */}
                  <div className="absolute left-32 top-1/2 transform -translate-y-1/2">
                    <h3 className="text-xl font-bold text-gradient whitespace-nowrap bg-background px-3 py-1 rounded-lg">
                      {yearData.title}
                    </h3>
                  </div>

                </div>
              </div>

              {/* Year Moments */}
              <div className="space-y-16">
                {yearData.moments.map((moment, momentIndex) => {
                  const IconComponent = getIconComponent(moment.icon_name);
                  return (
                    <div
                      key={moment.id}
                      className="relative"
                    >
                      {/* Content Card with proper left/right positioning */}
                       <div className={`relative w-full max-w-lg ${
                         momentIndex % 2 === 0 
                           ? "mr-auto ml-0" 
                           : "ml-auto mr-0"
                       }`}>
                        <Card className="card-glow overflow-hidden animate-fade-in">
                          {/* Optional Image - only show if image exists */}
                          {moment.image_url && (
                            <div className="relative -m-6 mb-0 mx-[-1.5rem] mt-[-1.5rem]">
                              <div className="relative h-48 overflow-hidden">
                                <img
                                  src={moment.image_url}
                                  alt={moment.title}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={(e) => {
                                    // Replace with placeholder if image fails to load
                                    e.currentTarget.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=192&fit=crop";
                                  }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                                <div className="absolute bottom-3 left-6 px-3 py-1 bg-background/80 backdrop-blur-sm rounded">
                                  <div className="text-sm font-medium text-white">{moment.month}</div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className={`p-6 ${moment.image_url ? 'pt-4' : ''}`}>
                            <div className="flex items-start gap-4 mb-4">
                              <div className={`p-3 rounded-full bg-gradient-to-br ${moment.gradient_class} shadow-lg border-2 border-white/30 animate-scale-in backdrop-blur-sm`} style={{backgroundSize: 'cover', backgroundPosition: 'center'}}>
                                <IconComponent size={24} className="text-white drop-shadow-sm" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="text-xl font-bold">{moment.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {moment.highlight}
                                  </Badge>
                                </div>
                                {!moment.image_url && (
                                  <p className="text-sm text-muted-foreground mb-2">{moment.month}</p>
                                )}
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {moment.content}
                            </p>
                          </div>
                        </Card>

                        {/* Timeline Connector - Simplified and properly positioned */}
                        <div className={`absolute top-8 z-20 ${
                          momentIndex % 2 === 0 
                            ? "md:-right-6 right-0 md:left-auto left-1/2 md:transform-none transform -translate-x-1/2" 
                            : "md:-left-6 left-0 md:right-auto right-1/2 md:transform-none transform translate-x-1/2"
                        }`}>
                          <div className="flex items-center">
                            {/* Connector line to center - always visible */}
                            <div className={`h-1 bg-white/60 shadow-md ${
                              momentIndex % 2 === 0 
                                ? "w-6 md:order-1 order-2" 
                                : "w-6 md:order-2 order-1"
                            }`} />
                            
                            {/* Center dot with gradient */}
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${moment.gradient_class} border border-white/60 shadow-sm ${
                              momentIndex % 2 === 0 
                                ? "md:order-2 order-1" 
                                : "md:order-1 order-2"
                            }`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Future Indicator */}
        <div className="flex items-center justify-center mt-24 relative z-20">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <Mountain size={24} className="text-muted-foreground" />
          </div>
          <div className="ml-4">
            <p className="text-lg font-semibold text-muted-foreground">To be continued...</p>
            <p className="text-sm text-muted-foreground">The journey continues</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
};