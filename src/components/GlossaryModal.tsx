import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  related_terms: string[] | null;
  term_slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  display_order: number;
}

export const GlossaryModal = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [term, setTerm] = useState<GlossaryTerm | null>(null);
  const [allTerms, setAllTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);

  // Check if opened as modal (has background location) or direct page
  const isModal = location.state?.backgroundLocation;

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      // Fetch all terms for related terms lookup
      const { data: allTermsData, error: allTermsError } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (allTermsError) {
        console.error('Error fetching all terms:', allTermsError);
        navigate('/glossary');
        return;
      }

      setAllTerms(allTermsData || []);

      // Find the specific term
      const termData = allTermsData?.find(t => t.term_slug === slug);
      
      if (!termData) {
        console.error('Term not found:', slug);
        navigate('/glossary');
        return;
      }

      setTerm(termData);
      setLoading(false);
    };

    fetchData();
  }, [slug, navigate]);

  // Update SEO metadata for full page views
  useEffect(() => {
    if (!isModal && term) {
      const title = term.meta_title || `${term.term} - SWISSVERSE Glossary`;
      const description = term.meta_description || term.definition;
      
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
    }
  }, [term, isModal]);

  const handleClose = () => {
    if (isModal && location.state?.backgroundLocation) {
      // Navigate back to the background location (glossary)
      navigate(location.state.backgroundLocation.pathname + location.state.backgroundLocation.search, { 
        replace: true 
      });
    } else {
      // For direct access, go to glossary page
      navigate('/glossary', { replace: true });
    }
  };

  const handleRelatedTermClick = (relatedTerm: GlossaryTerm) => {
    if (relatedTerm.term_slug) {
      if (isModal) {
        // Stay in modal mode
        navigate(`/glossary/${relatedTerm.term_slug}`, {
          state: { backgroundLocation: location.state?.backgroundLocation }
        });
      } else {
        // Direct navigation
        navigate(`/glossary/${relatedTerm.term_slug}`);
      }
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      blockchain: "from-orange-500 to-red-500",
      metaverse: "from-purple-500 to-pink-500",
      technical: "from-blue-500 to-cyan-500",
      platforms: "from-green-500 to-emerald-500",
      general: "from-gray-500 to-slate-500",
      identity: "from-violet-500 to-purple-500",
      infrastructure: "from-cyan-500 to-blue-500",
      finance: "from-green-500 to-yellow-500",
      gaming: "from-pink-500 to-red-500",
      ai: "from-indigo-500 to-purple-500"
    };
    return gradients[category] || gradients.general;
  };

  const TermContent = () => (
    <div className="space-y-6">
      <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold text-primary">
              {term?.term}
            </CardTitle>
            <Badge 
              variant="outline" 
              className={`bg-gradient-to-r ${getCategoryGradient(term?.category || '')} text-white border-0`}
            >
              {term?.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-loose text-foreground mb-6">
            {term?.definition}
          </p>
          
          {term?.related_terms && term.related_terms.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {term.related_terms.map((relatedSlug, index) => {
                  const relatedTerm = allTerms.find(t => t.term_slug === relatedSlug);
                  return relatedTerm ? (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleRelatedTermClick(relatedTerm)}
                      className="text-primary hover:bg-primary/10"
                    >
                      {relatedTerm.term}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between items-center pt-6 border-t border-border">
        <Button onClick={handleClose} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Glossary
        </Button>
        
        <Button onClick={() => window.open(`/glossary/${slug}`, '_blank')} variant="ghost">
          <ExternalLink className="w-4 h-4 mr-2" />
          {isModal ? 'Open in New Tab' : 'Share Term'}
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

  if (!term) {
    return null;
  }

  // Render as modal if opened from glossary
  if (isModal) {
    return (
      <Dialog open={true} onOpenChange={(open) => !open && handleClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">{term.term}</DialogTitle>
          </DialogHeader>
          <TermContent />
        </DialogContent>
      </Dialog>
    );
  }

  // Render as full page if accessed directly
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <TermContent />
      </div>
    </div>
  );
};