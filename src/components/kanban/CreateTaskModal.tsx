import { useState } from "react";

interface Props {
  onClose: () => void;
  onCreate: (task: { title: string; description: string; priority: "low" | "medium" | "high" }) => void;
}

const CreateTaskModal = ({ onClose, onCreate }: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = () => {
    if (!title.trim()) { alert("El título es obligatorio"); return; }
    onCreate({ title: title.trim(), description: description.trim(), priority });
    onClose();
  };

  const inputClass = "w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-[340px] shadow-xl">
        <h2 className="text-sm font-bold mb-3 text-[#2563eb]">Nuevo Requisito</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-[11px] font-semibold text-gray-800 mb-0.5">Título *</label>
            <input type="text" placeholder="Título del requisito" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} autoFocus />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-800 mb-0.5">Descripción</label>
            <textarea placeholder="Descripción..." value={description} onChange={(e) => setDescription(e.target.value)} className={`${inputClass} h-20 resize-none`} />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-gray-800 mb-0.5">Prioridad</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")} className={inputClass}>
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-[11px] font-medium active:scale-[0.98]">Cancelar</button>
          <button onClick={handleSubmit} className="bg-[#2563eb] text-white px-3.5 py-1.5 rounded-md text-[11px] font-semibold active:scale-[0.98]">Crear</button>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
