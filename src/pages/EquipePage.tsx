import Header from "@/components/Header";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const EquipePage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <Team />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default EquipePage;
