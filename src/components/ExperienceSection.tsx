import Section from "@/components/Section";
import { useExperience } from "@/hooks/usePortfolioData";
import { Briefcase } from "lucide-react";

const ExperienceSection = () => {
  const { data: experienceData, isLoading } = useExperience();

  if (isLoading || !experienceData) return null;

  return (
    <Section id="experience" title="Experience">
      <div className="space-y-8">
        {experienceData.map((exp) => (
          <div key={exp.id} className="neon-card rounded-lg p-6 group">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
                  <Briefcase size={14} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{exp.role}</h3>
                  <p className="text-sm text-primary">{exp.company}</p>
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground sm:text-right">{exp.dates}</span>
            </div>
            <ul className="space-y-2 ml-11">
              {exp.highlights.map((h, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/40 group-hover:bg-primary/80 transition-colors" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
};

export default ExperienceSection;
