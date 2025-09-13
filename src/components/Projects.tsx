import { ExternalLink, Github } from 'lucide-react';
import project1 from '@/assets/project-1.jpg';
import project2 from '@/assets/project-2.jpg';
import project3 from '@/assets/project-3.jpg';

export const Projects = () => {
  const projects = [
    {
      id: 1,
      title: "Dashboard Analytics",
      description: "Plataforma de análisis de datos con visualizaciones interactivas y reportes en tiempo real.",
      image: project1,
      technologies: ["React", "TypeScript", "D3.js", "Node.js"],
      github: "https://github.com",
      demo: "https://example.com"
    },
    {
      id: 2,
      title: "E-Commerce Mobile App",
      description: "Aplicación móvil de comercio electrónico con sistema de pagos integrado y gestión de inventario.",
      image: project2,
      technologies: ["React Native", "Express", "MongoDB", "Stripe"],
      github: "https://github.com",
      demo: "https://example.com"
    },
    {
      id: 3,
      title: "API Documentation Hub",
      description: "Plataforma para documentación de APIs con ejemplos interactivos y testing en vivo.",
      image: project3,
      technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel"],
      github: "https://github.com",
      demo: "https://example.com"
    }
  ];

  return (
    <section id="proyectos" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mis <span className="text-gradient">Proyectos</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Una selección de proyectos que demuestran mis habilidades en desarrollo 
            frontend, backend y diseño de experiencias de usuario.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`card-portfolio fade-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-xl mb-6">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
              </div>

              <h3 className="text-xl font-bold mb-3 text-foreground">
                {project.title}
              </h3>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech) => (
                  <span 
                    key={tech}
                    className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex space-x-4">
                <a 
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-muted-foreground hover:text-accent transition-colors duration-300"
                >
                  <Github size={18} />
                  <span>Código</span>
                </a>
                <a 
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-accent hover:text-accent/80 transition-colors duration-300"
                >
                  <ExternalLink size={18} />
                  <span>Ver más</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};