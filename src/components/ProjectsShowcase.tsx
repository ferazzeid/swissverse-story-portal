import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Zap, Shield, Coins, Globe } from "lucide-react";

interface Project {
  id: string;
  name: string;
  category: "DeFi" | "NFT" | "Metaverse" | "Tools";
  description: string;
  features: string[];
  status: "Live" | "Beta" | "Coming Soon";
  url: string;
  icon: React.ComponentType<any>;
  gradient: string;
}

const projects: Project[] = [
  {
    id: "hyperfi",
    name: "HyperFi Protocol",
    category: "DeFi",
    description: "Revolutionary DeFi protocol offering high-yield farming and innovative liquidity solutions with Swiss-engineered security.",
    features: ["Auto-compounding", "Cross-chain", "DAO Governance", "Yield Optimization"],
    status: "Live",
    url: "https://hyperfi.swiss",
    icon: TrendingUp,
    gradient: "from-green-500 to-cyan-500"
  },
  {
    id: "central",
    name: "Central Hub",
    category: "Tools",
    description: "The central command center for managing all your Web3 assets, DeFi positions, and metaverse experiences in one place.",
    features: ["Portfolio Tracking", "Multi-chain Support", "Analytics", "DeFi Dashboard"],
    status: "Beta",
    url: "https://central.swiss",
    icon: Shield,
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "nft-studio",
    name: "Swiss NFT Studio",
    category: "NFT",
    description: "Create, mint, and trade NFTs with advanced utility features. Build functional digital assets that work across the metaverse.",
    features: ["AI Generation", "Utility Programming", "Cross-platform", "Royalty Management"],
    status: "Coming Soon",
    url: "#",
    icon: Coins,
    gradient: "from-orange-500 to-red-500"
  },
  {
    id: "metaverse",
    name: "Swissverse World",
    category: "Metaverse",
    description: "Immersive 3D metaverse experience where Swiss characters interact, build, and create in a fully decentralized virtual world.",
    features: ["VR/AR Ready", "NFT Integration", "Virtual Economy", "Social Features"],
    status: "Beta",
    url: "https://world.swissverse.org",
    icon: Globe,
    gradient: "from-blue-500 to-purple-500"
  }
];

export const ProjectsShowcase = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const categories = ["All", "DeFi", "NFT", "Metaverse", "Tools"];
  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Live": return "bg-green-500";
      case "Beta": return "bg-yellow-500";
      case "Coming Soon": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Swiss Projects
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the innovative projects building the future of Web3, DeFi, and the metaverse
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "cyber" : "glow"}
            onClick={() => setActiveCategory(category)}
            className="transition-all duration-300"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {filteredProjects.map((project, index) => (
          <Card
            key={project.id}
            className={`card-glow p-6 cursor-pointer transition-all duration-500 ${
              hoveredProject === project.id ? "scale-105" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${project.gradient}`}>
                  <project.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{project.name}</h3>
                  <Badge variant="outline" className="mt-1">
                    {project.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                <span className="text-sm text-muted-foreground">{project.status}</span>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.features.map((feature, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
            </div>

            {/* Action Button */}
            <Button 
              variant="glow" 
              className="w-full group"
              onClick={() => project.url !== "#" && window.open(project.url, "_blank")}
              disabled={project.url === "#"}
            >
              {project.url === "#" ? "Coming Soon" : "Explore Project"}
              {project.url !== "#" && (
                <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </Button>
          </Card>
        ))}
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full card-glow mb-6">
          <Zap size={20} className="text-primary" />
          <span className="text-lg">Ready to build with Swiss?</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cyber" size="lg">
            Join the Community
          </Button>
          <Button variant="glow" size="lg">
            Partner with Us
          </Button>
        </div>
      </div>
    </section>
  );
};