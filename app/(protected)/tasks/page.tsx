'use client'
import { Priority, State, Story} from '@/app/Model/Types/StoriesTypes';
import {TaskService } from '@/src/services/taskServices';
import {Task} from "@/app/Model/Tasks"

//import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

import { Role, User, UserService } from '@/src/services/userServices';
import { useStory } from '@/app/context/activeSContext';
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

    const [user,setUser]=useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [readOnly,setReadOnly]=useState<Boolean>(true)

    useEffect(() => {
      const fetchUsers = async () => {
        const fetchedUsers = await userService.getUsers();
        setUsers(fetchedUsers);
        const user=await userService.getCurrentUser();
      
      setUser(user)
      };

      fetchUsers();
    }, []);

    useEffect(() => {
      const timeout = setTimeout(() => {
        if (!activeStory) {
          router.push("/stories");
        }
      }, 300); // wait 300ms before redirecting
    
      return () => clearTimeout(timeout);
       
    }, [activeStory]);
    useEffect(()=>{
        if(user?.rola==Role.guest){
          setReadOnly(false)
        }else{
          setReadOnly(true)
        }
      },[user])

     useEffect(() => {
  if (activeStory) {
    const init = async () => {
      
      const tasks = await taskService.getStoryTasks(activeStory.id);
      setTasks(tasks);

      setForm({
        id: "",
        nazwa: "",
        opis: "",
        priorytet: Priority.niski,
        historia: activeStory!,
        historiaId:activeStory.id,
        szacowany_czas: 0,
        status: State.todo,
        data_dodania: new Date().toISOString(),
      });

      setLoading(false); // Set loading to false after initialization
    };

    init();
  }
}, [activeStory]);
    
      const refreshTask = async () => {
        if (activeStory) {
          setTasks(await taskService.getStoryTasks(activeStory.id));
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

  const handleDelete = async (id: string) => {
    await taskService.deleteTask(id);
    await refreshTask();
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
  const handleEditSubmit = async (e: React.FormEvent) => {
    if (!editForm || !activeStory) return;
    e.preventDefault();
    
    
     try {
      console.log(editForm.przypisany_uzytkownik)
      if(editForm.przypisany_uzytkownik=='0'){
        await taskService.removeUser(editForm.id);
      }else if (editForm.przypisany_uzytkownik !== undefined) {
        const user = await userService.getById(editForm.przypisany_uzytkownik);
        if (user?.id) {
          await taskService.assignUser(editForm.id, user.id); // ✅ Await this
        }
      } else {
        await taskService.updateTask(editForm); // ✅ Also await this
      }

      await refreshTask(); // ✅ Wait for tasks to update before rendering
      setEdit(false);
    }catch (err) {
    console.error("Error submitting edit:", err);
  }
  }
  const handleDone = async (id:string)=>{
    await taskService.markDone(id)
    
    //console.log(taskService.getStoryTasks(activeStory.id))
    await refreshTask();
    setEdit(false);
  }


  if (loading || !activeStory || !form) {
    //console.log(activeStory,form)
    return <p className="text-center text-gray-500">Ładowanie danych historii...</p>;
  }

  const filteredTasks = filter === "all" ? tasks : tasks.filter((s) => s.status == filter);
  return (
    
    <div className="p-6 max-w-3xl mx-auto">

      {editing ?(detailView(editForm!,handleEditChange,handleEditSubmit,handleDone,users)):

      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Zarządzanie zadaniami Historii - {activeStory.nazwa}</h1>


        {/* Story Form */}
        {readOnly ==true ?(
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
        ):<span></span>}
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
              {readOnly ==true ?(
                <div>
                  <Button onClick={() => handleEdit(task)} className="text-yellow-500 mr-2">Edytuj</Button>
                  <Button onClick={() => handleDelete(task.id)} className="text-red-500">Usuń</Button>
                </div>
              ):<span></span>}
            </li>
          ))}
        </ul>
      </div>
      }
    </div>
  );
};
function detailView(
  form: Task,
  handleEditChange,
  handleEditSubmit,
  handleDone,
  users: User[]
){
  //console.log(users)
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
            <option value='0'>Brak przypisu</option>
              {users.map((user)=>(
                <option key={user.id}value={user.id}>{user.imie} {user.nazwisko}</option>
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