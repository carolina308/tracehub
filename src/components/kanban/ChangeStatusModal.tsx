import { useState } from "react";
import type { ID, BoardMember } from "../../types/api";
import { ArrowRight } from "lucide-react";

interface Props {
  taskId: ID;
  currentColumnId: ID;
  columns: { id: ID; name: string }[];
  onClose: () => void;
  onConfirm: (taskId: ID, targetColumnId: ID) => void;
  members?: BoardMember[];
  currentAssigneeId?: ID | null;
  onAssign?: (taskId: ID, assigneeId: ID | null) => void;
}

const ChangeStatusModal = ({ taskId, currentColumnId, columns, onClose, onConfirm, members, currentAssigneeId, onAssign }: Props) => {
  const [selectedColumnId, setSelectedColumnId] = useState(currentColumnId);
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<ID | "">(currentAssigneeId ?? "");
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (selectedColumnId !== currentColumnId) onConfirm(taskId, selectedColumnId);
    if (selectedAssigneeId !== (currentAssigneeId ?? "") && onAssign) onAssign(taskId, selectedAssigneeId === "" ? null : Number(selectedAssigneeId));
    onClose();
  };

  const selectClass = "w-full border border-gray-300 rounded-md p-2 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-[340px] shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-[#2563eb]/10 rounded-md">
            <ArrowRight size={14} className="text-[#2563eb]" />
          </div>
          <div>
            <h2 className="text-xs font-bold">{taskId ? `REQ-${taskId}` : ''}</h2>
            <p className="text-[10px] text-gray-600">Mover a otra columna</p>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-[11px] font-semibold mb-0.5">Nuevo Estado</label>
          <select value={selectedColumnId} onChange={(e) => setSelectedColumnId(Number(e.target.value))} className={selectClass}>
            {columns.map(col => (
              <option key={col.id} value={col.id}>{col.name} {col.id === currentColumnId ? "(actual)" : ""}</option>
            ))}
          </select>
        </div>

        {members && members.length > 0 && (
          <div className="mb-3">
            <label className="block text-[11px] font-semibold mb-0.5">Responsable</label>
            <select value={selectedAssigneeId} onChange={(e) => setSelectedAssigneeId(e.target.value === "" ? "" : Number(e.target.value))} className={selectClass}>
              <option value="">Sin asignar</option>
              {members.map(m => (
                <option key={m.user.id} value={m.user.id}>
                  {[m.user.firstName, m.user.middleName, m.user.lastName, m.user.secondLastName].filter(Boolean).join(" ")} ({m.user.email}) - {m.role}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-[11px] font-semibold mb-0.5">Comentario</label>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Describe los cambios..." className={`${selectClass} resize-none`} />
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-[11px] font-medium active:scale-[0.98]">Cancelar</button>
          <button onClick={handleSubmit} disabled={selectedColumnId === currentColumnId && selectedAssigneeId === (currentAssigneeId ?? "")}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 py-1.5 rounded-md text-[11px] font-semibold active:scale-[0.98] disabled:opacity-50">Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default ChangeStatusModal;
