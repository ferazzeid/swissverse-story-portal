import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  link_url?: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

interface SectionTitle {
  section_name: string;
  title: string;
  subtitle?: string;
}

export const ResourcesGrid = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [hoveredResource, setHoveredResource] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [sectionTitle, setSectionTitle] = useState<SectionTitle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch section title
        const { data: titleData } = await supabase
          .from('section_titles')
          .select('*')
          .eq('section_name', 'resources')
          .single();

        if (titleData) {
          setSectionTitle(titleData);
        }

        // Fetch resources
        const { data: resourcesData } = await supabase
          .from('resources')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (resourcesData) {
          setResources(resourcesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get unique categories from resources
  const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];
  
  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  const getCategoryGradient = (category: string) => {
    switch (category.toLowerCase()) {
      case "development": return "from-blue-500 to-cyan-500";
      case "assets": return "from-purple-500 to-pink-500";
      case "community": return "from-green-500 to-emerald-500";
      case "docs": return "from-orange-500 to-red-500";
      case "learning": return "from-yellow-500 to-orange-500";
      case "templates": return "from-indigo-500 to-purple-500";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const getIconComponent = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Box;
  };

  if (loading) {
    return (
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-96 mx-auto"></div>
            <div className="h-6 bg-muted rounded w-64 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          {sectionTitle?.title || 'Tools & Resources'}
        </h2>
        {sectionTitle?.subtitle && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {sectionTitle.subtitle}
          </p>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "cyber" : "glow"}
            onClick={() => setActiveCategory(category)}
            className="transition-all duration-300 capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource, index) => {
          const IconComponent = getIconComponent(resource.icon_name);
          
          return (
            <Card
              key={resource.id}
              className={`card-glow p-6 cursor-pointer transition-all duration-500 group ${
                hoveredResource === resource.id ? "scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredResource(resource.id)}
              onMouseLeave={() => setHoveredResource(null)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryGradient(resource.category)}`}>
                  <IconComponent size={24} className="text-white" />
                </div>
              </div>

              <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                {resource.title}
              </h3>

              <Badge variant="outline" className="mb-3 capitalize">
                {resource.category}
              </Badge>

              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {resource.description}
              </p>

              {resource.link_url && (
                <Button 
                  variant="glow" 
                  size="sm" 
                  className="w-full group"
                  onClick={() => window.open(resource.link_url!, "_blank")}
                >
                  Visit Tool
                  <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};