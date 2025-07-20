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
        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 via-green-500 to-orange-500 transform -translate-x-1/2 rounded-full" />

        <div className="space-y-24">
          {timelineData.map((yearData, yearIndex) => (
            <div key={yearData.year} className="relative">
              {/* Year Marker */}
              <div className="flex items-center justify-center mb-12">
                <div className="relative">
                  {/* Year Node */}
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 flex items-center justify-center card-glow shadow-2xl animate-pulse">
                    <div className="text-2xl font-bold text-white">
                      {yearData.year}
                    </div>
                  </div>
                  
                  {/* Year Title */}
                  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
                    <h3 className="text-xl font-bold text-gradient whitespace-nowrap">
                      {yearData.title}
                    </h3>
                  </div>

                  {/* Breathing Animation */}
                  <div className="absolute inset-0 w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-orange-500 opacity-30 animate-pulse" />
                </div>
              </div>

              {/* Year Moments */}
              <div className="space-y-16">
                {yearData.moments.map((moment, momentIndex) => (
                  <div
                    key={moment.id}
                    className={`flex items-center gap-8 ${
                      momentIndex % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    {/* Content Side */}
                    <div className="flex-1">
                      <Card className="card-glow p-6 animate-fade-in">
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
                            <p className="text-sm text-muted-foreground mb-2">{moment.month}</p>
                          </div>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {moment.content}
                        </p>
                      </Card>
                    </div>

                    {/* Timeline Connector */}
                    <div className="relative">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${moment.gradient} border-4 border-background`} />
                      <div className={`absolute top-1/2 ${
                        momentIndex % 2 === 0 ? "left-4" : "right-4"
                      } w-8 h-0.5 bg-gradient-to-r ${moment.gradient} transform -translate-y-1/2`} />
                    </div>

                    {/* Image Side */}
                    <div className="flex-1">
                      {moment.image && (
                        <div className="relative overflow-hidden rounded-xl card-glow">
                          <img
                            src={moment.image}
                            alt={moment.title}
                            className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                          <div className="absolute bottom-4 left-4">
                            <div className="text-sm font-medium text-white">{moment.month}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Future Indicator */}
        <div className="flex items-center justify-center mt-16">
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