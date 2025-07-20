import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Coins, Network, Shield } from "lucide-react";

interface StoryChapter {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  content: string;
  highlight: string;
  gradient: string;
}

const storyChapters: StoryChapter[] = [
  {
    id: "origins",
    title: "The Genesis of Swiss",
    icon: Bot,
    content: "Born in the digital realm, Swiss emerged as a visionary character dedicated to bridging the gap between traditional systems and the revolutionary world of Web3. With a passion for innovation and decentralization, Swiss began the journey to create the Swissverse.",
    highlight: "Digital Native Pioneer",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "vision",
    title: "The Metaverse Vision",
    icon: Network,
    content: "Swiss envisioned a interconnected metaverse where creativity, technology, and community converge. A space where NFTs aren't just collectibles, but functional assets that empower creators and build sustainable digital economies.",
    highlight: "Metaverse Architect",
    gradient: "from-cyan-500 to-purple-500"
  },
  {
    id: "hyperfi",
    title: "HyperFi Revolution",
    icon: Coins,
    content: "Through HyperFi, Swiss pioneered new financial instruments in the DeFi space, creating yield-generating protocols that make decentralized finance accessible to everyone. Innovation meets simplicity in the Swiss approach to DeFi.",
    highlight: "DeFi Innovator",
    gradient: "from-green-500 to-cyan-500"
  },
  {
    id: "decentralization",
    title: "Decentralization Mission",
    icon: Shield,
    content: "Swiss believes in true decentralization - not just in technology, but in governance, ownership, and creative control. The Swissverse represents a new paradigm where users have real ownership of their digital assets and experiences.",
    highlight: "Decentralization Advocate",
    gradient: "from-orange-500 to-pink-500"
  }
];

export const StorySection = () => {
  const [activeChapter, setActiveChapter] = useState(storyChapters[0].id);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          The Swiss Story
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Journey through the evolution of Swiss and discover the vision that drives the Swissverse forward
        </p>
      </div>

      {/* Chapter Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {storyChapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => setActiveChapter(chapter.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              activeChapter === chapter.id
                ? "card-glow text-primary border-primary"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <chapter.icon size={20} />
            <span className="hidden sm:inline">{chapter.title}</span>
          </button>
        ))}
      </div>

      {/* Active Chapter Display */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {storyChapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`transition-all duration-500 ${
              activeChapter === chapter.id
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8 absolute"
            }`}
          >
            {activeChapter === chapter.id && (
              <Card className="card-glow p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${chapter.gradient}`}>
                    <chapter.icon size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{chapter.title}</h3>
                    <Badge variant="outline" className="mt-2">
                      {chapter.highlight}
                    </Badge>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {chapter.content}
                </p>
              </Card>
            )}
          </div>
        ))}

        {/* Visual Element */}
        <div className="relative">
          <div className="w-full h-64 md:h-80 rounded-2xl card-glow flex items-center justify-center overflow-hidden">
            <div className="text-8xl md:text-9xl font-bold text-gradient opacity-20 floating">
              SV
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center floating">
            <Bot size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center floating" style={{ animationDelay: "1s" }}>
            <Network size={24} className="text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};

// NFT Story Section Component
const nftStoryChapters: StoryChapter[] = [
  {
    id: "nft-boom",
    title: "The 2021 NFT Explosion",
    icon: Coins,
    content: "In 2021, NFTs emerged as one of the most sought-after digital assets, transforming how we think about ownership, creativity, and value in the digital realm. What started as simple collectibles evolved into a revolutionary technology enabling true digital ownership.",
    highlight: "Digital Revolution",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "utility-evolution",
    title: "Beyond Collectibles",
    icon: Network,
    content: "Swiss recognized early that NFTs would transcend simple collectibles. The vision was to create functional digital assets that provide real utility - access passes, governance tokens, and programmable rights that work across multiple platforms and metaverses.",
    highlight: "Utility Pioneer",
    gradient: "from-cyan-500 to-purple-500"
  },
  {
    id: "creator-economy",
    title: "Empowering Creators",
    icon: Bot,
    content: "NFTs revolutionized the creator economy by enabling artists, developers, and innovators to monetize their work directly, without intermediaries. This shift created new opportunities for sustainable digital businesses and creative expression.",
    highlight: "Creator Empowerment",
    gradient: "from-green-500 to-cyan-500"
  }
];

export const NFTStorySection = () => {
  const [activeChapter, setActiveChapter] = useState(nftStoryChapters[0].id);

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          NFT Story
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Understanding why NFTs became the most sought-after digital assets of 2021 and beyond
        </p>
      </div>

      {/* Chapter Navigation */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {nftStoryChapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => setActiveChapter(chapter.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
              activeChapter === chapter.id
                ? "card-glow text-primary border-primary"
                : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <chapter.icon size={20} />
            <span className="hidden sm:inline">{chapter.title}</span>
          </button>
        ))}
      </div>

      {/* Active Chapter Display */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {nftStoryChapters.map((chapter) => (
          <div
            key={chapter.id}
            className={`transition-all duration-500 ${
              activeChapter === chapter.id
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8 absolute"
            }`}
          >
            {activeChapter === chapter.id && (
              <Card className="card-glow p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-full bg-gradient-to-br ${chapter.gradient}`}>
                    <chapter.icon size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{chapter.title}</h3>
                    <Badge variant="outline" className="mt-2">
                      {chapter.highlight}
                    </Badge>
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {chapter.content}
                </p>
              </Card>
            )}
          </div>
        ))}

        {/* Visual Element */}
        <div className="relative">
          <div className="w-full h-64 md:h-80 rounded-2xl card-glow flex items-center justify-center overflow-hidden">
            <div className="text-8xl md:text-9xl font-bold text-gradient opacity-20 floating">
              NFT
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          </div>
          
          {/* Floating Icons */}
          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center floating">
            <Coins size={24} className="text-white" />
          </div>
          <div className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center floating" style={{ animationDelay: "1s" }}>
            <Network size={24} className="text-white" />
          </div>
        </div>
      </div>
    </section>
  );
};