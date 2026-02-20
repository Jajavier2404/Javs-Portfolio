import { useProfile } from "@/hooks/usePortfolioData";
import { Github, Linkedin, Twitter } from "lucide-react";

const Footer = () => {
  const { data: profile } = useProfile();

  const name = profile?.name ?? "Javier Alexander";
  const social = {
    github: profile?.github ?? "#",
    linkedin: profile?.linkedin ?? "#",
    twitter: profile?.twitter ?? "#",
  };

  return (
    <footer className="relative border-t border-primary/10 py-10">
      <div className="absolute top-0 left-0 right-0 neon-line" />
      <div className="container mx-auto flex flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="font-mono text-sm neon-text">{"<JA />"}</span>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} {name}</p>
        </div>
        <div className="flex items-center gap-5">
          {[
            { icon: Github, href: social.github, label: "GitHub" },
            { icon: Linkedin, href: social.linkedin, label: "LinkedIn" },
            { icon: Twitter, href: social.twitter, label: "Twitter" },
          ].map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-primary/10 text-muted-foreground transition-all duration-300 hover:text-primary hover:border-primary/40 hover:shadow-[var(--neon-glow)] hover:bg-primary/5">
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
