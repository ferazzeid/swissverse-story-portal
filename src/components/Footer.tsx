import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Globe, Twitter, Mail, Heart, Instagram, Youtube, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { icons } from 'lucide-react';
import svLogo from "/lovable-uploads/39d7376b-c87b-4dbe-bac5-8d101bcef3a7.png";

interface ConfigurableLink {
  id: string;
  link_key: string;
  title: string;
  url: string;
  icon_name: string;
  button_variant: string;
  button_size: string;
  is_active: boolean;
  display_order: number;
}

export const Footer = () => {
  const [links, setLinks] = useState<ConfigurableLink[]>([]);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('configurable_links')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
    }
  };

  const getLink = (linkKey: string) => {
    return links.find(link => link.link_key === linkKey);
  };

  const getIcon = (iconName: string) => {
    return icons[iconName as keyof typeof icons] || Globe;
  };

  const socialLinks = [
    getLink('footer_social_x'),
    getLink('footer_social_instagram'),
    getLink('footer_social_youtube'),
    getLink('footer_social_email')
  ].filter(Boolean);


  return (
    <footer className="relative py-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/90">
        <div className="absolute inset-0 opacity-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Call to Action Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white">
            Ready to Enter the SWISSVERSE?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Pioneering the Metaverse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              getLink('footer_visit_metaverse'),
              getLink('footer_join_dcl'),
              getLink('footer_glossary')
            ].filter(Boolean).map((link) => {
              if (!link) return null;
              const IconComponent = getIcon(link.icon_name);
              
              if (link.url.startsWith('/')) {
                // Internal link
                return (
                  <Link key={link.id} to={link.url}>
                    <Button 
                      variant={link.button_variant === 'outline' ? 'default' : link.button_variant as any} 
                      size={link.button_size as any}
                      className="text-white hover:text-white"
                    >
                      <IconComponent className="mr-2" />
                      {link.title}
                    </Button>
                  </Link>
                );
              } else {
                // External link
                return (
                  <Button 
                    key={link.id}
                    variant={link.button_variant as any} 
                    size={link.button_size as any}
                    onClick={() => window.open(link.url, "_blank")}
                  >
                    <IconComponent className="mr-2" />
                    {link.title}
                  </Button>
                );
              }
            })}
          </div>
        </div>

        {/* Footer Content - Centered Brand Section */}
        <div className="flex justify-center mb-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src={svLogo} 
                alt="SWISSVERSE Logo" 
                className="w-12 h-12"
              />
              <span className="text-xl font-bold">SWISSVERSE</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Pioneering the Metaverse
            </p>
            <div className="flex gap-3 justify-center">
              {socialLinks.map((social) => {
                if (!social) return null;
                const IconComponent = getIcon(social.icon_name);
                return (
                  <Button
                    key={social.id}
                    variant={social.button_variant as any}
                    size={social.button_size as any}
                    onClick={() => window.open(social.url, "_blank")}
                    className="hover:scale-110 transition-transform"
                  >
                    <IconComponent size={18} />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8 flex justify-center items-center">
          <div className="text-muted-foreground text-sm">
            © 2025 SWISSVERSE. Built with{" "}
            <Heart size={14} className="inline text-red-500 mx-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};