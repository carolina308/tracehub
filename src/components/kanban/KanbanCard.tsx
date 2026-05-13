import { useState } from "react";
import type { Task } from "./KanbanBoard";
import type { ID, Evidence } from "../../types/api";
import { api } from "../../services/api";
import ChangeStatusModal from "./ChangeStatusModal";
import { Upload, Download, FileText, Trash2 } from "lucide-react";

interface ColumnOption {
  id: ID;
  name: string;
}

interface Props {
  task: Task;
  columns: ColumnOption[];
  onMoveTask: (taskId: ID, targetColumnId: ID) => void;
}

const KanbanCard = ({ task, columns, onMoveTask }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [evidence, setEvidence] = useState<Evidence[]>(task.evidence || []);
  const [uploading, setUploading] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", String(task.id));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleStatusChange = (taskId: ID, targetColumnId: ID) => {
    onMoveTask(taskId, targetColumnId);
  };

  const handleUploadEvidence = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.uploadEvidence(task.id, file);
      setEvidence(prev => [...prev, { ...result, mimeType: file.type, fileSize: file.size, createdAt: new Date().toISOString() }]);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al subir archivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-grab active:cursor-grabbing"
      >
        {/* CODE + ACTIONS */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-[#2563eb]">
            {task.code}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setShowEvidence(!showEvidence)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-2 py-1.5 rounded-xl transition"
              title="Ver evidencias"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="text-xs bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-xl transition"
            >
              Cambiar Estado
            </button>
          </div>
        </div>

        {/* TITLE */}
        <h3 className="font-semibold text-gray-800 mb-2">
          {task.title}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 mb-5 line-clamp-2">
          {task.description}
        </p>

        {/* EVIDENCE SECTION */}
        {showEvidence && (
          <div className="mb-4 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs font-semibold text-gray-600 mb-2">Evidencias</p>
            
            {evidence.length === 0 && (
              <p className="text-xs text-gray-400 mb-2">Sin evidencias</p>
            )}
            
            <div className="space-y-1 mb-3">
              {evidence.map(ev => (
                <div key={ev.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 text-xs">
                  <span className="text-gray-600 truncate flex-1">{ev.originalName}</span>
                  <div className="flex gap-1">
                    <a
                      href={api.getEvidenceDownloadUrl(ev.id)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Descargar"
                    >
                      <Download size={14} />
                    </a>
                    <button
                      onClick={async () => {
                        if (!confirm('¿Eliminar esta evidencia?')) return;
                        try {
                          await api.deleteEvidence(ev.id);
                          setEvidence(prev => prev.filter(e => e.id !== ev.id));
                        } catch (err) {
                          alert(err instanceof Error ? err.message : 'Error');
                        }
                      }}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <label className={`flex items-center justify-center gap-2 text-xs py-2 rounded-lg cursor-pointer transition ${uploading ? 'bg-gray-200 text-gray-500' : 'bg-[#2563eb]/10 text-[#2563eb] hover:bg-[#2563eb]/20'}`}>
              <Upload size={14} />
              {uploading ? 'Subiendo...' : 'Subir evidencia'}
              <input type="file" className="hidden" onChange={handleUploadEvidence} disabled={uploading} />
            </label>
          </div>
        )}

        {/* TAGS */}
        <div className="flex flex-wrap gap-2 mb-5">
          {task.tags.map((tag) => (
            <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">#{tag}</span>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between">
          <span className={`text-xs px-3 py-1 rounded-xl font-medium ${
            task.priority === "high" ? "bg-red-100 text-red-600" : task.priority === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-600"
          }`}>{task.priority}</span>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-xs">
              {task.assignee.charAt(0)}
            </div>
            <span className="text-sm text-gray-500">{task.assignee}</span>
          </div>
        </div>

        {/* LAST COMMENT */}
        {task.lastComment && (
          <div className="mt-5 bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-xs text-gray-400 mb-1">Último comentario</p>
            <p className="text-sm text-gray-600">{task.lastComment}</p>
          </div>
        )}

        {/* EVIDENCE BADGE */}
        {evidence.length > 0 && !showEvidence && (
          <div className="mt-3 flex items-center gap-1 text-xs text-blue-600">
            <FileText size={12} />
            <span>{evidence.length} archivo{evidence.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

      {/* MODAL */}
      {openModal && (
        <ChangeStatusModal
          taskId={task.id}
          currentColumnId={columns.find(c => c.name === task.status)?.id ?? columns[0]?.id ?? 0}
          columns={columns}
          onClose={() => setOpenModal(false)}
          onConfirm={handleStatusChange}
        />
      )}
    </>
  );
};

export default KanbanCard;