import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }) => void;
}

const CreateTaskModal = ({ onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("El título es obligatorio");
      return;
    }

    onCreate({
      title: title.trim(),
      description: description.trim(),
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[500px] shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-[#2563eb]">
          Nuevo Requisito
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título *
            </label>
            <input
              type="text"
              placeholder="Título del requisito"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded-lg p-3"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              placeholder="Descripción del requisito..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-3 h-28"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
              className="w-full border rounded-lg p-3"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-50"
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