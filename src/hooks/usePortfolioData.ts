import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

export interface ProfileData {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  dates: string;
  notes: string | null;
  sortOrder: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dates: string;
  highlights: string[];
  sortOrder: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string | null;
  imageUrl: string | null;
  githubOwner: string | null;
  githubRepo: string | null;
  sortOrder: number;
  featured: boolean;
  homeOrder: number;
  longDescription: string | null;
  highlights: string[];
}

export interface HomeGithubRepoSelection {
  id: string;
  githubOwner: string;
  githubRepo: string;
  sortOrder: number;
}

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      return apiFetch<ProfileData>("/profile");
    },
  });

export const useEducation = () =>
  useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      return apiFetch<EducationItem[]>("/education");
    },
  });

export const useExperience = () =>
  useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      return apiFetch<ExperienceItem[]>("/experience");
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return apiFetch<ProjectItem[]>("/projects");
    },
  });

export const useHomeGithubRepos = () =>
  useQuery({
    queryKey: ["home-github-repos"],
    queryFn: async () => {
      return apiFetch<ProjectItem[]>("/home-github-repos");
    },
  });

export const useAdminHomeGithubRepos = (enabled = true) =>
  useQuery({
    queryKey: ["admin-home-github-repos"],
    queryFn: async () => {
      return apiFetch<HomeGithubRepoSelection[]>("/admin/home-github-repos");
    },
    enabled,
  });
