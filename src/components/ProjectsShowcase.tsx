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
    id: "hyperfy",
    name: "Hyperfy",
    category: "Metaverse",
    description: "Immersive 3D metaverse platform where users can build, create, and interact in virtual worlds with seamless VR/AR integration.",
    features: ["3D World Building", "VR/AR Ready", "Real-time Collaboration", "Virtual Economy"],
    status: "Live",
    url: "https://world.swissverse.org",
    icon: Globe,
    gradient: "from-blue-500 to-purple-500"
  },
  {
    id: "decentraland",
    name: "Decentraland",
    category: "Metaverse",
    description: "Virtual social world owned by its users. Create, explore, and trade in the first-ever virtual world owned by its users.",
    features: ["User Ownership", "Virtual Land", "NFT Integration", "Social Hub"],
    status: "Live",
    url: "https://decentraland.org/",
    icon: Globe,
    gradient: "from-green-500 to-cyan-500"
  }
];

export const ProjectsShowcase = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

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
          Metaverse Projects
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover the innovative projects building the future of Web3, DeFi, and the metaverse
        </p>
      </div>


      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
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