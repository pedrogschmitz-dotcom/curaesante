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
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { name, email, phone, message } = formData;
    const whatsappMessage = `Olá! Meu nome é ${name}.%0A%0AE-mail: ${email}%0ATelefone: ${phone}%0A%0AMensagem: ${message}`;
    const whatsappUrl = `https://wa.me/5548988064337?text=${encodeURIComponent(whatsappMessage.replace(/%0A/g, '\n'))}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Redirecionando para WhatsApp",
      description: "Complete o envio da mensagem no WhatsApp.",
    });

    setFormData({ name: "", email: "", phone: "", message: "" });
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
      icon: Mail,
      title: "E-mail",
      content: "curaesante@gmail.com",
      subtitle: "Envie sua mensagem",
      link: "mailto:curaesante@gmail.com",
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d883.9!2d-48.6195!3d-27.5935!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95274090e0c2c3c9%3A0x0!2sAv.+Delamar+Jos%C3%A9+da+Silva%2C+186+-+Kobrasol%2C+S%C3%A3o+Jos%C3%A9+-+SC%2C+88102-100!5e0!3m2!1spt-BR!2sbr!4v1702300000000"
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
            {/* Google Review Box */}
            <a
              href="https://share.google/4h86zACTNSXecFcGv"
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-8 p-4 bg-gold/10 border border-gold/20 rounded-xl hover:bg-gold/20 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center group-hover:bg-gold/30 transition-colors">
                    <svg className="w-5 h-5 text-gold" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">Conte para nós como foi sua experiência</span>
                    <span className="text-sm text-muted-foreground">Deixe sua avaliação aqui</span>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>

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
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Enviar pelo WhatsApp
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
