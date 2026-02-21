import dotenv from "dotenv";
dotenv.config({ path: "server/.env" });
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import { requireAuth, signToken, type AuthUser } from "./auth";

const app = express();

const port = Number(process.env.PORT || 5174);
const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const setSessionCookie = (res: express.Response, token: string) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

const ensureAdminUser = async () => {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "1234";

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { username, passwordHash } });
  // eslint-disable-next-line no-console
  console.log(`Seeded admin user: ${username}`);
};

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

const githubBaseHeaders = () =>
  ({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-admin",
  }) as const;

const githubAuthHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    ...githubBaseHeaders(),
    Authorization: `Bearer ${token}`,
  } as const;
};

const githubPublicHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return githubBaseHeaders();
  return {
    ...githubBaseHeaders(),
    Authorization: `Bearer ${token}`,
  } as const;
};

const githubImageUrl = (owner: string, repo: string) => `https://opengraph.githubassets.com/1/${owner}/${repo}`;

const mapGithubRepo = (data: any) => ({
  id: data.id,
  name: data.name,
  full_name: data.full_name,
  description: data.description,
  html_url: data.html_url,
  homepage: data.homepage,
  language: data.language,
  topics: data.topics || [],
  image_url: githubImageUrl(data.owner?.login, data.name),
  owner: data.owner?.login,
  repo: data.name,
});

const mapGithubRepoToProject = (data: any) => {
  const topics = Array.isArray(data.topics) ? data.topics : [];
  const techStack = Array.from(new Set([...(topics || []), ...(data.language ? [data.language] : [])]));
  return {
    id: `github-${data.id}`,
    name: data.name,
    description: data.description ?? "",
    techStack: techStack.length > 0 ? techStack : ["GitHub"],
    githubUrl: data.html_url,
    liveUrl: data.homepage ?? null,
    imageUrl: githubImageUrl(data.owner?.login, data.name),
    githubOwner: data.owner?.login ?? "",
    githubRepo: data.name,
    sortOrder: 0,
    featured: false,
    homeOrder: 0,
    longDescription: data.description ?? null,
    highlights: [],
  };
};

const fetchGithubRepo = async (owner: string, repo: string) => {
  const headers = githubPublicHeaders();
  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(url, { headers });
  if (!response.ok) return null;
  const data = await response.json();
  return mapGithubRepo(data);
};

const homeGithubRepoClient = (prisma as any).homeGithubRepo as {
  findMany: (args?: unknown) => Promise<{ githubOwner: string; githubRepo: string }[]>;
  deleteMany: (args?: unknown) => Promise<unknown>;
  createMany: (args: { data: { githubOwner: string; githubRepo: string; sortOrder: number }[] }) => Promise<unknown>;
};

app.get("/api/github/repos", requireAuth, async (req, res) => {
  const headers = githubAuthHeaders();
  if (!headers) return res.status(400).json({ error: "GitHub token not configured" });

  const page = Number(req.query.page ?? 1);
  const perPage = Number(req.query.per_page ?? 100);

  const url = `https://api.github.com/user/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc&visibility=all&affiliation=owner,collaborator,organization_member`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    return res.status(response.status).json({ error: "GitHub API error" });
  }
  const data = await response.json();
  return res.json(data);
});

app.get("/api/github/repo", requireAuth, async (req, res) => {
  const headers = githubAuthHeaders();
  if (!headers) return res.status(400).json({ error: "GitHub token not configured" });

  const owner = String(req.query.owner || "");
  const repo = String(req.query.repo || "");
  if (!owner || !repo) return res.status(400).json({ error: "Missing owner/repo" });

  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    return res.status(response.status).json({ error: "GitHub API error" });
  }
  const data = await response.json();
  return res.json(mapGithubRepo(data));
});

