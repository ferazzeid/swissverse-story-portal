import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, Calendar, Eye, ThumbsUp } from "lucide-react";

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  viewCount?: string;
  likeCount?: string;
  duration?: string;
  url: string;
}

// Mock data - replace with actual YouTube API integration
const mockVideos: YouTubeVideo[] = [
  {
    id: "1",
    title: "Building the Future of Web3 in the Metaverse",
    description: "Explore how Swiss is revolutionizing the digital landscape through innovative Web3 solutions and metaverse development.",
    thumbnail: "/src/assets/timeline-matrix.jpg",
    publishedAt: "2024-01-15",
    viewCount: "12.5K",
    likeCount: "487",
    duration: "15:32",
    url: "https://youtube.com/watch?v=example1"
  },
  {
    id: "2", 
    title: "NFT Creation Workshop: From Concept to Market",
    description: "A comprehensive guide to creating, minting, and marketing NFTs in the current digital economy.",
    thumbnail: "/src/assets/timeline-circuit.jpg",
    publishedAt: "2024-01-10",
    viewCount: "8.7K",
    likeCount: "312",
    duration: "22:45",
    url: "https://youtube.com/watch?v=example2"
  },
  {
    id: "3",
    title: "Metaverse Community Building Strategies",
    description: "Learn effective techniques for growing and engaging communities in virtual worlds and metaverse platforms.",
    thumbnail: "/src/assets/timeline-community.jpg",
    publishedAt: "2024-01-05",
    viewCount: "15.2K",
    likeCount: "623",
    duration: "18:21",
    url: "https://youtube.com/watch?v=example3"
  },
  {
    id: "4",
    title: "Advanced Web3 Development Techniques",
    description: "Deep dive into cutting-edge development practices for building decentralized applications and smart contracts.",
    thumbnail: "/src/assets/timeline-laptop.jpg",
    publishedAt: "2023-12-28",
    viewCount: "9.8K",
    likeCount: "445",
    duration: "26:17",
    url: "https://youtube.com/watch?v=example4"
  },
  {
    id: "5",
    title: "The Evolution of Digital Assets",
    description: "Understanding the transformation of digital ownership and how blockchain technology is reshaping value creation.",
    thumbnail: "/src/assets/timeline-matrix.jpg",
    publishedAt: "2023-12-22",
    viewCount: "11.3K",
    likeCount: "534",
    duration: "20:08",
    url: "https://youtube.com/watch?v=example5"
  },
  {
    id: "6",
    title: "Hyperfy World Building Masterclass",
    description: "Step-by-step tutorial on creating immersive 3D experiences using Hyperfy's powerful world-building tools.",
    thumbnail: "/src/assets/timeline-circuit.jpg",
    publishedAt: "2023-12-15",
    viewCount: "7.4K",
    likeCount: "289",
    duration: "31:42",
    url: "https://youtube.com/watch?v=example6"
  }
];

export const YouTubeSection = () => {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [videos] = useState<YouTubeVideo[]>(mockVideos);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatViews = (views: string) => {
    return views;
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full floating"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Section Header */}
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
          Swiss Content Hub
        </h2>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Dive deep into Web3, NFTs, and metaverse development with our latest video content
        </p>
      </div>

      {/* Videos Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {videos.map((video, index) => (
          <Card
            key={video.id}
            className={`card-glow overflow-hidden cursor-pointer transition-all duration-500 group ${
              hoveredVideo === video.id ? "scale-105" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            onMouseEnter={() => setHoveredVideo(video.id)}
            onMouseLeave={() => setHoveredVideo(null)}
            onClick={() => window.open(video.url, '_blank')}
          >
            {/* Video Thumbnail */}
            <div className="relative overflow-hidden aspect-video">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                  <Play size={24} className="text-white ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Duration badge */}
              {video.duration && (
                <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              )}
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {video.description}
              </p>

              {/* Meta Information */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={12} />
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
                
                <div className="flex items-center gap-4">
                  {video.viewCount && (
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{formatViews(video.viewCount)}</span>
                    </div>
                  )}
                  
                  {video.likeCount && (
                    <div className="flex items-center gap-1">
                      <ThumbsUp size={12} />
                      <span>{video.likeCount}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Watch Button */}
              <Button 
                variant="glow" 
                size="sm" 
                className="w-full group"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(video.url, '_blank');
                }}
              >
                Watch Now
                <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Channel CTA */}
      <div className="text-center mt-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full card-glow mb-6">
          <Play size={20} className="text-primary" />
          <span className="text-lg">Subscribe for weekly Web3 content</span>
        </div>
        
        <Button 
          variant="cyber" 
          size="lg"
          onClick={() => window.open('https://youtube.com/@swissverse', '_blank')}
          className="group"
        >
          Visit YouTube Channel
          <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Gradient borders */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-cyan-500 to-purple-500" />
    </section>
  );
};