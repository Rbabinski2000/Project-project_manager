import { Task } from "@/app/Model/Tasks"

export class TaskService {
  private base = '/api/tasks'

  public async getTasks(): Promise<Task[]> {
    const res = await fetch(this.base)
    if (!res.ok) throw new Error('Fetch tasks failed')
    return res.json()
  }

  public async getStoryTasks(storyId: string): Promise<Task[]> {
    const res = await fetch(`${this.base}?storyId=${storyId}`)
    if (!res.ok) throw new Error('Fetch story tasks failed')
    return res.json()
  }

  public async getTask(id: string): Promise<Task | null> {
    const res = await fetch(`${this.base}/${id}`)
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Fetch task failed')
    return res.json()
  }

  public async addTask(task: Task): Promise<Task> {
    const res = await fetch(this.base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    if (!res.ok) throw new Error('Create task failed')
    return res.json()
  }

  public async updateTask(task: Task): Promise<Task | null> {
    const res = await fetch(`${this.base}/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error('Update task failed')
    return res.json()
  }

  public async deleteTask(id: string): Promise<boolean> {
    const res = await fetch(`${this.base}/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Delete task failed')
    const result = await res.json()
    return result.deletedCount > 0
  }

  public async assignUser(id: string, userId: string): Promise<Task> {
    const res = await fetch(`${this.base}/${id}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (!res.ok) throw new Error('Assign failed')
    return res.json()
  }

  public async removeUser(id: string): Promise<Task> {
    const res = await fetch(`${this.base}/${id}/remove`, { method: 'POST' })
    if (!res.ok) throw new Error('Remove user failed')
    return res.json()
  }

  public async markDone(id: string): Promise<Task> {
    const res = await fetch(`${this.base}/${id}/done`, { method: 'POST' })
    if (!res.ok) throw new Error('Mark done failed')
    return res.json()
  }
}