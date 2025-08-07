import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import { Glossary } from "./pages/Glossary";
import { StoryModal } from "./components/StoryModal";
import { GlossaryModal } from "./components/GlossaryModal";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="/glossary/:slug" element={<GlossaryModal />} />
        <Route path="/story/:slug" element={<StoryModal />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Modal routes - render on top when opened from main pages */}
      {backgroundLocation && (
        <Routes>
          <Route path="/story/:slug" element={<StoryModal />} />
          <Route path="/glossary/:slug" element={<GlossaryModal />} />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <a href="#main" className="skip-link">Skip to content</a>
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
