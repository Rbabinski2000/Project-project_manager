import { Project } from "./projectServices1";

export class ActiveProjectService{
    private activeProjectKey="activeProject"

    public setActiveProject(project:Project){
        localStorage.setItem(this.activeProjectKey, JSON.stringify(project));
    }
    public getActiveProject(){
        const project = localStorage.getItem(this.activeProjectKey);
        return project ? JSON.parse(project) : null;
    }
}