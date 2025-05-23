import { Story } from '@/app/Model/Types/StoriesTypes';

export class StoryService {
  private baseUrl = '/api/mongo/stories'

  /** Get all stories by project ID */
  public async getAll(projectId: string): Promise<Story[]> {
    const res = await fetch(`${this.baseUrl}?projectId=${projectId}`)
    //console.log(res)
    if (!res.ok) throw new Error('Failed to fetch stories')
    return res.json()
  }

 
  public async getById(id: string): Promise<Story | null> {
    const res = await fetch(`${this.baseUrl}/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to fetch story')
    return res.json()
  }

 
  public async create(story: Story): Promise<Story> {
    story.projektId=story.projekt.id;
    //console.log(story)
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    })
    if (!res.ok) throw new Error('Failed to create story')
    return res.json()
  }

 
  public async update(story: Story): Promise<Story | null> {
    const res = await fetch(`${this.baseUrl}/${story.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(story)
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Failed to update story')
    return res.json()
  }

  
  public async delete(id: string): Promise<boolean> {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE'
    })
    if (!res.ok) throw new Error('Failed to delete story')
    const result = await res.json()
    return result.deletedCount > 0
  }
  public setActiveProject(activeStory:Story|null){
        localStorage.setItem("activeStory", JSON.stringify(activeStory));
    }
    public getActiveProject(){
        return localStorage.getItem("activeStory"); 
    }
}
