import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';

export const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('proyectos')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
            <span className="text-gradient">Javier Gomez</span>
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Desarrollador web <span className="text-accent">frontend</span> y <span className="text-accent">backend</span>
          </p>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Creando experiencias digitales excepcionales con tecnologías modernas. 
            Especializado en React, Node.js y diseño de interfaces intuitivas.
          </p>
        </div>

        <div className="fade-in-up space-y-6">
          <button 
            onClick={scrollToProjects}
            className="btn-gradient inline-flex items-center space-x-2"
          >
            <span>Ver mis proyectos</span>
            <ArrowDown size={20} />
          </button>

          <div className="flex justify-center space-x-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 hover:scale-110 transition-transform"
            >
              <Github size={24} />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 hover:scale-110 transition-transform"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="mailto:keita@example.com"
              className="text-muted-foreground hover:text-accent transition-colors duration-300 hover:scale-110 transition-transform"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="text-accent" size={24} />
      </div>
    </section>
  );
};