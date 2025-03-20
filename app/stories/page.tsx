"use client";
import { useState, useEffect } from "react";
import { Story, StoryService, State, Priority } from "@/src/services/storyServices";
import { Button } from "@/components/ui/button";

export default function StoryManager() {
  const storyService = new StoryService();
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState<State | "all">("all");

  // Story form state
  const [form, setForm] = useState<Story>({
    id: "",
    nazwa: "",
    opis: "",
    priorytet: Priority.niski,
    projekt: null,
    data_utworzenia: new Date().toISOString(),
    stan: State.todo,
    wlasciciel: "",
  });
  const [editing, setEditing] = useState(false);

  // Load stories from storage on mount
  useEffect(() => {
    setStories(storyService.getAll());
  }, []);

  const refreshStories = () => {
    setStories(storyService.getAll());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editing) {
      storyService.update(form);
    } else {
      storyService.create({ ...form, id: Date.now().toString() });
    }
    refreshStories();
    setForm({
      id: "",
      nazwa: "",
      opis: "",
      priorytet: Priority.niski,
      projekt: null,
      data_utworzenia: new Date().toISOString(),
      stan: State.todo,
      wlasciciel: "",
    });
    setEditing(false);
  };

  const handleEdit = (story: Story) => {
    setForm(story);
    setEditing(true);
  };

  const handleDelete = (id: string) => {
    storyService.delete(id);
    refreshStories();
  };

  // Filter stories based on state
  const filteredStories = filter === "all" ? stories : stories.filter((s) => s.stan === filter);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Zarządzanie Historyjkami</h1>

      {/* Filter Stories */}
      <div className="mb-4">
        <select onChange={(e) => setFilter(e.target.value as State | "all")} value={filter} className="border p-2 w-full">
          <option value="all">Wszystkie</option>
          <option value={State.todo}>Czekające na wykonanie</option>
          <option value={State.doing}>Aktualnie wykonywane</option>
          <option value={State.done}>Zamknięte</option>
        </select>
      </div>

      {/* Story Form */}
      <div className="mb-4 border p-4 rounded">
        <input type="text" name="nazwa" value={form.nazwa} onChange={handleChange} placeholder="Nazwa" className="border p-2 w-full mb-2" />
        <textarea name="opis" value={form.opis} onChange={handleChange} placeholder="Opis" className="border p-2 w-full mb-2" />
        <select name="priorytet" value={form.priorytet} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value={Priority.niski}>Niski</option>
          <option value={Priority.sredni}>Średni</option>
          <option value={Priority.wysoki}>Wysoki</option>
        </select>
        <select name="stan" value={form.stan} onChange={handleChange} className="border p-2 w-full mb-2">
          <option value={State.todo}>To Do</option>
          <option value={State.doing}>Doing</option>
          <option value={State.done}>Done</option>
        </select>
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">
          {editing ? "Aktualizuj" : "Dodaj"}
        </button>
      </div>

      {/* Story List */}
      <ul>
        {filteredStories.map((story) => (
          <li key={story.id} className="border p-2 mb-2 flex justify-between">
            <div>
              <h2 className="font-bold">{story.nazwa}</h2>
              <p>{story.opis}</p>
              <p className="text-sm text-gray-500">{story.data_utworzenia}</p>
              <span className={`px-2 py-1 rounded text-white ${story.stan === State.todo ? "bg-yellow-500" : story.stan === State.doing ? "bg-blue-500" : "bg-green-500"}`}>
                {story.stan.toString().toUpperCase()}
              </span>
            </div>
            <div>
              <Button onClick={() => handleEdit(story)} className="text-yellow-500 mr-2">Edytuj</Button>
              <Button onClick={() => handleDelete(story.id)} className="text-red-500">Usuń</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
