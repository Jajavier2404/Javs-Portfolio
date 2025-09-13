import { Calendar, MapPin, Building } from 'lucide-react';

export const Experience = () => {
  const experiences = [
    {
      id: 1,
      type: 'work',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Solutions',
      location: 'Madrid, España',
      period: 'Enero 2022 - Presente',
      description: 'Liderazgo del equipo frontend, desarrollo de aplicaciones React complejas y optimización de rendimiento. Implementación de arquitecturas escalables y mentorización de desarrolladores junior.',
      achievements: [
        'Mejora del 40% en el rendimiento de la aplicación principal',
        'Implementación de design system utilizado por 5 equipos',
        'Mentorización de 3 desarrolladores junior'
      ]
    },
    {
      id: 2,
      type: 'work',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Barcelona, España',
      period: 'Marzo 2020 - Diciembre 2021',
      description: 'Desarrollo full stack de plataforma SaaS utilizando React, Node.js y MongoDB. Diseño e implementación de APIs RESTful y integración con servicios de terceros.',
      achievements: [
        'Desarrollo completo de MVP en 4 meses',
        'Integración con 8 APIs de terceros',
        'Crecimiento de usuarios del 200% en 6 meses'
      ]
    },
    {
      id: 3,
      type: 'work',
      title: 'Frontend Developer',
      company: 'Digital Agency Pro',
      location: 'Valencia, España',
      period: 'Junio 2019 - Febrero 2020',
      description: 'Desarrollo de sitios web responsivos y aplicaciones React para clientes corporativos. Colaboración estrecha con diseñadores UX/UI y optimización SEO.',
      achievements: [
        'Entrega de 12+ proyectos web exitosos',
        'Mejora promedio del 60% en métricas Core Web Vitals',
        'Implementación de workflow de CI/CD'
      ]
    },
    {
      id: 4,
      type: 'education',
      title: 'Ingeniería Informática',
      company: 'Universidad Politécnica de Madrid',
      location: 'Madrid, España',
      period: '2015 - 2019',
      description: 'Grado en Ingeniería Informática con especialización en Ingeniería de Software. Proyecto fin de carrera: Sistema de gestión de contenidos distribuido.',
      achievements: [
        'Graduado con Matrícula de Honor',
        'Proyecto fin de carrera calificado con 9.5/10',
        'Participación en programa Erasmus en Finlandia'
      ]
    }
  ];

  return (
    <section id="experiencia" className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mi <span className="text-gradient">Experiencia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Un recorrido por mi trayectoria profesional y académica en el mundo del desarrollo de software.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 md:transform md:-translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent via-accent to-transparent opacity-30"></div>

          {experiences.map((exp, index) => (
            <div 
              key={exp.id}
              className={`relative mb-12 fade-in-up ${
                index % 2 === 0 ? 'md:pr-1/2 md:text-right' : 'md:pl-1/2 md:ml-8'
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Timeline Dot */}
              <div className={`absolute w-4 h-4 bg-accent rounded-full shadow-glow ${
                index % 2 === 0 
                  ? 'left-6 md:right-0 md:left-auto md:-mr-2'
                  : 'left-6 md:left-0 md:-ml-2'
              }`}>
              </div>

              {/* Content Card */}
              <div className="ml-16 md:ml-0 card-portfolio">
                <div className="flex items-center gap-2 mb-3">
                  {exp.type === 'work' ? (
                    <Building size={20} className="text-accent" />
                  ) : (
                    <Calendar size={20} className="text-accent" />
                  )}
                  <span className="text-accent font-medium text-sm uppercase tracking-wider">
                    {exp.type === 'work' ? 'Experiencia Laboral' : 'Educación'}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-2">{exp.title}</h3>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 text-muted-foreground">
                  <span className="font-medium">{exp.company}</span>
                  <span className="hidden sm:block">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span className="text-sm">{exp.location}</span>
                  </div>
                  <span className="hidden sm:block">•</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span className="text-sm">{exp.period}</span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {exp.description}
                </p>

                {exp.achievements && exp.achievements.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 text-sm">Logros principales:</h4>
                    <ul className="space-y-1">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start">
                          <span className="text-accent mr-2 mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};