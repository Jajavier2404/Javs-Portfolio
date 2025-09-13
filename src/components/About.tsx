import { Code, Database, Globe, Palette } from 'lucide-react';
import profilePhoto from '@/assets/profile-photo.jpg';

export const About = () => {
  const skills = [
    {
      icon: <Code size={24} />,
      title: "Frontend Development",
      description: "React, TypeScript, Next.js, Tailwind CSS"
    },
    {
      icon: <Database size={24} />,
      title: "Backend Development", 
      description: "Node.js, Express, MongoDB, PostgreSQL"
    },
    {
      icon: <Globe size={24} />,
      title: "Full Stack",
      description: "APIs REST, GraphQL, Microservicios"
    },
    {
      icon: <Palette size={24} />,
      title: "UI/UX Design",
      description: "Figma, Diseño responsive, Prototipado"
    }
  ];

  const interests = [
    "Inteligencia Artificial",
    "Desarrollo de videojuegos",
    "Fotografía digital",
    "Tecnología blockchain",
    "Desarrollo móvil",
    "Open Source"
  ];

  return (
    <section id="sobre-mi" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Sobre <span className="text-gradient">mí</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desarrollador apasionado por crear soluciones innovadoras y experiencias digitales excepcionales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Profile Section */}
          <div className="fade-in-up">
            <div className="relative w-64 h-64 mx-auto lg:mx-0 mb-8">
              <img 
                src={profilePhoto}
                alt="Keita Yamada"
                className="w-full h-full object-cover rounded-2xl shadow-soft"
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-accent/20 to-purple-500/20" />
            </div>
            
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-bold mb-4">¡Hola! Soy Keita</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Con más de 3 años de experiencia en desarrollo web, me especializo en crear 
                aplicaciones modernas y escalables. Mi pasión por la tecnología me impulsa 
                a estar siempre aprendiendo y experimentando con nuevas herramientas y frameworks.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Cuando no estoy programando, disfruto explorando nuevas tecnologías, 
                contribuyendo a proyectos de código abierto y capturando momentos a través de la fotografía.
              </p>

              <div className="mb-8">
                <h4 className="text-lg font-semibold mb-4">Mis intereses:</h4>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <span 
                      key={interest}
                      className="px-3 py-1 bg-accent/10 text-accent text-sm rounded-full border border-accent/20"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="fade-in-up">
            <h3 className="text-2xl font-bold mb-8 text-center lg:text-left">Habilidades técnicas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {skills.map((skill, index) => (
                <div 
                  key={skill.title}
                  className="card-portfolio text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-accent mb-4 flex justify-center">
                    {skill.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{skill.title}</h4>
                  <p className="text-sm text-muted-foreground">{skill.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};