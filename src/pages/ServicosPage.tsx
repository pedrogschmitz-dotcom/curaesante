import Header from "@/components/Header";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ServicosPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <Services />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ServicosPage;
