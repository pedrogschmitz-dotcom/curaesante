import Header from "@/components/Header";
import About from "@/components/About";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const SobrePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default SobrePage;
