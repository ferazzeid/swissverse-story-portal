import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-6xl md:text-8xl font-bold text-gradient">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/" 
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg font-medium transition-colors"
          >
            Return to Home
          </a>
          <a 
            href="/glossary" 
            className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-lg font-medium transition-colors"
          >
            Explore Glossary
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
