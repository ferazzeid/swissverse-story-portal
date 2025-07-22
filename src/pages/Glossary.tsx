import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/SEOHead";
import { Search, ArrowLeft, ExternalLink } from "lucide-react";

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

export const Glossary = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching glossary terms:', error);
        return;
      }

      setTerms(data || []);
      
      // If slug is provided, find and set the selected term
      if (slug) {
        const term = data?.find(t => t.term_slug === slug);
        if (term) {
          setSelectedTerm(term);
        } else {
          // Redirect to main glossary if term not found
          navigate('/glossary');
        }
      }
      
      setLoading(false);
    };

    fetchTerms();
  }, [slug, navigate]);

  // Update SEO when viewing individual terms
  useEffect(() => {
    if (selectedTerm) {
      const title = selectedTerm.meta_title || `${selectedTerm.term} - SWISSVERSE Glossary`;
      const description = selectedTerm.meta_description || selectedTerm.definition;
      
      document.title = title;
      
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
  }, [selectedTerm]);

  const categories = useMemo(() => {
    const cats = terms.reduce((acc, term) => {
      if (!acc.includes(term.category)) {
        acc.push(term.category);
      }
      return acc;
    }, [] as string[]);
    return cats.sort();
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [terms, searchQuery, selectedCategory]);

  const alphabeticalGroups = useMemo(() => {
    const groups: { [key: string]: GlossaryTerm[] } = {};
    filteredTerms.forEach(term => {
      const firstLetter = term.term[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const getCategoryGradient = (category: string) => {
    const gradients: { [key: string]: string } = {
      blockchain: "from-orange-500 to-red-500",
      metaverse: "from-purple-500 to-pink-500",
      technical: "from-blue-500 to-cyan-500",
      platforms: "from-green-500 to-emerald-500",
      general: "from-gray-500 to-slate-500"
    };
    return gradients[category] || gradients.general;
  };

  const handleTermClick = (term: GlossaryTerm) => {
    if (term.term_slug) {
      navigate(`/glossary/${term.term_slug}`);
      setSelectedTerm(term);
    }
  };

  const handleBackToGlossary = () => {
    navigate('/glossary');
    setSelectedTerm(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Individual term view
  if (selectedTerm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <Button onClick={handleBackToGlossary} variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Glossary
            </Button>
            
            <Card className="border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-3xl font-bold text-primary">
                    {selectedTerm.term}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`bg-gradient-to-r ${getCategoryGradient(selectedTerm.category)} text-white border-0`}
                  >
                    {selectedTerm.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-loose text-foreground mb-6">
                  {selectedTerm.definition}
                </p>
                
                {selectedTerm.related_terms && selectedTerm.related_terms.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Related Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.related_terms.map((relatedSlug, index) => {
                        const relatedTerm = terms.find(t => t.term_slug === relatedSlug);
                        return relatedTerm ? (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleTermClick(relatedTerm)}
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
          </div>
        </div>
      </div>
    );
  }

  // Main glossary view
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageName="glossary" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            SWISSVERSE Glossary
          </h1>
          <p className="text-lg text-muted-foreground">
            Your comprehensive guide to metaverse, blockchain, and Web3 terminology
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search terms or definitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Alphabetical Index */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.keys(alphabeticalGroups).sort().map(letter => (
              <Button
                key={letter}
                variant="outline"
                size="sm"
                onClick={() => {
                  const element = document.getElementById(`letter-${letter}`);
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-8 h-8 p-0"
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        {/* Terms Grid */}
        <div className="space-y-8">
          {Object.keys(alphabeticalGroups).sort().map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              <h2 className="text-2xl font-bold mb-4 text-primary">{letter}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alphabeticalGroups[letter].map(term => (
                  <Card 
                    key={term.id}
                    className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm"
                    onClick={() => handleTermClick(term)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-bold text-primary">
                          {term.term}
                        </CardTitle>
                        <Badge 
                          variant="outline" 
                          className={`bg-gradient-to-r ${getCategoryGradient(term.category)} text-white border-0`}
                        >
                          {term.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="line-clamp-3 text-foreground">
                        {term.definition}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No terms found matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};