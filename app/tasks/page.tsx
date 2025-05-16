'use client'
import { Priority, State, Story} from '@/src/services/storyServices';
import { Task, TaskService } from '@/src/services/taskServices';

//import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { User, UserService } from '@/src/services/userServices';
import { useStory } from '../context/activeSContext';
import { useRouter } from "next/navigation";


export default function TaskManager() {
    const router = useRouter();
    //const userData = JSON.parse(router.query.data);
    //console.log(router.query)

    const {activeStory}=useStory()
    const taskService=new TaskService();
    const userService=new UserService();
    const [tasks,setTasks]=useState<Task[]>([])
    const [form, setForm] = useState<Task|null>(null);
    const [loading, setLoading] = useState(true);


    const [editing,setEdit]=useState<boolean>(false);
    const [editForm,setEditForm]=useState<Task|null>(null)

    const [filter, setFilter] = useState<State | "all">("all");

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (!activeStory) {
          router.push("/stories");
        }
      }, 300); // wait 300ms before redirecting
    
      return () => clearTimeout(timeout);
       
    }, [activeStory]);
     useEffect(() => {
        if (activeStory) {
          setTasks(taskService.getStoryTasks(activeStory.id));
    
          setForm({
            id:"",
            nazwa: "",
            opis: "",
            priorytet:Priority.niski,
            historia:activeStory ,
            szacowany_czas: 0,
            status: State.todo,
            data_dodania: new Date().toISOString(),
            });
    
          setLoading(false); // Set loading to false after initialization
        }
      }, [activeStory]);
    
      const refreshTask = () => {
        if (activeStory) {
          setTasks(taskService.getStoryTasks(activeStory.id));
        }
      };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (form) {
    setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!form || !activeStory) return;
    e.preventDefault();
    form.status=State.todo;
    
    taskService.addTask({ ...form, id: Date.now().toString()});
    refreshTask();
  };

  const handleDelete = (id: string) => {
    taskService.deleteTask(id);
    refreshTask();
  };
  const handleEdit=(task:Task)=>{
    setEditForm(task);
    setEdit(true);
  }
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (editForm) {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
    }
  };
  const handleEditSubmit = (e: React.FormEvent) => {
    if (!editForm || !activeStory) return;
    e.preventDefault();
    
    
    if(editForm.przypisany_uzytkownik!=undefined){
      
      taskService.assignUserToTask(editForm.id,userService.getById(editForm.przypisany_uzytkownik))
    }else{
      taskService.updateTask(editForm);
    }
    //console.log(editForm)
    refreshTask();
    setEdit(false)
  };
  const handleDone = (id:string)=>{
    taskService.markTaskAsDone(id)
    
    //console.log(taskService.getStoryTasks(activeStory.id))
    refreshTask();
    setEdit(false);
  }


  if (loading || !activeStory || !form) {
    //console.log(activeStory,form)
    return <p className="text-center text-gray-500">Ładowanie danych historii...</p>;
  }

  const filteredTasks = filter === "all" ? tasks : tasks.filter((s) => s.status == filter);
  return (
    
    <div className="p-6 max-w-3xl mx-auto">

      {editing ?(detailView(editForm!,handleEditChange,handleEditSubmit,handleDone)):

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Zarządzanie zadaniami Historii - {activeStory.nazwa}</h1>


        {/* Story Form */}
        <div className="mb-4 border p-4 rounded">
          <input type="text" name="nazwa" value={form.nazwa} onChange={handleChange} placeholder="Nazwa" className="border p-2 w-full mb-2" />
          <textarea name="opis" value={form.opis} onChange={handleChange} placeholder="Opis" className="border p-2 w-full mb-2" />
          <select name="priorytet" value={form.priorytet} onChange={handleChange} className="border p-2 w-full mb-2">
            <option value={Priority.niski}>Niski</option>
            <option value={Priority.sredni}>Średni</option>
            <option value={Priority.wysoki}>Wysoki</option>
          </select>

          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">
            Dodaj
          </button>
        </div>

        {/* Filter Stories */}
        <div className="mb-4">
          <select onChange={(e) => setFilter(e.target.value as State | "all")} value={filter} className="border p-2 w-full">
            <option value="all">Wszystkie</option>
            <option value={State.todo}>Czekające na wykonanie</option>
            <option value={State.doing}>Aktualnie wykonywane</option>
            <option value={State.done}>Zamknięte</option>
          </select>
        </div>

        {/* Story List */}
        <ul>
          {filteredTasks.map((task) => (
            <li key={task.id} className="border p-2 mb-2 flex justify-between">
              <div>
                <h2 className="font-bold">{task.nazwa}</h2>
                <p>{task.opis}</p>
                <p className="text-sm text-gray-500">{task.data_dodania}</p>
                <span className={`px-2 py-1 rounded text-white ${task.status === State.todo ? "bg-yellow-500" : task.status === State.doing ? "bg-blue-500" : "bg-green-500"}`}>
                  {task.status.toString().toUpperCase()}
                </span>
              </div>
              <div>
                <Button onClick={() => handleEdit(task)} className="text-yellow-500 mr-2">Edytuj</Button>
                <Button onClick={() => handleDelete(task.id)} className="text-red-500">Usuń</Button>

              </div>
            </li>
          ))}
        </ul>
      </div>
      }
    </div>
  );
};
function detailView(form:Task,handleEditChange,handleEditSubmit,handleDone){
  const userService=new UserService();
  const users:User[]=userService.getUsers();
  return(
    <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Zarządzanie zadaniem  - {form.nazwa} o id-{form.id}</h1>
    
    
          {/* task Form */}
          <div className="mb-4 border p-4 rounded">
            nazwa:<input type="text" name="nazwa" value={form.nazwa} onChange={handleEditChange} placeholder="Nazwa" className="border p-2 w-full mb-2" />
            opis:<textarea name="opis" value={form.opis} onChange={handleEditChange} placeholder="Opis" className="border p-2 w-full mb-2" />
            Priorytet:<select name="priorytet" value={form.priorytet} onChange={handleEditChange} className="border p-2 w-full mb-2">
              <option value={Priority.niski}>Niski</option>
              <option value={Priority.sredni}>Średni</option>
              <option value={Priority.wysoki}>Wysoki</option>
            </select>

            Status:{form.status.valueOf()}
            <br/>
            Użytkownik:
            <select name="przypisany_uzytkownik" value={form.przypisany_uzytkownik} onChange={handleEditChange} className="border p-2 w-full mb-2">
            <option value="0">Brak przypisu</option>
              {users.map((user)=>(
                <option value={user.id}>{user.imie} {user.nazwisko}</option>
              ))}
            </select>
            <button onClick={()=>handleDone(form.id)} className="bg-red-500 text-white px-4 py-2">
              Zakończ zadanie
            </button> 
             <button onClick={handleEditSubmit} className="bg-blue-500 text-white px-4 py-2">
              Aktualizuj
            </button> 
          </div>
        </div>
);
}