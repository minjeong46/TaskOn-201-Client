"use client";

import { Project } from "@/lib/project/projectApi";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentProjectId: number | null; // persist용 projectId
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      currentProjectId: null,
      isLoading: false,

      setProjects: (projects) => set({ projects }),
      setCurrentProject: (project) =>
        set({
          currentProject: project,
          currentProjectId: project?.projectId ?? null,
        }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "project-storage",
      // currentProjectId만 persist (프로젝트 객체 전체가 아닌 ID만 저장)
      partialize: (state) => ({ currentProjectId: state.currentProjectId }),
    }
  )
);

