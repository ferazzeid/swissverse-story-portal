import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, ExternalLink, Calendar, Eye, ThumbsUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  display_order: number;
  is_active: boolean;
}

interface SectionTitle {
  section_name: string;
  title: string;
  subtitle?: string;
}

export const YouTubeSection = () => {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [sectionTitle, setSectionTitle] = useState<SectionTitle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch section title
        const { data: titleData } = await supabase
          .from('section_titles')
          .select('*')
          .eq('section_name', 'youtube')
          .single();

        if (titleData) {
          setSectionTitle(titleData);
        }

        // Fetch videos
        const { data: videosData } = await supabase
          .from('youtube_videos')
          .select('*')
          .eq('is_active', true)
          .order('display_order')
          .limit(6);

        if (videosData) {
          setVideos(videosData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
          {sectionTitle?.title || 'YouTube'}
        </h2>
        {sectionTitle?.subtitle && (
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {sectionTitle.subtitle}
          </p>
        )}
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
            onClick={() => window.open(getYouTubeUrl(video.video_id), '_blank')}
          >
            {/* Video Thumbnail */}
            <div className="relative overflow-hidden aspect-video">
              <img
                src={video.thumbnail_url || getYouTubeThumbnail(video.video_id)}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Play button - visible by default with animation on hover */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/80 backdrop-blur-sm rounded-full p-4 transform transition-all duration-300 hover:bg-primary hover:scale-110">
                  <Play size={24} className="text-white ml-1" fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              
              {video.description && (
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {video.description}
                </p>
              )}

              {/* Watch Button */}
              <Button 
                variant="glow" 
                size="sm" 
                className="w-full group"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(getYouTubeUrl(video.video_id), '_blank');
                }}
              >
                Watch Now
                <ExternalLink size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Channel CTA - Updated without "Subscribe for weekly Web3 content" */}
      <div className="text-center mt-16 relative z-10">
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