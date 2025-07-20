import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Rocket, Coins, Globe, Cpu, Users, Mountain } from "lucide-react";

// Import timeline images
import laptopImage from "@/assets/timeline-laptop.jpg";
import circuitImage from "@/assets/timeline-circuit.jpg";
import matrixImage from "@/assets/timeline-matrix.jpg";
import communityImage from "@/assets/timeline-community.jpg";

interface TimelineMoment {
  id: string;
  month: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string;
  highlight: string;
  image?: string;
  gradient: string;
}

interface TimelineYear {
  year: number;
  title: string;
  moments: TimelineMoment[];
}

const timelineData: TimelineYear[] = [
  {
    year: 2020,
    title: "The Genesis Era",
    moments: [
      {
        id: "genesis-march",
        month: "March",
        title: "Digital Birth",
        icon: Rocket,
        content: "In March 2020, as the world faced unprecedented challenges, the vision for SWISSVERSE began to take shape. A digital native was born with the mission to bridge traditional systems and revolutionary Web3 technologies.",
        highlight: "Project Genesis",
        image: laptopImage,
        gradient: "from-purple-500 to-pink-500"
      }
    ]
  },
  {
    year: 2021,
    title: "Foundation Building",
    moments: [
      {
        id: "foundation-tech",
        month: "Early 2021",
        title: "Technology Foundation",
        icon: Cpu,
        content: "SWISS began developing the core technological infrastructure that would later define the Swissverse. Focus on blockchain integration and decentralized systems architecture.",
        highlight: "Tech Development",
        image: circuitImage,
        gradient: "from-cyan-500 to-purple-500"
      },
      {
        id: "foundation-vision",
        month: "Mid 2021",
        title: "Vision Crystallization",
        icon: Globe,
        content: "The metaverse vision evolved throughout 2021, focusing on creating interconnected digital experiences where NFTs become functional assets that empower creators.",
        highlight: "Vision Development",
        gradient: "from-blue-500 to-cyan-500"
      }
    ]
  },
  {
    year: 2022,
    title: "Metaverse Evolution",
    moments: [
      {
        id: "metaverse-concept",
        month: "Early 2022",
        title: "Metaverse Conceptualization",
        icon: Calendar,
        content: "SWISS expanded the Swissverse concept to include immersive digital experiences that bridge virtual and physical realities, laying groundwork for the hyperfy revolution.",
        highlight: "Metaverse Architect",
        image: matrixImage,
        gradient: "from-green-500 to-cyan-500"
      },
      {
        id: "community-building",
        month: "Late 2022",
        title: "Community Formation",
        icon: Users,
        content: "The first Swissverse community began to form, bringing together creators, developers, and visionaries who shared the dream of decentralized digital experiences.",
        highlight: "Community Builder",
        image: communityImage,
        gradient: "from-emerald-500 to-green-500"
      }
    ]
  },
  {
    year: 2023,
    title: "hyperfy Revolution",
    moments: [
      {
        id: "hyperfy-launch",
        month: "Early 2023",
        title: "hyperfy Era Begins",
        icon: Coins,
        content: "2023 ushered in the hyperfy era. SWISS pioneered new approaches to decentralized experiences, creating innovative protocols that make Web3 accessible to everyone.",
        highlight: "hyperfy Pioneer",
        gradient: "from-orange-500 to-pink-500"
      },
      {
        id: "hyperfy-evolution",
        month: "Mid 2023",
        title: "Platform Evolution",
        icon: Mountain,
        content: "The hyperfy platform evolved to include advanced features for creators and builders, establishing SWISS as a leading figure in the metaverse revolution.",
        highlight: "Platform Leader",
        gradient: "from-red-500 to-orange-500"
      }
    ]
  }
];

export const SwissverseTimeline = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-white uppercase">SWISSVERSE</span>{" "}
          <span className="text-gradient">Story</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Journey through the evolution of <span className="text-white uppercase font-semibold">SWISS</span> and discover the vision that drives the Swissverse forward
        </p>
      </div>

      {/* Vertical Timeline */}
      <div className="relative">
        {/* Central Timeline Line - stops before the "To be continued" section */}
        <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 via-green-500 to-orange-500 transform -translate-x-1/2 rounded-full" style={{ height: 'calc(100% - 120px)' }} />

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
                {yearData.moments.map((moment, momentIndex) => (
                  <div
                    key={moment.id}
                    className="flex items-center justify-center"
                  >
                    {/* Content Card - Always start left, then alternate */}
                    <div className={`relative w-full max-w-lg md:max-w-md ${
                      momentIndex % 2 === 0 
                        ? "md:mr-8 md:ml-0" 
                        : "md:ml-8 md:mr-0 md:ml-auto"
                    }`}>
                      <Card className="card-glow overflow-hidden animate-fade-in">
                        {/* Optional Image - extends to edges with straight bottom */}
                        {moment.image && (
                          <div className="relative -m-6 mb-0 mx-[-1.5rem] mt-[-1.5rem]">
                            <img
                              src={moment.image}
                              alt={moment.title}
                              className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                            <div className="absolute bottom-3 left-6">
                              <div className="text-sm font-medium text-white">{moment.month}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className={`p-6 ${moment.image ? 'pt-4' : ''}`}>
                          <div className="flex items-start gap-4 mb-4">
                            <div className={`p-3 rounded-full bg-gradient-to-br ${moment.gradient} animate-scale-in`}>
                              <moment.icon size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-xl font-bold">{moment.title}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {moment.highlight}
                                </Badge>
                              </div>
                              {!moment.image && (
                                <p className="text-sm text-muted-foreground mb-2">{moment.month}</p>
                              )}
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {moment.content}
                          </p>
                        </div>
                      </Card>

                      {/* Timeline Connector - Fixed positioning */}
                      <div className={`absolute top-8 ${
                        momentIndex % 2 === 0 
                          ? "md:-right-6 -right-4" 
                          : "md:-left-6 -left-4"
                      } flex items-center`}>
                        <div className={`${
                          momentIndex % 2 === 0 
                            ? "md:order-2 order-2" 
                            : "md:order-1 order-1"
                        } w-4 h-4 rounded-full bg-gradient-to-br ${moment.gradient} border-4 border-background`} />
                        <div className={`${
                          momentIndex % 2 === 0 
                            ? "md:order-1 order-1 md:w-6 w-4" 
                            : "md:order-2 order-2 md:w-6 w-4"
                        } h-0.5 bg-gradient-to-r ${moment.gradient}`} />
                      </div>
                    </div>
                  </div>
                ))}
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
    </section>
  );
};