import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react';
import Plasma from './ui/Plasma';
import SplitText from "./SplitText";
import foto from '../assets/foto.png';
export const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('proyectos')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
  
  return (
    <section id="inicio" className="min-h-screen flex flex-row items-center justify-center relative px-6">
      <div className="absolute inset-0 z-0">
        <Plasma 
          color="#79D5E2"
          speed={0.4}
          direction="forward"
          scale={0.6}
          opacity={0.8}
          mouseInteractive={false}
        />
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        {/* Contenido principal con flex responsive y distribución equilibrada */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-15 lg:gap-40">
          
          {/* Contenido de texto - ocupa espacio proporcional */}
          <div className="fade-in-up  lg:text-left lg:flex-1 lg:max-w-2xl">
            <SplitText
              text="Javier Gomez"
              className="text-5xl md:text-7xl font-bold mb-6"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="left"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            
            <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8">
              Desarrollador web <span className="text-accent">frontend</span> y <span className="text-accent">backend</span>
            </p>
            <p className="text-lg text-muted-foreground mb-12 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Creando experiencias digitales excepcionales con tecnologías modernas. 
              Especializado en React, Node.js y diseño de interfaces intuitivas.
            </p>

            <div className="space-y-6">
              <button 
                onClick={scrollToProjects}
                className="btn-gradient inline-flex items-center space-x-2"
              >
                <span>Ver mis proyectos</span>
                <ArrowDown size={20} />
              </button>

              <div className="flex justify-center lg:justify-start lg:ml-3 space-x-6">
                <a 
                  href="https://github.com/Jajavier2404" 
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
                  href="javialex2008@gmail.com"
                  className="text-muted-foreground hover:text-accent transition-colors duration-300 hover:scale-110 transition-transform"
                >
                  <Mail size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Tarjeta de imagen - ocupa espacio proporcional */}
          <div className="fade-in-up delay-200 lg:flex-1 lg:flex lg:justify-center lg:items-center">
              <img 
                src={foto} 
                alt="Foto de perfil de Javier Gomez" 
                className="w-80 h-80 md:w-[50rem] md:h-[30rem] object-contain transition-transform duration-300 group-hover:scale-105"
              />
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