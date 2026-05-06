import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (task: any) => void;
}

const CreateTaskModal = ({ onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [assignee, setAssignee] = useState("");

  const handleSubmit = () => {
    if (!title || !description || !assignee) {
      alert("Complete todos los campos");
      return;
    }

    onCreate({
      id: Date.now().toString(),
      code: `TH-${Math.floor(Math.random() * 999)}`,
      title,
      description,
      priority,
      assignee,
      tags: ["frontend"],
      points: 5,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-[#2563eb]">
          Nueva tarea
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg p-3"
          />

          <textarea
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-3 h-28"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-lg p-3"
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>

          <input
            type="text"
            placeholder="Responsable"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="w-full border rounded-lg p-3"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#2563eb] text-white px-5 py-2 rounded-lg"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;