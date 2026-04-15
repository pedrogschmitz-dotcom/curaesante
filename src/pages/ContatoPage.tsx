import Header from "@/components/Header";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const ContatoPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <Contact />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default ContatoPage;
