CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  github TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  twitter TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school TEXT NOT NULL DEFAULT '',
  degree TEXT NOT NULL DEFAULT '',
  dates TEXT NOT NULL DEFAULT '',
  notes TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT '',
  dates TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT NOT NULL DEFAULT '',
  live_url TEXT,
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  github_owner TEXT,
  github_repo TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

INSERT INTO profile (name, role, bio, email, github, linkedin, twitter)
SELECT
  'Javier Alexander',
  'Full-Stack Developer',
  'I craft performant, scalable web applications with modern technologies. Passionate about clean architecture, developer experience, and shipping products that make a difference.',
  'javier@example.com',
  'https://github.com/javieralexander',
  'https://linkedin.com/in/javieralexander',
  'https://twitter.com/javieralexander'
WHERE NOT EXISTS (SELECT 1 FROM profile);

INSERT INTO education (school, degree, dates, notes, sort_order)
SELECT * FROM (
  VALUES
    ('MIT — Massachusetts Institute of Technology', 'M.S. Computer Science', '2020 – 2022', 'Focus on distributed systems and machine learning', 0),
    ('Universidad de Buenos Aires', 'B.S. Software Engineering', '2016 – 2020', 'Graduated with honors, Dean''s list', 1),
    ('freeCodeCamp & Coursera', 'Full-Stack Web Development Certificates', '2018 – 2019', NULL, 2)
) AS v(school, degree, dates, notes, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM education);

INSERT INTO experience (company, role, dates, highlights, sort_order)
SELECT * FROM (
  VALUES
    ('Vercel', 'Senior Frontend Engineer', '2023 – Present', ARRAY['Led migration of dashboard to Next.js 14 App Router, reducing load time by 40%', 'Built real-time collaboration features serving 50k+ daily users', 'Mentored a team of 4 junior engineers on React best practices'], 0),
    ('Stripe', 'Full-Stack Engineer', '2021 – 2023', ARRAY['Designed and shipped new payment flow UI used by 10M+ merchants', 'Optimized API response times by 60% through query caching', 'Contributed to the open-source Stripe Elements library'], 1),
    ('Freelance', 'Web Developer', '2019 – 2021', ARRAY['Delivered 15+ client projects across e-commerce, SaaS, and media', 'Built a custom CMS for a media startup handling 100k monthly visitors'], 2)
) AS v(company, role, dates, highlights, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM experience);

INSERT INTO projects (name, description, tech_stack, github_url, live_url, image_url, sort_order, github_owner, github_repo)
SELECT * FROM (
  VALUES
    ('NeonDB Dashboard', 'Real-time database monitoring dashboard with live query analytics and performance insights.', ARRAY['Next.js', 'TypeScript', 'Tailwind', 'PostgreSQL'], 'https://github.com/javieralexander/neondb-dashboard', 'https://neondb-dash.vercel.app', 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=900&q=80', 0, 'javieralexander', 'neondb-dashboard'),
    ('CodeSync', 'Collaborative code editor with real-time sync, syntax highlighting, and integrated terminal.', ARRAY['React', 'WebSockets', 'Monaco Editor', 'Node.js'], 'https://github.com/javieralexander/codesync', NULL, 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80', 1, 'javieralexander', 'codesync'),
    ('DevFlow CLI', 'A developer productivity CLI tool for scaffolding projects, managing configs, and automating deploys.', ARRAY['TypeScript', 'Node.js', 'Commander.js'], 'https://github.com/javieralexander/devflow-cli', NULL, 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', 2, 'javieralexander', 'devflow-cli')
) AS v(name, description, tech_stack, github_url, live_url, image_url, sort_order, github_owner, github_repo)
WHERE NOT EXISTS (SELECT 1 FROM projects);
