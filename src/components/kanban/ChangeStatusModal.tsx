import { useState } from "react";
import type { ID } from "../../types/api";

interface ColumnOption {
  id: ID;
  name: string;
}

interface Props {
  taskId: ID;
  currentColumnId: ID;
  columns: ColumnOption[];
  onClose: () => void;
  onConfirm: (taskId: ID, targetColumnId: ID) => void;
}

const ChangeStatusModal = ({
  taskId,
  currentColumnId,
  columns,
  onClose,
  onConfirm,
}: Props) => {
  // Default to first different column
  const otherColumns = columns.filter(c => c.id !== currentColumnId);
  const [selectedColumnId, setSelectedColumnId] = useState<ID>(
    otherColumns[0]?.id ?? currentColumnId
  );
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (selectedColumnId !== currentColumnId) {
      onConfirm(taskId, selectedColumnId);
    }
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
            Mover requisito a otra columna
          </p>
        </div>

        {/* STATUS */}
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2">
            Nuevo Estado
          </label>

          <select
            value={selectedColumnId}
            onChange={(e) => setSelectedColumnId(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
          >
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name} {col.id === currentColumnId ? "(actual)" : ""}
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
            onChange={(e) => setComment(e.target.value)}
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
            onChange={(e) => setEvidence(e.target.files?.[0] || null)}
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
            disabled={selectedColumnId === currentColumnId}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl font-semibold transition disabled:opacity-50"
          >
            Mover
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;