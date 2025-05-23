"use client";
import { createContext, useContext, useState, ReactNode, useEffect} from "react";
import {StoryService } from "@/src/services/storyServices";
import { Story } from "../Model/Stories";

// Define the Context Type
interface StoryContextType {
  activeStory:Story | null;
  setActiveStory : (story: Story|null) => void;
  isLoaded: boolean;
}

//  Create the Context
const StoryContext = createContext<StoryContextType | undefined>(undefined);

//  Create a Provider Component
export function StoryProvider({ children }: { children: ReactNode }) {
  const storyManager=new StoryService()
    const [activeStory,setActiveStory]=useState<Story|null>(null)
    const [isLoaded, setIsLoaded] = useState(false); // Prevents SSR mismatch
  
    useEffect(() => {
        const savedStory = storyManager.getActiveProject();
        setActiveStory(savedStory ? JSON.parse(savedStory) : null);
        setIsLoaded(true); // Mark as loaded
    }, []);
  
    useEffect(() => {
      storyManager.setActiveProject(activeStory);
    }, [activeStory]);
      
  return (
    <StoryContext.Provider value={{activeStory,setActiveStory,isLoaded }}>
      {children}
    </StoryContext.Provider>
  );
}

//  Hook for Using Context
export function useStory() {
  const context = useContext(StoryContext);
  if (!context) {
    throw new Error("useStory must be used within a StoryProvider");
  }
  return context;
}
