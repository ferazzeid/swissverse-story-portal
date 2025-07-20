import { Button } from "@/components/ui/button";
import { Globe, Twitter, Mail, Heart, Instagram, Youtube } from "lucide-react";
import svLogo from "/lovable-uploads/39d7376b-c87b-4dbe-bac5-8d101bcef3a7.png";

export const Footer = () => {
  const socialLinks = [
    { icon: Twitter, url: "https://x.com/swissverse", label: "X" },
    { icon: Instagram, url: "https://www.instagram.com/swiss.verse/", label: "Instagram" },
    { icon: Youtube, url: "https://www.youtube.com/@SWISSVERSE", label: "YouTube" },
    { icon: Mail, url: "mailto:swiss@dcl.business", label: "Email" },
  ];

  const footerLinks = [
    {
      title: "Projects",
      links: [
        { name: "Hyperfy", url: "https://world.swissverse.org" },
        { name: "Decentraland", url: "https://decentraland.org/" },
      ]
    }
  ];

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
            <Button 
              variant="cyber" 
              size="xl"
              onClick={() => window.open("https://world.swissverse.org", "_blank")}
            >
              <Globe className="mr-2" />
              Visit Metaverse
            </Button>
            <Button 
              variant="glow" 
              size="xl"
              onClick={() => window.open("https://decentraland.org/", "_blank")}
            >
              Join DCL Community
            </Button>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={svLogo} 
                alt="SWISSVERSE Logo" 
                className="w-12 h-12 rounded-full"
              />
              <span className="text-xl font-bold">SWISSVERSE</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Pioneering the Metaverse
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <Button
                  key={index}
                  variant="glow"
                  size="icon"
                  onClick={() => window.open(social.url, "_blank")}
                  className="hover:scale-110 transition-transform"
                >
                  <social.icon size={18} />
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-4 text-primary">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => link.url !== "#" && window.open(link.url, "_blank")}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      disabled={link.url === "#"}
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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