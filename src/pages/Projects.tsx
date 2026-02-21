import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import { ProjectsCatalog } from "@/pages/ProjectsCatalog";

const Projects = () => (
  <div className="relative min-h-screen bg-background neon-grid-bg">
    <FloatingParticles />
    <Navbar />
    <main className="relative z-10">
      <ProjectsCatalog adminMode={false} />
    </main>
    <Footer />
  </div>
);

export default Projects;
