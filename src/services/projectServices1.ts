import { Project } from '@/app/Model/Projects';

export class ProjectService {
  /** Get all projects */

  private baseUrl = '/api/mongo/projects'

  public async getAll(): Promise<Project[]> {
    const res = await fetch(`${this.baseUrl}`);
    const projects = await res.json();
    return projects;
  }

  /** Get one by custom `id` */
  public async getById(id: string): Promise<Project | null> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch project')
    return res.json()
  }

  /** Create a new project */
  public async create(newProject: Project): Promise<Project> {
    //console.log(newProject)
    const created = await fetch(`${this.baseUrl}`, {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: { 'Content-Type': 'application/json' }
    });
    //console.log(created.json())
    return created.json();
  }

  /** Update existing project */
  public async update(project: Project): Promise<Project | null> {
    const res = await fetch(`${this.baseUrl}/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Update failed');
    }
    const data: Project = await res.json();
    return data;
  }

  /** Delete by custom `id` */
  public async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete project')
    const result = await res.json()
    return result.deletedCount > 0
  }
  public setActiveProject(activeProject:Project|null){
        localStorage.setItem("activeProject", JSON.stringify(activeProject));
  }
  public getActiveProject(){
      return localStorage.getItem("activeProject");  
  }
}
