import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/SEOHead";
import { GlossaryInlineEditor } from "@/components/glossary/GlossaryInlineEditor";
import { GlossaryInsertIndicator } from "@/components/glossary/GlossaryInsertIndicator";
import { useAdminStatus } from "@/hooks/useAdminStatus";
import { Search, ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

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
  const location = useLocation();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdminStatus();

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
      setLoading(false);
    };

    fetchTerms();
  }, []);

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
      general: "from-gray-500 to-slate-500",
      identity: "from-violet-500 to-purple-500",
      infrastructure: "from-cyan-500 to-blue-500",
      finance: "from-green-500 to-yellow-500",
      gaming: "from-pink-500 to-red-500",
      ai: "from-indigo-500 to-purple-500"
    };
    return gradients[category] || gradients.general;
  };

  const handleUpdateTerm = (termId: string, field: string, value: string) => {
    setTerms(prev => prev.map(term => 
      term.id === termId ? { ...term, [field]: value } : term
    ));
  };

  const { toast } = useToast();

  const handleDeleteTerm = async (termId: string) => {
    try {
      const { error } = await supabase
        .from('glossary_terms')
        .delete()
        .eq('id', termId);

      if (error) throw error;
      
      setTerms(prev => prev.filter(term => term.id !== termId));
      toast({
        title: "Success",
        description: "Term deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting term:', error);
      toast({
        title: "Error",
        description: "Failed to delete term",
        variant: "destructive",
      });
    }
  };

  const handleTermAdded = () => {
    // Refresh the terms list
    const fetchTerms = async () => {
      const { data, error } = await supabase
        .from('glossary_terms')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setTerms(data);
      }
    };
    fetchTerms();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Main glossary view
  return (
    <div className="min-h-screen bg-background">
      <SEOHead pageName="glossary" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="mb-4">
            <Link to="/" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-white uppercase">SWISSVERSE Glossary</span>
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
            <div key={letter} id={`letter-${letter}`} className="group">
              <h2 className="text-2xl font-bold mb-4 text-primary">{letter}</h2>
              {isAdmin && (
                <GlossaryInsertIndicator
                  afterDisplayOrder={-1}
                  onTermAdded={handleTermAdded}
                />
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {alphabeticalGroups[letter].map((term, index) => (
                  <div key={term.id} className="relative group/card">
                    <Link
                      to={`/glossary/${term.term_slug}`}
                      state={{ backgroundLocation: location }}
                      className="block"
                    >
                      <Card className="cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50 bg-card/50 backdrop-blur-sm">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-bold text-primary">
                              {isAdmin ? (
                                <GlossaryInlineEditor
                                  termId={term.id}
                                  field="term"
                                  currentValue={term.term}
                                  onUpdate={(field, value) => handleUpdateTerm(term.id, field, value)}
                                />
                              ) : (
                                term.term
                              )}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {isAdmin ? (
                                <GlossaryInlineEditor
                                  termId={term.id}
                                  field="category"
                                  currentValue={term.category}
                                  onUpdate={(field, value) => handleUpdateTerm(term.id, field, value)}
                                  className={`bg-gradient-to-r ${getCategoryGradient(term.category)} text-white border-0 px-2 py-1 rounded text-xs`}
                                />
                              ) : (
                                <Badge 
                                  variant="outline" 
                                  className={`bg-gradient-to-r ${getCategoryGradient(term.category)} text-white border-0`}
                                >
                                  {term.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="line-clamp-3 text-foreground">
                            {isAdmin ? (
                              <GlossaryInlineEditor
                                termId={term.id}
                                field="definition"
                                currentValue={term.definition}
                                onUpdate={(field, value) => handleUpdateTerm(term.id, field, value)}
                                multiline
                              />
                            ) : (
                              term.definition
                            )}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                    
                    {isAdmin && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            className="absolute -top-2 -right-2 opacity-0 group-hover/card:opacity-100 transition-opacity h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Term</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{term.term}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTerm(term.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                    
                    {isAdmin && index < alphabeticalGroups[letter].length - 1 && (
                      <GlossaryInsertIndicator
                        afterDisplayOrder={term.display_order}
                        onTermAdded={handleTermAdded}
                      />
                    )}
                  </div>
                ))}
              </div>
              {isAdmin && alphabeticalGroups[letter].length > 0 && (
                <GlossaryInsertIndicator
                  afterDisplayOrder={Math.max(...alphabeticalGroups[letter].map(t => t.display_order))}
                  onTermAdded={handleTermAdded}
                />
              )}
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