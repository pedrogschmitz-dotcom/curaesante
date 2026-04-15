import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Atendimento from "./pages/Atendimento";
import AtendimentoSaudePele from "./pages/AtendimentoSaudePele";
import AtendimentoEmagrecimento from "./pages/AtendimentoEmagrecimento";
import AtendimentoSaudeHormonal from "./pages/AtendimentoSaudeHormonal";
import Equipe from "./pages/Equipe";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/atendimento" element={<Atendimento />} />
              <Route path="/atendimento/saude-da-pele" element={<AtendimentoSaudePele />} />
              <Route path="/atendimento/emagrecimento-metabolico" element={<AtendimentoEmagrecimento />} />
              <Route path="/atendimento/saude-hormonal-feminina" element={<AtendimentoSaudeHormonal />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
