import Index from "./pages/Index";
import BlogListPage from "./pages/BlogListPage";
import BlogPostPage from "./pages/BlogPostPage";
import ContatoPage from "./pages/ContatoPage";
import EquipePage from "./pages/EquipePage";
import FaqPage from "./pages/FaqPage";
import MetabolismoFemininoPage from "./pages/MetabolismoFemininoPage";
import NotFound from "./pages/NotFound";
import ServicosPage from "./pages/ServicosPage";
import SobrePage from "./pages/SobrePage";
import { Route, Routes } from "react-router-dom";

export default function App() {
  return (
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
  );
}

