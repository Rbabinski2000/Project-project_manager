export interface Project {
    id: string;
    nazwa: string;
    opis: string;
}

export class ProjectService {
    private storageKey = "projects";
    

    // Retrieve all projects from localStorage
    private getProjects(): Project[] {
        const projects = localStorage.getItem(this.storageKey);
        return projects ? JSON.parse(projects) : [];
    }

    // Save projects back to localStorage
    private saveProjects(projects: Project[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }

    // Get all projects
    public getAll(): Project[] {
        return this.getProjects();
    }

    // Get a project by id
    public getById(id: string): Project | undefined {
        return this.getProjects().find((project) => project.id === id);
    }

    // Create a new project
    public create(project: Project): void {
        const projects = this.getProjects();
        projects.push(project);
        this.saveProjects(projects);
    }

    // Update an existing project
    public update(updatedProject: Project): void {
        let projects = this.getProjects();
        projects = projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
        );
        this.saveProjects(projects);
    }

    // Delete a project by id
    public delete(id: string): void {
        let projects = this.getProjects();
        projects = projects.filter((project) => project.id !== id);
        this.saveProjects(projects);
    }
    public setActiveProject(activeProject:Project|null){
        localStorage.setItem("activeProject", JSON.stringify(activeProject));
    }
    public getActiveProject(){
        return localStorage.getItem("activeProject");  
    }
}