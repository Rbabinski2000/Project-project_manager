import { Story } from "@/src/services/storyServices";
import { Task } from "@/src/services/taskServices";
import { useState } from "react";






export default function EditView(task:Task|null,activeStory:Story){
    const [form,setForm]=useState<Task>(task)
    


    return(
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
            </div>
    );

}