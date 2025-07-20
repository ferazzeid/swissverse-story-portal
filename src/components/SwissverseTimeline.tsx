import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Rocket, Coins, Globe } from "lucide-react";

interface TimelineEvent {
  year: number;
  month: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string;
  highlight: string;
  gradient: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    year: 2020,
    month: "March",
    title: "The Genesis",
    icon: Rocket,
    content: "In March 2020, as the world faced unprecedented challenges, the vision for SWISSVERSE began to take shape. A digital native was born with the mission to bridge traditional systems and revolutionary Web3 technologies.",
    highlight: "Digital Birth",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    year: 2021,
    month: "Year",
    title: "Building the Foundation",
    icon: Globe,
    content: "2021 marked the year of laying groundwork for the metaverse vision. SWISS began developing the core concepts that would later define the Swissverse - a space where creativity, technology, and community converge.",
    highlight: "Foundation Year",
    gradient: "from-cyan-500 to-purple-500"
  },
  {
    year: 2022,
    month: "Year",
    title: "Metaverse Evolution",
    icon: Calendar,
    content: "The Swissverse vision evolved throughout 2022, focusing on creating interconnected digital experiences where NFTs become functional assets that empower creators and build sustainable digital economies.",
    highlight: "Metaverse Architect",
    gradient: "from-green-500 to-cyan-500"
  },
  {
    year: 2023,
    month: "Year",
    title: "hyperfy Revolution Begins",
    icon: Coins,
    content: "2023 ushered in the hyperfy era. SWISS pioneered new approaches to decentralized experiences, creating innovative protocols that make Web3 accessible to everyone. The hyperfy revolution was officially born.",
    highlight: "hyperfy Pioneer",
    gradient: "from-orange-500 to-pink-500"
  }
];

export const SwissverseTimeline = () => {
  const [activeEvent, setActiveEvent] = useState(timelineEvents[0].year);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          The Swissverse Story
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Journey through the evolution of SWISS and discover the vision that drives the Swissverse forward
        </p>
      </div>

      {/* Timeline Navigation */}
      <div className="relative mb-16">
        {/* Timeline Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-cyan-500 via-green-500 to-orange-500 transform -translate-y-1/2 rounded-full" />
        
        <div className="flex justify-between items-center relative">
          {timelineEvents.map((event, index) => (
            <button
              key={event.year}
              onClick={() => setActiveEvent(event.year)}
              className={`relative flex flex-col items-center group transition-all duration-500 ${
                activeEvent === event.year ? "scale-110" : "hover:scale-105"
              }`}
            >
              {/* Timeline Node */}
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeEvent === event.year
                    ? `bg-gradient-to-br ${event.gradient} card-glow shadow-2xl`
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <event.icon 
                  size={24} 
                  className={activeEvent === event.year ? "text-white" : "text-muted-foreground"} 
                />
              </div>
              
              {/* Year Label */}
              <div className="mt-4 text-center">
                <div className={`text-2xl font-bold transition-colors duration-300 ${
                  activeEvent === event.year ? "text-primary" : "text-muted-foreground"
                }`}>
                  {event.year}
                </div>
                <div className="text-sm text-muted-foreground">{event.month}</div>
              </div>

              {/* Breathing Animation */}
              {activeEvent === event.year && (
                <div 
                  className={`absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br ${event.gradient} opacity-30 animate-pulse`}
                  style={{
                    animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Active Event Display */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {timelineEvents.map((event) => (
          <div
            key={event.year}
            className={`transition-all duration-700 ease-out ${
              activeEvent === event.year
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-95 absolute pointer-events-none"
            }`}
          >
            {activeEvent === event.year && (
              <Card className="card-glow p-8 animate-fade-in">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${event.gradient} animate-scale-in`}>
                    <event.icon size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{event.title}</h3>
                    <Badge variant="outline" className="mt-2">
                      {event.highlight}
                    </Badge>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {event.content}
                </p>
              </Card>
            )}
          </div>
        ))}

        {/* Visual Element */}
        <div className="relative">
          <div className="w-full h-64 md:h-80 rounded-2xl card-glow flex items-center justify-center overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-cyan-500/10 to-orange-500/10 animate-pulse" />
            
            {/* Large Year Display */}
            <div className="text-8xl md:text-9xl font-bold text-gradient opacity-20 floating">
              {activeEvent}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          {/* Floating Timeline Elements */}
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center floating">
            <Calendar size={20} className="text-white" />
          </div>
          <div 
            className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-orange-500 flex items-center justify-center floating" 
            style={{ animationDelay: "1s" }}
          >
            <Rocket size={20} className="text-white" />
          </div>
          <div 
            className="absolute top-1/2 -right-8 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center floating" 
            style={{ animationDelay: "2s" }}
          >
            <Globe size={16} className="text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};