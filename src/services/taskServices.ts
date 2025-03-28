//import { Project } from "./projectServices1";
import { Priority,State, Story } from "./storyServices";

export interface Task {
    id: string;
    nazwa: string;
    opis: string;
    priorytet: Priority;
    historia: Story;
    szacowany_czas: number;
    status: State;
    data_dodania: string;
    data_startu?: string;
    data_ukonczenia?: string;
    przypisany_uzytkownik?: string;
  }
  
  
  
  export class TaskService {
    private STORAGE_KEY = 'tasks'

    public getTasks(): Task[] {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }
    
    public getStoryTasks(storyId:String): Task[] {
      if (typeof window === 'undefined') return [];
      var array:Task[]= JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      return array.filter(task => task.historia.id === storyId);
    }
    public getTask(id: string): Task | undefined {
        return this.getTasks().find(task => task.id === id);
    }
      
    public addTask(task: Task): void {
        const tasks = this.getTasks();
        tasks.push(task);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
      
    public updateTask(updatedTask: Task): void {
        const tasks =this.getTasks().map(task => 
          task.id === updatedTask.id ? updatedTask : task
        );
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
      
    public deleteTask(id: string): void {
        const tasks = this.getTasks().filter(task => task.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    }
      
    public assignUserToTask(id: string, user: string): void {
        const task = this.getTask(id);
        if (task && task.status === State.todo) {
          task.status = State.doing;
          task.data_startu = new Date().toISOString();
          task.przypisany_uzytkownik = user;
          this.updateTask(task);
        }
    }
      
    public markTaskAsDone(id: string): void {
      console.log(id)
        const task = this.getTask(id);
        if (task && task.status === State.doing) {
          task.status = State.done;
          task.data_ukonczenia = new Date().toISOString();
          
          this.updateTask(task);
        }
    };
}