app.get("/api/github/public-repos", async (req, res) => {
  const username = String(req.query.username || "").trim();
  if (!username) return res.status(400).json({ error: "Missing username" });

  const page = Number(req.query.page ?? 1);
  const perPage = Number(req.query.per_page ?? 100);
  const headers = githubPublicHeaders();

  const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=${perPage}&page=${page}&sort=updated&direction=desc&type=public`;
  const response = await fetch(url, { headers });
  if (!response.ok) {
    return res.status(response.status).json({ error: "GitHub API error" });
  }
  const data = await response.json();
  return res.json(data);
});

app.get("/api/home-github-repos", async (_req, res) => {
  const selections = await homeGithubRepoClient.findMany({ orderBy: { sortOrder: "asc" } });
  if (selections.length === 0) return res.json([]);

  const repos = await Promise.all(
    selections.map((selection) => fetchGithubRepo(selection.githubOwner, selection.githubRepo))
  );
  const projects = repos.filter(Boolean).map((repo) => mapGithubRepoToProject(repo));
  return res.json(projects);
});

app.get("/api/admin/home-github-repos", requireAuth, async (_req, res) => {
  const selections = await homeGithubRepoClient.findMany({ orderBy: { sortOrder: "asc" } });
  return res.json(selections);
});

app.put("/api/admin/home-github-repos", requireAuth, async (req, res) => {
  const payload = req.body as { repos?: { githubOwner?: string; githubRepo?: string }[] };
  const repos = payload?.repos || [];
  const cleaned = repos
    .map((repo) => ({
      githubOwner: String(repo.githubOwner || "").trim(),
      githubRepo: String(repo.githubRepo || "").trim(),
    }))
    .filter((repo) => repo.githubOwner && repo.githubRepo);

  await homeGithubRepoClient.deleteMany();
  await homeGithubRepoClient.createMany({
    data: cleaned.map((repo, index) => ({
      githubOwner: repo.githubOwner,
      githubRepo: repo.githubRepo,
      sortOrder: index,
    })),
  });

  const selections = await homeGithubRepoClient.findMany({ orderBy: { sortOrder: "asc" } });
  return res.json(selections);
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  const userRow = await prisma.user.findUnique({ where: { username } });
  if (!userRow) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, userRow.passwordHash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const user: AuthUser = { id: userRow.id, username: userRow.username };
  const token = signToken(user);
  setSessionCookie(res, token);
  return res.json({ user });
});

app.post("/api/auth/logout", (_req, res) => {
  res.clearCookie("session");
  return res.json({ ok: true });
});

app.get("/api/auth/me", (req, res) => {
  const token = req.cookies?.session;
  if (!token) return res.json({ user: null });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "dev_secret_change_me") as AuthUser;
    return res.json({ user });
  } catch {
    return res.json({ user: null });
  }
});

app.get("/api/profile", async (_req, res) => {
  const profile = await prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } });
  return res.json(profile);
});

app.put("/api/profile", requireAuth, async (req, res) => {
  const { name, role, bio, email, github, linkedin, twitter } = req.body as Record<string, string>;
  const current = await prisma.profile.findFirst({ orderBy: { updatedAt: "desc" } });
  if (!current) return res.status(404).json({ error: "Profile not found" });

  const updated = await prisma.profile.update({
    where: { id: current.id },
    data: {
      name: name ?? "",
      role: role ?? "",
      bio: bio ?? "",
      email: email ?? "",
      github: github ?? "",
      linkedin: linkedin ?? "",
      twitter: twitter ?? "",
      updatedAt: new Date(),
    },
  });
  return res.json(updated);
});

app.get("/api/education", async (_req, res) => {
  const items = await prisma.education.findMany({ orderBy: { sortOrder: "asc" } });
  return res.json(items);
});

app.post("/api/education", requireAuth, async (req, res) => {
  const { school, degree, dates, notes, sortOrder } = req.body as Record<string, string | number | null>;
  const item = await prisma.education.create({
    data: {
      school: (school as string) ?? "",
      degree: (degree as string) ?? "",
      dates: (dates as string) ?? "",
      notes: (notes as string) ?? null,
      sortOrder: Number(sortOrder ?? 0),
    },
  });
  return res.json(item);
});

app.put("/api/education/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { school, degree, dates, notes, sortOrder } = req.body as Record<string, string | number | null>;
  const item = await prisma.education.update({
    where: { id },
    data: {
      school: (school as string) ?? "",
      degree: (degree as string) ?? "",
      dates: (dates as string) ?? "",
      notes: (notes as string) ?? null,
      sortOrder: Number(sortOrder ?? 0),
    },
  });
  return res.json(item);
});

app.delete("/api/education/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  await prisma.education.delete({ where: { id } });
  return res.json({ ok: true });
});

app.get("/api/experience", async (_req, res) => {
  const items = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });
  return res.json(items);
});

app.post("/api/experience", requireAuth, async (req, res) => {
  const { company, role, dates, highlights, sortOrder } = req.body as Record<string, string | string[] | number>;
  const item = await prisma.experience.create({
    data: {
      company: (company as string) ?? "",
      role: (role as string) ?? "",
      dates: (dates as string) ?? "",
      highlights: (highlights as string[]) ?? [],
      sortOrder: Number(sortOrder ?? 0),
    },
  });
  return res.json(item);
});

app.put("/api/experience/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { company, role, dates, highlights, sortOrder } = req.body as Record<string, string | string[] | number>;
  const item = await prisma.experience.update({
    where: { id },
    data: {
      company: (company as string) ?? "",
      role: (role as string) ?? "",
      dates: (dates as string) ?? "",
      highlights: (highlights as string[]) ?? [],
      sortOrder: Number(sortOrder ?? 0),
    },
  });
  return res.json(item);
});

app.delete("/api/experience/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  await prisma.experience.delete({ where: { id } });
  return res.json({ ok: true });
});

app.get("/api/projects", async (_req, res) => {
  const items = await prisma.project.findMany({ orderBy: { sortOrder: "asc" } });
  return res.json(items);
});

app.post("/api/projects", requireAuth, async (req, res) => {
  const {
    name,
    description,
    techStack,
    githubUrl,
    liveUrl,
    imageUrl,
    sortOrder,
    githubOwner,
    githubRepo,
    featured,
    homeOrder,
    longDescription,
    highlights,
  } = req.body as Record<string, string | string[] | number | boolean | null>;
  const item = await prisma.project.create({
    data: {
      name: (name as string) ?? "",
      description: (description as string) ?? "",
      techStack: (techStack as string[]) ?? [],
      githubUrl: (githubUrl as string) ?? "",
      liveUrl: (liveUrl as string) ?? null,
      imageUrl: (imageUrl as string) ?? null,
      sortOrder: Number(sortOrder ?? 0),
      githubOwner: (githubOwner as string) ?? null,
      githubRepo: (githubRepo as string) ?? null,
      featured: Boolean(featured ?? false),
      homeOrder: Number(homeOrder ?? 0),
      longDescription: (longDescription as string) ?? null,
      highlights: (highlights as string[]) ?? [],
    },
  });
  return res.json(item);
});

app.put("/api/projects/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    techStack,
    githubUrl,
    liveUrl,
    imageUrl,
    sortOrder,
    githubOwner,
    githubRepo,
    featured,
    homeOrder,
    longDescription,
    highlights,
  } = req.body as Record<string, string | string[] | number | boolean | null>;
  const item = await prisma.project.update({
    where: { id },
    data: {
      name: (name as string) ?? "",
      description: (description as string) ?? "",
      techStack: (techStack as string[]) ?? [],
      githubUrl: (githubUrl as string) ?? "",
      liveUrl: (liveUrl as string) ?? null,
      imageUrl: (imageUrl as string) ?? null,
      sortOrder: Number(sortOrder ?? 0),
      githubOwner: (githubOwner as string) ?? null,
      githubRepo: (githubRepo as string) ?? null,
      featured: Boolean(featured ?? false),
      homeOrder: Number(homeOrder ?? 0),
      longDescription: (longDescription as string) ?? null,
      highlights: (highlights as string[]) ?? [],
    },
  });
  return res.json(item);
});

app.delete("/api/projects/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  await prisma.project.delete({ where: { id } });
  return res.json({ ok: true });
});

ensureAdminUser().then(() => {
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${port}`);
  });
});
