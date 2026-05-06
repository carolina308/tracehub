import { useState } from "react";
import type { Task } from "./KanbanBoard";

interface Props {
  task: Task;
  onClose: () => void;
  onConfirm: (
    taskId: string,
    status: string,
    comment: string,
    evidence: File | null
  ) => void;
}

const statuses = [
  "backlog",
  "todo",
  "progress",
  "qa",
  "done",
];

const ChangeStatusModal = ({
  task,
  onClose,
  onConfirm,
}: Props) => {
  const [status, setStatus] = useState(task.status || "backlog");

  const [comment, setComment] = useState("");

  const [evidence, setEvidence] = useState<File | null>(
    null
  );

  const handleSubmit = () => {
    onConfirm(task.id, status, comment, evidence);

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-[550px] shadow-2xl">
        {/* HEADER */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#2563eb]">
            Cambiar Estado
          </h2>

          <p className="text-gray-500 mt-2">
            {task.title}
          </p>
        </div>

        {/* STATUS */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Nuevo Estado
          </label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>
                {s.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* COMMENT */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Comentario
          </label>

          <textarea
            value={comment}
            onChange={(e) =>
              setComment(e.target.value)
            }
            rows={5}
            placeholder="Describe los cambios realizados..."
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
          />
        </div>

        {/* EVIDENCE */}
        <div className="mb-8">
          <label className="block text-sm font-semibold mb-2">
            Evidencia
          </label>

          <input
            type="file"
            onChange={(e) =>
              setEvidence(
                e.target.files?.[0] || null
              )
            }
            className="w-full border border-gray-200 rounded-2xl p-4"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl border border-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl font-semibold transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;