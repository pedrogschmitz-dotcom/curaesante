import { useState } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Mail,
  Send,
  Instagram,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: "Mensagem enviada!",
      description:
        "Entraremos em contato em breve. Obrigado pelo seu interesse!",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Endereço",
      content: "Av. Delamar Jose da Silva 186, loja 03",
      subtitle: "Kobrasol, São José/SC - CEP: 88102-100",
      link: "https://maps.google.com/?q=Av.+Delamar+Jose+da+Silva+186,+loja+03,+Kobrasol,+São+José,+SC",
    },
    {
      icon: Phone,
      title: "WhatsApp",
      content: "+55 48 8806-4337",
      subtitle: "Clique para iniciar conversa",
      link: "https://wa.me/5548988064337",
    },
    {
      icon: Clock,
      title: "Horário",
      content: "Segunda a Sexta",
      subtitle: "9h às 18h",
    },
    {
      icon: Instagram,
      title: "Instagram",
      content: "@CuraeSante",
      subtitle: "Siga-nos para novidades",
      link: "https://instagram.com/CuraeSante",
    },
  ];

  return (
    <section id="contato" className="section-padding bg-background">
      <div className="container-content px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-block px-4 py-2 bg-gold/10 rounded-full text-sm font-medium text-gold-dark">
            Contato
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground">
            Entre em <span className="text-gold italic">contato</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Agende sua consulta ou tire suas dúvidas. Estamos prontos para
            atendê-lo.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Info & Map */}
          <div className="space-y-8">
            {/* Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((info) => (
                <a
                  key={info.title}
                  href={info.link || "#"}
                  target={info.link ? "_blank" : undefined}
                  rel={info.link ? "noopener noreferrer" : undefined}
                  className={`card-elegant group ${
                    info.link ? "hover-lift cursor-pointer" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                      <info.icon className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground mb-1">
                        {info.title}
                      </h3>
                      <p className="text-sm text-foreground/80">
                        {info.content}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {info.subtitle}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Map */}
            <div className="card-elegant p-0 overflow-hidden h-[300px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3535.8!2d-48.6!3d-27.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM2JzAwLjAiUyA0OMKwMzYnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Curae Santé"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://wa.me/5548988064337"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Phone size={18} />
                WhatsApp
              </a>
              <a
                href="https://maps.google.com/?q=Av.+Delamar+Jose+da+Silva+186,+loja+03,+Kobrasol,+São+José,+SC"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline flex-1 flex items-center justify-center gap-2"
              >
                <MapPin size={18} />
                Ver no Mapa
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card-elegant">
            <div className="space-y-2 mb-6">
              <h3 className="font-display text-2xl font-semibold text-foreground">
                Envie uma mensagem
              </h3>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo e entraremos em contato.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-foreground"
                >
                  Nome completo
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="bg-background border-border focus:border-gold focus:ring-gold/20"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-foreground"
                  >
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="bg-background border-border focus:border-gold focus:ring-gold/20"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium text-foreground"
                  >
                    Telefone
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(48) 99999-9999"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                    className="bg-background border-border focus:border-gold focus:ring-gold/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  placeholder="Como podemos ajudar você?"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  rows={4}
                  className="bg-background border-border focus:border-gold focus:ring-gold/20 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
