import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { TimelineImageEditor } from "./timeline/TimelineImageEditor";

// Import timeline images
import laptopImage from "@/assets/timeline-laptop.jpg";
import circuitImage from "@/assets/timeline-circuit.jpg";
import matrixImage from "@/assets/timeline-matrix.jpg";
import communityImage from "@/assets/timeline-community.jpg";

// Import all potential icons
import {
  Calendar, Rocket, Coins, Globe, Cpu, Users, Mountain,
  Sparkles, Zap, Eye, Heart, Star, Trophy, Target, Lightbulb,
  Code, Database, Shield, Lock, Key, Wifi, Cloud, Server, Building, Crown,
  BookOpen, ArrowRight
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
  story_slug?: string;
  full_story?: string;
  has_story?: boolean;
  story_image_url?: string;
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
  const location = useLocation();
  const { isAdmin } = useAdminStatus();

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

  const handleImageUpdate = (momentId: string, newImageUrl: string | null) => {
    setTimelineData(prevData => 
      prevData.map(yearData => ({
        ...yearData,
        moments: yearData.moments.map(moment => 
          moment.id === momentId 
            ? { ...moment, image_url: newImageUrl }
            : moment
        )
      }))
    );
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
    <section className="py-20 px-4 max-w-6xl mx-auto relative">
      {/* Full-width metaverse background - positioned to span entire viewport */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-20">
          {/* Animated gradient mesh background */}
          <div 
            className="absolute inset-0 animate-float"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(147, 51, 234, 0.6) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.5) 0%, transparent 50%),
                radial-gradient(circle at 60% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
                linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(236, 72, 153, 0.1) 50%, rgba(59, 130, 246, 0.1) 100%)
              `,
              filter: 'blur(60px)'
            }}
          />
          <div 
            className="absolute inset-0 animate-wave"
            style={{
              background: `
                radial-gradient(ellipse at 40% 30%, rgba(236, 72, 153, 0.4) 0%, transparent 60%),
                radial-gradient(ellipse at 70% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse at 10% 90%, rgba(147, 51, 234, 0.3) 0%, transparent 60%)
              `,
              filter: 'blur(80px)'
            }}
          />
          {/* Subtle geometric overlay */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(147, 51, 234, 0.05) 50%, transparent 60%),
                linear-gradient(-45deg, transparent 40%, rgba(236, 72, 153, 0.05) 50%, transparent 60%)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>
      </div>
      
      {/* Content with proper z-index */}
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
                  
                  {/* Year Title - responsive positioning */}
                  <div className="absolute md:left-32 left-1/2 md:top-1/2 top-full md:transform md:-translate-y-1/2 transform -translate-x-1/2 md:translate-x-0 mt-4 md:mt-0 mb-8 md:mb-0">
                    <h3 className="text-lg md:text-xl font-bold text-gradient whitespace-nowrap bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border/50 shadow-lg">
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
                        <Card className="card-glow overflow-hidden animate-fade-in group relative">
                          {/* Admin Image Editor */}
                          {isAdmin && (
                            <TimelineImageEditor
                              momentId={moment.id}
                              currentImageUrl={moment.image_url || undefined}
                              onImageUpdate={(newImageUrl) => handleImageUpdate(moment.id, newImageUrl)}
                            />
                          )}
                          
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
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {moment.content}
                            </p>
                            
                            {/* Story link if available */}
                            {moment.has_story && moment.story_slug && (
                              <div className="pt-4 border-t border-border/50">
                                <Link
                                  to={`/story/${moment.story_slug}`}
                                  state={{ backgroundLocation: location }}
                                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                                >
                                  <BookOpen size={16} />
                                  Read the full story
                                  <ArrowRight size={14} />
                                </Link>
                              </div>
                            )}
                          </div>
                        </Card>

                        {/* Timeline Connector - Hidden on mobile, visible on desktop */}
                        <div className={`hidden md:block absolute top-8 z-20 ${
                          momentIndex % 2 === 0 
                            ? "-right-6" 
                            : "-left-6"
                        }`}>
                          <div className="flex items-center">
                            {/* Connector line to center */}
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