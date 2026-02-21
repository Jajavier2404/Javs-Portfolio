import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingParticles from "@/components/FloatingParticles";
import { ProjectsCatalog } from "@/pages/ProjectsCatalog";
import { useAuth } from "@/hooks/useAuth";
import { AdminViewProvider } from "@/context/AdminViewContext";
import { AdminActionsProvider } from "@/context/AdminActionsContext";

const AdminProjects = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><span className="text-primary font-mono">Loading...</span></div>;
  if (!user) return null;

  return (
    <AdminViewProvider>
      <AdminActionsProvider>
        <div className="relative min-h-screen bg-background neon-grid-bg">
          <FloatingParticles />
          <Navbar />
          <main className="relative z-10">
            <ProjectsCatalog adminMode />
          </main>
          <Footer />
        </div>
      </AdminActionsProvider>
    </AdminViewProvider>
  );
};

export default AdminProjects;
