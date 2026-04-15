import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  title: string;
  subtitle: string;
  description: string;
  to: string;
}

const ServiceCard = ({ title, subtitle, description, to }: ServiceCardProps) => {
  return (
    <div className="card-elegant hover-lift group">
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-2xl font-semibold text-foreground mb-1">
            {title}
          </h3>
          <p className="text-sm text-accent">{subtitle}</p>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm">
          {description}
        </p>
        <Link
          to={to}
          className="inline-flex items-center gap-2 text-sm font-medium text-accent group-hover:gap-3 transition-all"
        >
          Saber mais
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;
