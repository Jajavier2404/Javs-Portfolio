import { ReactNode } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, title, children, className = "" }: SectionProps) => {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section id={id} className={`relative py-20 md:py-28 ${className}`}>
      {/* Section top line */}
      <div className="neon-line mb-0" />

      <div
        ref={ref}
        className={`container mx-auto px-6 pt-8 scroll-hidden ${isVisible ? "scroll-visible" : ""}`}
      >
        <h2 className="mb-12 font-mono text-sm font-medium uppercase tracking-widest text-primary flex items-center gap-3">
          <span className="inline-block w-8 h-px bg-primary/50" />
          {"// "}
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
};

export default Section;
