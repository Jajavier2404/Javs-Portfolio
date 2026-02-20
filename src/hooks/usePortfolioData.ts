import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  sort_order: number;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  dates: string;
  highlights: string[];
  sort_order: number;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  live_url: string | null;
  sort_order: number;
}

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profile").select("*").limit(1).single();
      if (error) throw error;
      return data as ProfileData;
    },
  });

export const useEducation = () =>
  useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data, error } = await supabase.from("education").select("*").order("sort_order");
      if (error) throw error;
      return data as EducationItem[];
    },
  });

export const useExperience = () =>
  useQuery({
    queryKey: ["experience"],
    queryFn: async () => {
      const { data, error } = await supabase.from("experience").select("*").order("sort_order");
      if (error) throw error;
      return data as ExperienceItem[];
    },
  });

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data as ProjectItem[];
    },
  });
