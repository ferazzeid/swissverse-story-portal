import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Glossary } from "./pages/Glossary";
import { StoryModal } from "./components/StoryModal";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/glossary/:slug" element={<Glossary />} />
        <Route path="/story/:slug" element={<StoryModal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Modal routes - render on top when opened from timeline */}
      {backgroundLocation && (
        <Routes>
          <Route path="/story/:slug" element={<StoryModal />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
