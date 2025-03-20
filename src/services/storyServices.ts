import { Project } from "./projectServices1";

export interface Story {
    id: string;
    nazwa: string;
    opis: string;
    priorytet:Priority;
    projekt:Project;
    data_utworzenia:string;
    stan:State;
    wlasciciel:string;
}
export enum Priority{
    niski,
    sredni,
    wysoki
}
export enum State{
    todo = 1,
    doing,
    done
}
export class StoryService {
    private storageKey = "stories";
    

    // Retrieve all projects from localStorage
    private getStories(): Story[] {
        const stories = localStorage.getItem(this.storageKey);
        return stories ? JSON.parse(stories) : [];
    }

    // Save projects back to localStorage
    private saveStories(stories: Story[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(stories));
    }

    // Get all projects
    public getAll(id:string): Story[] {
        
        let stories = this.getStories();
        //console.log(stories[0])
        
        stories = stories.filter((story)=> story.projekt.id===id);
        return stories;
    }

    // Get a project by id
    public getById(id: string): Story | undefined {
        return this.getStories().find((story) => story.id === id);
    }

    // Create a new project
    public create(story: Story): void {
        const stories = this.getStories();
        stories.push(story);
        this.saveStories(stories);
    }

    // Update an existing project
    public update(updatedStory: Story): void {
        let stories = this.getStories();
        stories = stories.map((story) =>
            story.id === updatedStory.id ? updatedStory : story
        );
        this.saveStories(stories);
    }

    // Delete a project by id
    public delete(id: string): void {
        let stories = this.getStories();
        stories = stories.filter((story) => story.id !== id);
        this.saveStories(stories);
    }
}