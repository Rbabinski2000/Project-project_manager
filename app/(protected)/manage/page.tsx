'use client'
import { useState, useEffect } from "react";
import {ProjectService } from "@/src/services/projectServices1";
import { Project } from "@/app/Model/Projects";

import {Role, User, UserService} from "@/src/services/userServices"
import { Button } from "@/components/ui/button";
import { useProject } from "@/app/context/activePContext";
import { useRouter } from "next/navigation";




export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({ id: "", nazwa: "", opis: "" });
  const [editing, setEditing] = useState<boolean>(false);
  const projectService = new ProjectService();

  const userService = new UserService();
  const [user,setUser]=useState<User|null>(null)

  const [readOnly,setReadOnly]=useState<Boolean>(true)
  const {activeProject,setActiveProject}=useProject();

  const router=useRouter();

  const fetchData = async () => {
    const projects = await projectService.getAll();
    setProjects(projects);

    const user = await userService.getCurrentUser();
    setUser(user);

    setActiveProject(activeProject);
  };

  useEffect(() => {
  

  fetchData();

}, []);
  useEffect(()=>{
    if(user?.rola==Role.guest){
      setReadOnly(false)
    }else{
      setReadOnly(true)
    }
  },[user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editing) {
      await projectService.update(form);
    } else {
      await projectService.create({ ...form, id: Date.now().toString() });
    }
    setProjects(await projectService.getAll());
    setForm({ id: "", nazwa: "", opis: "" });
    setEditing(false);
    //router.push("/manage");
  };

  const handleEdit = (project: Project) => {
    setForm(project);
    setEditing(true);
  };

  const handleDelete = async (id: string) => {
    const deleted = await projectService.delete(id);
    const fresh = await projectService.getAll();
    setProjects(fresh);
  };
  const handleSelect = async (project: Project) => {
    setActiveProject(project);
    setProjects([...await projectService.getAll()]); // Refresh the project list
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Użytkownik - {user?.imie}</h1>
      <h1 className="text-2xl font-bold mb-4">Wybrany projekt - {activeProject?.nazwa}</h1>
      <h1 className="text-2xl font-bold mb-4">Zarządzanie projektami</h1>
      {readOnly ==true?(
      <div className="mb-4">
        <input
          type="text"
          name="nazwa"
          value={form.nazwa}
          onChange={handleChange}
          placeholder="Nazwa projektu"
          className="border p-2 w-full mb-2"
        />
        <textarea
          name="opis"
          value={form.opis}
          onChange={handleChange}
          placeholder="Opis projektu"
          className="border p-2 w-full mb-2"
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">
          {editing ? "Aktualizuj" : "Dodaj"}
        </button>
      </div>
      ):<span></span>}
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="border p-2 mb-2 flex justify-between">
            <div>
              <h2 className="font-bold">{project.nazwa}</h2>
              <p>{project.opis}</p>
            </div>
            <div>
              {readOnly ==true?(
                <div>
              <Button onClick={() => handleEdit(project) } className="text-yellow-500 mr-2">Edytuj</Button>
              <Button onClick={() => handleDelete(project.id)} className="text-red-500 mr-2">Usuń</Button>
              </div>
              ):<span></span>}
              {project.id != activeProject?.id ? (
                <Button onClick={() => handleSelect(project)} className="text-blue-500">
                  Wybierz jako aktywny
                </Button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}