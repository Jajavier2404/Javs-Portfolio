export interface Education {
  school: string;
  degree: string;
  dates: string;
  notes?: string;
}

export interface Experience {
  company: string;
  role: string;
  dates: string;
  highlights: string[];
}

export interface Project {
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl?: string;
}

export const profileData = {
  name: "Javier Alexander",
  role: "Full-Stack Developer",
  bio: "I craft performant, scalable web applications with modern technologies. Passionate about clean architecture, developer experience, and shipping products that make a difference.",
  email: "javier@example.com",
  social: {
    github: "https://github.com/javieralexander",
    linkedin: "https://linkedin.com/in/javieralexander",
    twitter: "https://twitter.com/javieralexander",
  },
};

export const educationData: Education[] = [
  {
    school: "MIT — Massachusetts Institute of Technology",
    degree: "M.S. Computer Science",
    dates: "2020 – 2022",
    notes: "Focus on distributed systems and machine learning",
  },
  {
    school: "Universidad de Buenos Aires",
    degree: "B.S. Software Engineering",
    dates: "2016 – 2020",
    notes: "Graduated with honors, Dean's list",
  },
  {
    school: "freeCodeCamp & Coursera",
    degree: "Full-Stack Web Development Certificates",
    dates: "2018 – 2019",
  },
];

export const experienceData: Experience[] = [
  {
    company: "Vercel",
    role: "Senior Frontend Engineer",
    dates: "2023 – Present",
    highlights: [
      "Led migration of dashboard to Next.js 14 App Router, reducing load time by 40%",
      "Built real-time collaboration features serving 50k+ daily users",
      "Mentored a team of 4 junior engineers on React best practices",
    ],
  },
  {
    company: "Stripe",
    role: "Full-Stack Engineer",
    dates: "2021 – 2023",
    highlights: [
      "Designed and shipped new payment flow UI used by 10M+ merchants",
      "Optimized API response times by 60% through query caching",
      "Contributed to the open-source Stripe Elements library",
    ],
  },
  {
    company: "Freelance",
    role: "Web Developer",
    dates: "2019 – 2021",
    highlights: [
      "Delivered 15+ client projects across e-commerce, SaaS, and media",
      "Built a custom CMS for a media startup handling 100k monthly visitors",
    ],
  },
];

export const projectsData: Project[] = [
  {
    name: "NeonDB Dashboard",
    description: "Real-time database monitoring dashboard with live query analytics and performance insights.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "PostgreSQL"],
    githubUrl: "https://github.com/javieralexander/neondb-dashboard",
    liveUrl: "https://neondb-dash.vercel.app",
  },
  {
    name: "CodeSync",
    description: "Collaborative code editor with real-time sync, syntax highlighting, and integrated terminal.",
    techStack: ["React", "WebSockets", "Monaco Editor", "Node.js"],
    githubUrl: "https://github.com/javieralexander/codesync",
  },
  {
    name: "DevFlow CLI",
    description: "A developer productivity CLI tool for scaffolding projects, managing configs, and automating deploys.",
    techStack: ["TypeScript", "Node.js", "Commander.js"],
    githubUrl: "https://github.com/javieralexander/devflow-cli",
  },
  {
    name: "PixelGrid",
    description: "Lightweight pixel art editor in the browser with export to PNG/SVG and community gallery.",
    techStack: ["React", "Canvas API", "Tailwind", "Supabase"],
    githubUrl: "https://github.com/javieralexander/pixelgrid",
    liveUrl: "https://pixelgrid.app",
  },
  {
    name: "API Gateway",
    description: "High-performance API gateway with rate limiting, auth middleware, and request logging.",
    techStack: ["Go", "Redis", "Docker", "gRPC"],
    githubUrl: "https://github.com/javieralexander/api-gateway",
  },
  {
    name: "MarkdownX",
    description: "Enhanced markdown renderer with LaTeX support, code execution blocks, and theme customization.",
    techStack: ["Next.js", "MDX", "Shiki", "Tailwind"],
    githubUrl: "https://github.com/javieralexander/markdownx",
    liveUrl: "https://markdownx.dev",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Education", href: "#education" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];
