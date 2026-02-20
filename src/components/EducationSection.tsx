import Section from "@/components/Section";
import { useEducation } from "@/hooks/usePortfolioData";
import { GraduationCap } from "lucide-react";

const EducationSection = () => {
  const { data: educationData, isLoading } = useEducation();

  if (isLoading || !educationData) return null;

  return (
    <Section id="education" title="Education">
      <div className="relative ml-4 border-l border-primary/20 pl-8">
        {educationData.map((edu, i) => (
          <div key={edu.id} className="group relative mb-12 last:mb-0">
            <div className="absolute -left-[calc(2rem+6px)] top-1 flex h-3 w-3 items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-primary shadow-[var(--neon-glow)] group-hover:shadow-[var(--neon-glow-strong)] transition-shadow" />
              <div className="absolute h-6 w-6 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
            </div>

            <div className="neon-card rounded-lg p-5">
              <div className="flex items-start gap-3 mb-2">
                <GraduationCap size={16} className="mt-0.5 text-primary shrink-0" />
                <div>
                  <p className="font-mono text-xs text-primary mb-1">{edu.dates}</p>
                  <h3 className="text-lg font-semibold text-foreground">{edu.degree}</h3>
                  <p className="text-sm text-muted-foreground">{edu.school}</p>
                  {edu.notes && (
                    <p className="mt-2 text-sm text-muted-foreground/70 italic">{edu.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default EducationSection;
