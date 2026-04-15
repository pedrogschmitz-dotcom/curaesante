import Header from "@/components/Header";
import InstagramFeed from "@/components/InstagramFeed";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const BlogPage = () => {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <InstagramFeed />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
};

export default BlogPage;
