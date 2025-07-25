import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

interface Story {
  id: string;
  title: string;
  content: string;
  full_story: string;
  highlight: string;
  year: number;
  year_title: string;
  story_image_url?: string;
  created_at: string;
  gradient_class: string;
  meta_title?: string;
  meta_description?: string;
}

export const StoryModal = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if opened as modal (has background location) or direct page
  const isModal = location.state?.backgroundLocation;

  useEffect(() => {
    const fetchStory = async () => {
      if (!slug) return;
      
      const { data, error } = await supabase
        .from('timeline_content')
        .select('*')
        .eq('story_slug', slug)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching story:', error);
        navigate('/');
        return;
      }

      setStory(data);
      setLoading(false);
    };

    fetchStory();
  }, [slug, navigate]);

  // Update SEO metadata for full page views
  useEffect(() => {
    if (!isModal && story) {
      const title = story.meta_title || story.title;
      const description = story.meta_description || story.content;
      
      document.title = title;
      
      // Update meta description
      let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (metaDesc) {
        metaDesc.content = description;
      } else {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = description;
        document.head.appendChild(metaDesc);
      }
      
      // Update Open Graph metadata
      let ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement;
      if (ogTitle) {
        ogTitle.content = title;
      } else {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        ogTitle.content = title;
        document.head.appendChild(ogTitle);
      }
      
      let ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement;
      if (ogDesc) {
        ogDesc.content = description;
      } else {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        ogDesc.content = description;
        document.head.appendChild(ogDesc);
      }
      
      // Update image if available
      if (story.story_image_url) {
        let ogImage = document.querySelector('meta[property="og:image"]') as HTMLMetaElement;
        if (ogImage) {
          ogImage.content = story.story_image_url;
        } else {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          ogImage.content = story.story_image_url;
          document.head.appendChild(ogImage);
        }
      }
    }
  }, [story, isModal]);

  const handleClose = () => {
    if (isModal && location.state?.backgroundLocation) {
      // Navigate back to the background location (timeline)
      navigate(location.state.backgroundLocation.pathname + location.state.backgroundLocation.search, { 
        replace: true 
      });
    } else {
      // For direct access, go to home page
      navigate('/', { replace: true });
    }
  };

  const StoryContent = () => (
    <div className="space-y-6">
      {story?.story_image_url && (
        <img 
          src={story.story_image_url} 
          alt={story.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{story?.year}</span>
        </div>
        <Badge variant="outline">{story?.highlight}</Badge>
        <Badge variant="secondary">{story?.year_title}</Badge>
      </div>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-bold text-white mb-4">{story?.title}</h1>
        
        <div className="text-lg text-muted-foreground mb-6">
          {story?.content}
        </div>

        {story?.full_story && (
          <div 
            className="story-content text-foreground leading-loose text-base"
            dangerouslySetInnerHTML={{ __html: story.full_story }}
          />
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center pt-6 border-t border-border">
        <Button onClick={handleClose} variant="outline" className="w-full sm:w-auto">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Timeline
        </Button>
        
        <Button onClick={() => window.open(`/story/${slug}`, '_blank')} variant="ghost" className="w-full sm:w-auto">
          <ExternalLink className="w-4 h-4 mr-2" />
          {isModal ? 'Open in New Tab' : 'Share Story'}
        </Button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!story) {
    return null;
  }

  // Render as modal if opened from timeline
  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto mx-4 w-[calc(100vw-2rem)] md:w-full">
          <DialogHeader>
            <DialogTitle className="sr-only">{story.title}</DialogTitle>
          </DialogHeader>
          <StoryContent />
        </DialogContent>
      </Dialog>
    );
  }

  // Render as full page if accessed directly
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <StoryContent />
      </div>
    </div>
  );
};