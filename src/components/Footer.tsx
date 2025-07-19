import { Button } from "@/components/ui/button";
import { Globe, Twitter, Github, Mail, Heart } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    { icon: Twitter, url: "https://twitter.com/swissverse", label: "Twitter" },
    { icon: Github, url: "https://github.com/swissverse", label: "GitHub" },
    { icon: Globe, url: "https://swissverse.org", label: "Website" },
    { icon: Mail, url: "mailto:hello@swissverse.org", label: "Email" },
  ];

  const footerLinks = [
    {
      title: "Projects",
      links: [
        { name: "HyperFi", url: "https://hyperfi.swiss" },
        { name: "Central Hub", url: "https://central.swiss" },
        { name: "NFT Studio", url: "#" },
        { name: "Metaverse", url: "https://world.swissverse.org" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Tools", url: "#resources" },
        { name: "Documentation", url: "#" },
        { name: "Community", url: "#" },
        { name: "Blog", url: "#" },
      ]
    },
    {
      title: "Web3",
      links: [
        { name: "DeFi", url: "#" },
        { name: "NFTs", url: "#" },
        { name: "Metaverse", url: "#" },
        { name: "Decentralization", url: "#" },
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
          <h3 className="text-3xl md:text-5xl font-bold mb-6 text-gradient">
            Ready to Enter the Swissverse?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Swiss on the journey to build the future of Web3, DeFi, and the metaverse
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cyber" size="xl">
              <Globe className="mr-2" />
              Visit Metaverse
            </Button>
            <Button variant="glow" size="xl">
              Join Community
            </Button>
          </div>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full card-glow flex items-center justify-center text-2xl font-bold text-gradient">
                SV
              </div>
              <span className="text-xl font-bold">Swissverse</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Building the future of Web3, DeFi, and the metaverse with innovation, 
              security, and true decentralization.
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
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            © 2024 Swissverse. Built with{" "}
            <Heart size={14} className="inline text-red-500 mx-1" />
            for the decentralized future.
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <button className="hover:text-primary transition-colors">Privacy</button>
            <button className="hover:text-primary transition-colors">Terms</button>
            <button className="hover:text-primary transition-colors">Security</button>
          </div>
        </div>
      </div>
    </footer>
  );
};