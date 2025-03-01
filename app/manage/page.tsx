'use client'
import { useState, useEffect } from "react";
import { Project, ProjectService } from "../../src/services/projectServices1";





export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<Project>({ id: "", nazwa: "", opis: "" });
  const [editing, setEditing] = useState<boolean>(false);
  const projectService = new ProjectService();

  useEffect(() => {
    setProjects(projectService.getAll());
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editing) {
      projectService.update(form);
    } else {
      projectService.create({ ...form, id: Date.now().toString() });
    }
    setProjects(projectService.getAll());
    setForm({ id: "", nazwa: "", opis: "" });
    setEditing(false);
  };

  const handleEdit = (project: Project) => {
    setForm(project);
    setEditing(true);
  };

  const handleDelete = (id: string) => {
    projectService.delete(id);
    setProjects(projectService.getAll());
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zarządzanie projektami</h1>
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
      <ul>
        {projects.map((project) => (
          <li key={project.id} className="border p-2 mb-2 flex justify-between">
            <div>
              <h2 className="font-bold">{project.nazwa}</h2>
              <p>{project.opis}</p>
            </div>
            <div>
              <button onClick={() => handleEdit(project)} className="text-yellow-500 mr-2">Edytuj</button>
              <button onClick={() => handleDelete(project.id)} className="text-red-500">Usuń</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}