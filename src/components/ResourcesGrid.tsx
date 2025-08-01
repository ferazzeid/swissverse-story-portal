import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import * as Icons from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { ResourceInlineEditor } from "@/components/resources/ResourceInlineEditor";
import { ResourceIconSelector } from "@/components/resources/ResourceIconSelector";
import { ResourceInsertIndicator } from "@/components/resources/ResourceInsertIndicator";

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
  const [showAll, setShowAll] = useState(false);
  const [displayLimit] = useState(9);
  const { isAdmin } = useAdminStatus();

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

  const handleResourceUpdate = (resourceId: string, field: string, newValue: string) => {
    setResources(prevResources => 
      prevResources.map(resource => 
        resource.id === resourceId 
          ? { ...resource, [field]: newValue }
          : resource
      )
    );
  };

  const handleResourceAdded = () => {
    // Refetch data when a new resource is added
    const fetchData = async () => {
      try {
        const { data: resourcesData } = await supabase
          .from('resources')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (resourcesData) {
          setResources(resourcesData);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };
    fetchData();
  };

  // Get unique categories from resources
  const categories = ["All", ...Array.from(new Set(resources.map(r => r.category)))];
  
  const filteredResources = activeCategory === "All" 
    ? resources 
    : resources.filter(resource => resource.category === activeCategory);

  // Determine which resources to display based on showAll state
  const displayedResources = showAll 
    ? filteredResources 
    : filteredResources.slice(0, displayLimit);

  const hasMore = filteredResources.length > displayLimit;

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
        <div className="flex items-center justify-center gap-3 mb-6">
          <h2 className="text-4xl md:text-6xl font-bold text-gradient">
            {sectionTitle?.title || 'Tools & Resources'}
          </h2>
          <Badge variant="outline" className="text-xs text-muted-foreground px-2 py-1">
            {resources.length} tools
          </Badge>
        </div>
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
            onClick={() => {
              setActiveCategory(category);
              setShowAll(false); // Reset to show limited items when category changes
            }}
            className="transition-all duration-300 capitalize"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isAdmin && (
          <div className="lg:col-span-3 md:col-span-2">
            <ResourceInsertIndicator
              displayOrder={0}
              onResourceAdded={handleResourceAdded}
            />
          </div>
        )}
        
        {displayedResources.map((resource, index) => {
          const IconComponent = getIconComponent(resource.icon_name);
          const nextDisplayOrder = index < displayedResources.length - 1 
            ? (resource.display_order + displayedResources[index + 1].display_order) / 2
            : resource.display_order + 10;
          
          return (
            <>
              <div key={resource.id} className="relative">
                <Card
                  className={`card-glow p-6 transition-all duration-500 group ${
                    hoveredResource === resource.id ? "scale-105" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onMouseEnter={() => setHoveredResource(resource.id)}
                  onMouseLeave={() => setHoveredResource(null)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${getCategoryGradient(resource.category)}`}>
                      {isAdmin ? (
                        <ResourceIconSelector
                          resourceId={resource.id}
                          currentIcon={resource.icon_name}
                          onUpdate={(newIcon) => handleResourceUpdate(resource.id, 'icon_name', newIcon)}
                        />
                      ) : (
                        <IconComponent size={24} className="text-white" />
                      )}
                    </div>
                  </div>

                  <div className="mb-2">
                    {isAdmin ? (
                      <ResourceInlineEditor
                        resourceId={resource.id}
                        field="title"
                        currentValue={resource.title}
                        onUpdate={(field, newValue) => handleResourceUpdate(resource.id, field, newValue)}
                        className="text-lg font-bold group-hover:text-primary transition-colors"
                      />
                    ) : (
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                        {resource.title}
                      </h3>
                    )}
                  </div>

                  <div className="mb-3">
                    {isAdmin ? (
                      <ResourceInlineEditor
                        resourceId={resource.id}
                        field="category"
                        currentValue={resource.category}
                        onUpdate={(field, newValue) => handleResourceUpdate(resource.id, field, newValue)}
                        className="capitalize"
                      />
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {resource.category}
                      </Badge>
                    )}
                  </div>

                  <div className="mb-6">
                    {isAdmin ? (
                      <ResourceInlineEditor
                        resourceId={resource.id}
                        field="description"
                        currentValue={resource.description}
                        onUpdate={(field, newValue) => handleResourceUpdate(resource.id, field, newValue)}
                        className="text-muted-foreground text-sm leading-relaxed"
                        multiline
                      />
                    ) : (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {resource.description}
                      </p>
                    )}
                  </div>

                  {resource.link_url && (
                    <div>
                      {isAdmin ? (
                        <ResourceInlineEditor
                          resourceId={resource.id}
                          field="link_url"
                          currentValue={resource.link_url}
                          onUpdate={(field, newValue) => handleResourceUpdate(resource.id, field, newValue)}
                          className="text-sm text-blue-500 hover:text-blue-600"
                        />
                      ) : (
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
                    </div>
                  )}
                </Card>
              </div>

              {isAdmin && (index + 1) % 3 === 0 && (
                <div className="lg:col-span-3 md:col-span-2">
                  <ResourceInsertIndicator
                    afterResourceId={resource.id}
                    displayOrder={nextDisplayOrder}
                    onResourceAdded={handleResourceAdded}
                  />
                </div>
              )}
            </>
          );
        })}
        
        {/* Insert indicator after the last resource if it's not at the end of a row */}
        {isAdmin && displayedResources.length % 3 !== 0 && displayedResources.length > 0 && (
          <div className="lg:col-span-3 md:col-span-2">
            <ResourceInsertIndicator
              afterResourceId={displayedResources[displayedResources.length - 1]?.id}
              displayOrder={displayedResources[displayedResources.length - 1]?.display_order + 10}
              onResourceAdded={handleResourceAdded}
            />
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!showAll && hasMore && (
        <div className="text-center mt-12">
          <Button 
            variant="cyber" 
            size="lg" 
            onClick={() => setShowAll(true)}
            className="px-8 py-3"
          >
            Load More Tools ({filteredResources.length - displayLimit} remaining)
          </Button>
        </div>
      )}
    </section>
  );
};