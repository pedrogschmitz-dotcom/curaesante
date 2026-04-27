import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { initAnalytics, trackEvent, trackPageView } from "@/lib/analytics";
import Index from "./pages/Index";
import SobrePage from "./pages/SobrePage";
import ServicosPage from "./pages/ServicosPage";
import EquipePage from "./pages/EquipePage";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContatoPage from "./pages/ContatoPage";
import FaqPage from "./pages/FaqPage";
import MetabolismoFemininoPage from "./pages/MetabolismoFemininoPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();

    const { protocol, hostname, href } = window.location;
    const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
    if (!isLocal && protocol === "http:") {
      window.location.replace(href.replace(/^http:/, "https:"));
    }
  }, []);

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const anchor = target?.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const sectionId =
        anchor.getAttribute("data-wa-location") ||
        anchor.closest("section")?.id ||
        anchor.closest("[id]")?.id ||
        location.pathname;

      trackEvent("whatsapp_click_auto", {
        location: sectionId,
        href: anchor.href,
        path: location.pathname,
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [location.pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AnalyticsTracker />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/servicos" element={<ServicosPage />} />
          <Route path="/equipe" element={<EquipePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/metabolismo-feminino" element={<MetabolismoFemininoPage />} />
          <Route path="/contato" element={<ContatoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
