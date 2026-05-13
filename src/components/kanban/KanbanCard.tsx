import { useState } from "react";
import type { Task } from "./KanbanBoard";
import type { ID, Evidence, BoardMember } from "../../types/api";
import { api } from "../../services/api";
import ChangeStatusModal from "./ChangeStatusModal";
import { Upload, Download, FileText, Trash2 } from "lucide-react";

interface Props {
  task: Task;
  columns: { id: ID; name: string }[];
  onMoveTask: (taskId: ID, targetColumnId: ID) => void;
  members?: BoardMember[];
  onAssignTask?: (taskId: ID, assigneeId: ID | null) => void;
}

const KanbanCard = ({ task, columns, onMoveTask, members, onAssignTask }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>(task.evidence || []);
  const [uploading, setUploading] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", String(task.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleUploadEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await api.uploadEvidence(task.id, file);
      setEvidence(prev => [...prev, { ...result, mimeType: file.type, fileSize: file.size, createdAt: new Date().toISOString() }]);
    } catch (err) { alert(err instanceof Error ? err.message : 'Error'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  return (
    <>
      <div draggable onDragStart={handleDragStart}
        className="bg-white rounded-lg p-2.5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-grab active:cursor-grabbing">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[9px] font-bold text-[#2563eb]">{task.code}</p>
          <div className="flex gap-0.5">
            <button onClick={() => setShowEvidence(!showEvidence)} className="text-[9px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-md transition" title="Evidencias">
              <FileText size={10} />
            </button>
            <button onClick={() => setOpenModal(true)} className="text-[9px] bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-1.5 py-0.5 rounded-md transition">
              Estado
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 text-[11px] mb-1 leading-tight">{task.title}</h3>
        <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">{task.description}</p>

        {showEvidence && (
          <div className="mb-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
            <p className="text-[9px] font-semibold text-gray-600 mb-1">Evidencias</p>
            {evidence.length === 0 && <p className="text-[9px] text-gray-400 mb-1">Sin evidencias</p>}
            <div className="space-y-0.5 mb-1">
              {evidence.map(ev => (
                <div key={ev.id} className="flex items-center justify-between bg-white rounded px-1.5 py-1 text-[9px]">
                  <span className="text-gray-600 truncate flex-1">{ev.originalName}</span>
                  <div className="flex gap-0.5">
                    <a href={api.getEvidenceDownloadUrl(ev.id)} target="_blank" rel="noopener noreferrer" className="p-0.5 text-blue-600 hover:bg-blue-50 rounded"><Download size={10} /></a>
                    <button onClick={async () => {
                      if (!confirm('¿Eliminar?')) return;
                      try { await api.deleteEvidence(ev.id); setEvidence(prev => prev.filter(e => e.id !== ev.id)); } catch (err) { alert('Error'); }
                    }} className="p-0.5 text-red-500 hover:bg-red-50 rounded"><Trash2 size={10} /></button>
                  </div>
                </div>
              ))}
            </div>
            <label className={`flex items-center justify-center gap-1 text-[9px] py-1 rounded-md cursor-pointer transition ${uploading ? 'bg-gray-200 text-gray-500' : 'bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20'}`}>
              <Upload size={10} /> {uploading ? 'Subiendo...' : 'Subir'}
              <input type="file" className="hidden" onChange={handleUploadEvidence} disabled={uploading} />
            </label>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-medium ${
            task.priority === "high" ? "bg-red-100 text-red-600" : task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600"
          }`}>{task.priority}</span>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[8px] font-bold">
              {task.assignee.charAt(0)}
            </div>
            <span className="text-[9px] text-gray-500 truncate max-w-[60px]">{task.assignee}</span>
          </div>
        </div>

        {task.lastComment && (
          <div className="mt-2 bg-gray-50 rounded-lg p-2 border border-gray-100">
            <p className="text-[9px] text-gray-400 mb-0.5">Comentario</p>
            <p className="text-[10px] text-gray-600">{task.lastComment}</p>
          </div>
        )}

        {evidence.length > 0 && !showEvidence && (
          <div className="mt-1.5 flex items-center gap-1 text-[9px] text-blue-600">
            <FileText size={10} />
            <span>{evidence.length} archivo{evidence.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {openModal && (
        <ChangeStatusModal
          taskId={task.id}
          currentColumnId={columns.find(c => c.name === task.status)?.id ?? columns[0]?.id ?? 0}
          columns={columns} onClose={() => setOpenModal(false)}
          onConfirm={handleStatusChange} members={members}
          currentAssigneeId={task.assigneeId} onAssign={onAssignTask}
        />
      )}
    </>
  );

  function handleStatusChange(taskId: ID, targetColumnId: ID) { onMoveTask(taskId, targetColumnId); }
};

export default KanbanCard;
