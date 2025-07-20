import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Zap, Palette, Box, Bot, Brain, Code } from "lucide-react";

interface Resource {
  id: string;
  name: string;
  category: "3D" | "AI" | "Development" | "Design";
  description: string;
  url: string;
  icon: React.ComponentType<any>;
  featured: boolean;
}

const resources: Resource[] = [
  {
    id: "blender",
    name: "Blender",
    category: "3D",
    description: "Open-source 3D creation suite for modeling, animation, and rendering",
    url: "https://www.blender.org/",
    icon: Box,
    featured: true
  },
  {
    id: "hunyuan",
    name: "Hunyuan 3D Model",
    category: "AI",
    description: "AI-powered 3D model generation for rapid prototyping",
    url: "https://3d-models.hunyuan.tencent.com/",
    icon: Bot,
    featured: true
  },
  {
    id: "meshcapade",
    name: "Meshcapade",
    category: "3D",
    description: "Advanced human body modeling and avatar creation platform",
    url: "https://meshcapade.com/",
    icon: Box,
    featured: false
  },
  {
    id: "trellis3d",
    name: "trellis3d",
    category: "AI",
    description: "AI-driven 3D scene generation and optimization tools",
    url: "https://trellis3d.net/",
    icon: Brain,
    featured: false
  },
  {
    id: "avatarsdk",
    name: "AvatarSDK",
    category: "AI",
    description: "Create realistic 3D avatars from photos using AI technology",
    url: "https://avatarsdk.com/",
    icon: Bot,
    featured: true
  },
  {
    id: "celebmaker",
    name: "CelebMaker AI",
    category: "AI",
    description: "Generate celebrity-style avatars and characters with AI",
    url: "https://celebmakerai.com/",
    icon: Palette,
    featured: false
  },
  {
    id: "threejs",
    name: "Three.js",
    category: "Development",
    description: "JavaScript 3D library for creating immersive web experiences",
    url: "https://threejs.org/",
    icon: Code,
    featured: true
  },
  {
    id: "react-three",
    name: "React Three Fiber",
    category: "Development",
    description: "React renderer for Three.js for declarative 3D development",
    url: "https://docs.pmnd.rs/react-three-fiber/getting-started/introduction",
    icon: Code,
    featured: false
  }
];

export const ResourcesGrid = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);

  const categories = ["All", "3D", "AI", "Development", "Design"];
  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const getCategoryGradient = (category: string) => {
    switch (category) {
      case "3D": return "from-blue-500 to-cyan-500";
      case "AI": return "from-purple-500 to-pink-500";
      case "Development": return "from-green-500 to-emerald-500";
      case "Design": return "from-orange-500 to-red-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Tools & Resources
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Curated collection of tools and platforms that power the Swissverse ecosystem
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

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => (
          <Card
            key={resource.id}
            className={`card-glow p-6 cursor-pointer transition-all duration-500 group ${
              hoveredResource === resource.id ? "scale-105" : ""
            } ${resource.featured ? "ring-2 ring-primary/50" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredResource(resource.id)}
            onMouseLeave={() => setHoveredResource(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryGradient(resource.category)}`}>
                <resource.icon size={24} className="text-white" />
              </div>
              {resource.featured && (
                <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500">
                  <Zap size={12} className="mr-1" />
                  Featured
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
              {resource.name}
            </h3>

            <Badge variant="outline" className="mb-3">
              {resource.category}
            </Badge>

            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              {resource.description}
            </p>

            <Button 
              variant="glow" 
              size="sm" 
              className="w-full group"
              onClick={() => window.open(resource.url, "_blank")}
            >
              Visit Tool
              <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Card>
        ))}
      </div>

    </section>
  );
};