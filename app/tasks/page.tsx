import { Priority, State } from '@/src/services/storyServices';
import { Task, TaskService } from '@/src/services/taskServices';
import { CloudCog } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

interface TaskFormProps {
  initialTask?: Task;
  onSave: (task: Task) => void;
}

export default function TaskManager() {
    const router = useRouter();
    //const userData = JSON.parse(router.query.data);
    console.log(router.query)
    const taskService=new TaskService();
    const [task, setTask] = useState<Task>({
        id:"",
        nazwa: "",
        opis: "",
        priorytet:Priority.niski,
        historia:null ,
        szacowany_czas: 0,
        status: State.todo,
        data_dodania: new Date().toISOString(),
        }
    );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    taskService.addTask(task);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nazwa: <input type="text" name="name" value={task.nazwa} onChange={handleChange} required /></label>
      <label>Opis: <textarea name="description" value={task.opis} onChange={handleChange} required /></label>
      <label>Priorytet:
        <select name="priority" value={task.priorytet} onChange={handleChange}>
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </label>
      <label>Historyjka: <input type="text" name="story" value={task.historia} onChange={handleChange} required /></label>
      <label>Przewidywany czas: <input type="number" name="estimatedTime" value={task.szacowany_czas} onChange={handleChange} required /></label>
      <button type="submit">Zapisz</button>
    </form>
  );
};
