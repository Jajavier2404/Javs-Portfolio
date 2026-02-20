
-- Profile info table
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  github TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  twitter TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Authenticated users can update profile" ON public.profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Education table
CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL DEFAULT '',
  dates TEXT NOT NULL DEFAULT '',
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read education" ON public.education FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert education" ON public.education FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update education" ON public.education FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete education" ON public.education FOR DELETE TO authenticated USING (true);

-- Experience table
CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  dates TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read experience" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert experience" ON public.experience FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update experience" ON public.experience FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete experience" ON public.experience FOR DELETE TO authenticated USING (true);

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL DEFAULT '',
  live_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update projects" ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

-- Insert default profile data
INSERT INTO public.profile (name, role, bio, email, github, linkedin, twitter) VALUES (
  'Javier Alexander',
  'Full-Stack Developer',
  'I craft performant, scalable web applications with modern technologies. Passionate about clean architecture, developer experience, and shipping products that make a difference.',
  'javier@example.com',
  'https://github.com/javieralexander',
  'https://linkedin.com/in/javieralexander',
  'https://twitter.com/javieralexander'
);

-- Insert default education
INSERT INTO public.education (school, degree, dates, notes, sort_order) VALUES
  ('MIT — Massachusetts Institute of Technology', 'M.S. Computer Science', '2020 – 2022', 'Focus on distributed systems and machine learning', 0),
  ('Universidad de Buenos Aires', 'B.S. Software Engineering', '2016 – 2020', 'Graduated with honors, Dean''s list', 1),
  ('freeCodeCamp & Coursera', 'Full-Stack Web Development Certificates', '2018 – 2019', NULL, 2);

-- Insert default experience
INSERT INTO public.experience (company, role, dates, highlights, sort_order) VALUES
  ('Vercel', 'Senior Frontend Engineer', '2023 – Present', ARRAY['Led migration of dashboard to Next.js 14 App Router, reducing load time by 40%', 'Built real-time collaboration features serving 50k+ daily users', 'Mentored a team of 4 junior engineers on React best practices'], 0),
  ('Stripe', 'Full-Stack Engineer', '2021 – 2023', ARRAY['Designed and shipped new payment flow UI used by 10M+ merchants', 'Optimized API response times by 60% through query caching', 'Contributed to the open-source Stripe Elements library'], 1),
  ('Freelance', 'Web Developer', '2019 – 2021', ARRAY['Delivered 15+ client projects across e-commerce, SaaS, and media', 'Built a custom CMS for a media startup handling 100k monthly visitors'], 2);

-- Insert default projects
INSERT INTO public.projects (name, description, tech_stack, github_url, live_url, sort_order) VALUES
  ('NeonDB Dashboard', 'Real-time database monitoring dashboard with live query analytics and performance insights.', ARRAY['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'], 'https://github.com/javieralexander/neondb-dashboard', 'https://neondb-dash.vercel.app', 0),
  ('CodeSync', 'Collaborative code editor with real-time sync, syntax highlighting, and integrated terminal.', ARRAY['React', 'WebSockets', 'Monaco Editor', 'Node.js'], 'https://github.com/javieralexander/codesync', NULL, 1),
  ('DevFlow CLI', 'A developer productivity CLI tool for scaffolding projects, managing configs, and automating deploys.', ARRAY['TypeScript', 'Node.js', 'Commander.js'], 'https://github.com/javieralexander/devflow-cli', NULL, 2),
  ('PixelGrid', 'Lightweight pixel art editor in the browser with export to PNG/SVG and community gallery.', ARRAY['React', 'Canvas API', 'Tailwind', 'Supabase'], 'https://github.com/javieralexander/pixelgrid', 'https://pixelgrid.app', 3),
  ('API Gateway', 'High-performance API gateway with rate limiting, auth middleware, and request logging.', ARRAY['Go', 'Redis', 'Docker', 'gRPC'], 'https://github.com/javieralexander/api-gateway', NULL, 4),
  ('MarkdownX', 'Enhanced markdown renderer with LaTeX support, code execution blocks, and theme customization.', ARRAY['Next.js', 'MDX', 'Shiki', 'Tailwind'], 'https://github.com/javieralexander/markdownx', 'https://markdownx.dev', 5);
