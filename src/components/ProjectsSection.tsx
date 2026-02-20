import Section from "@/components/Section";
import ProjectCard from "@/components/ProjectCard";
import { useProjects } from "@/hooks/usePortfolioData";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const ProjectsSection = () => {
  const { ref, isVisible } = useScrollReveal(0.05);
  const { data: projectsData, isLoading } = useProjects();

  if (isLoading || !projectsData) return null;

  return (
    <Section id="projects" title="Projects">
      <div
        ref={ref}
        className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children ${isVisible ? "scroll-visible" : ""}`}
      >
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
};

export default ProjectsSection;
