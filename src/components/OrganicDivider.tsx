type OrganicDividerProps = {
  flip?: boolean;
  className?: string;
};

const OrganicDivider = ({ flip = false, className = "" }: OrganicDividerProps) => {
  return (
    <div className={`relative h-14 md:h-20 overflow-hidden pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className={`w-full h-full ${flip ? "rotate-180" : ""}`}
      >
        <path
          d="M0,96 C220,160 420,16 640,64 C840,106 1010,172 1200,120 C1320,88 1400,52 1440,40 L1440,160 L0,160 Z"
          fill="hsl(var(--card))"
          fillOpacity="0.65"
        />
        <path
          d="M0,120 C250,164 420,40 680,84 C940,130 1160,146 1440,92 L1440,160 L0,160 Z"
          fill="hsl(var(--muted))"
          fillOpacity="0.5"
        />
      </svg>
    </div>
  );
};

export default OrganicDivider;
