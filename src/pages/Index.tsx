import { useState, useEffect } from 'react';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { Projects } from '@/components/Projects';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Contact } from '@/components/Contact';

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    // Add scroll animation observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe all fade-in-up elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .fade-in');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      animatedElements.forEach((el) => observer.unobserve(el));
    };
  }, [showLoading]);

  if (showLoading) {
    return <LoadingAnimation onComplete={() => setShowLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <About />
        <Experience />
        <Contact />
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Keita Yamada. Desarrollado con React y TailwindCSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
