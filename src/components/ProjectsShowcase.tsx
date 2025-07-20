import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
}

interface SectionTitle {
  section_name: string;
  title: string;
  subtitle?: string;
}

export const ProjectsShowcase = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sectionTitle, setSectionTitle] = useState<SectionTitle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch section title
        const { data: titleData } = await supabase
          .from('section_titles')
          .select('*')
          .eq('section_name', 'metaverse_gallery')
          .single();

        if (titleData) {
          setSectionTitle(titleData);
        }

        // Fetch projects
        const { data: projectsData } = await supabase
          .from('metaverse_projects')
          .select('*')
          .eq('is_active', true)
          .order('display_order');

        if (projectsData) {
          setProjects(projectsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          {sectionTitle?.title || 'METAVERSE Gallery'}
        </h2>
        {sectionTitle?.subtitle && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {sectionTitle.subtitle}
          </p>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {projects.map((project, index) => (
          <Card
            key={project.id}
            className={`card-glow overflow-hidden cursor-pointer transition-all duration-500 group ${
              hoveredProject === project.id ? "scale-105" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredProject(project.id)}
            onMouseLeave={() => setHoveredProject(null)}
          >
            {/* Project Image */}
            <div className="relative overflow-hidden aspect-video">
              <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Overlay content */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-4">
              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              <Button 
                variant="glow" 
                size="sm"
                className="w-full group"
                onClick={() => {
                  // You can add project URLs later in admin
                  console.log('Navigate to project:', project.title);
                }}
              >
                Explore
                <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};