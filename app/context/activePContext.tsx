"use client";
import { createContext, useContext, useState, ReactNode, useEffect} from "react";
import { Project } from "@/src/services/projectServices1";

// Define the Context Type
interface ProjectContextType {
  activeProject: Project | null;
  setActiveProject: (project: Project | null) => void;
  isLoaded: boolean;
}

//  Create the Context
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

//  Create a Provider Component
export function ProjectProvider({ children }: { children: ReactNode }) {
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [isLoaded, setIsLoaded] = useState(false); // Prevents SSR mismatch
  
    useEffect(() => {
      // Load from localStorage only on client
      if (typeof window !== "undefined") {
        const savedProject = localStorage.getItem("activeProject");
        setActiveProject(savedProject ? JSON.parse(savedProject) : null);
        setIsLoaded(true); // Mark as loaded
      }
    }, []);
  
    useEffect(() => {
      if (activeProject) {
        localStorage.setItem("activeProject", JSON.stringify(activeProject));
      }
    }, [activeProject]);
      
  return (
    <ProjectContext.Provider value={{ activeProject, setActiveProject, isLoaded }}>
      {children}
    </ProjectContext.Provider>
  );
}

//  Hook for Using Context
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
