import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import CreateTaskModal from "./CreateTaskModal";
import { useKanban } from "../../hooks/useKanban";
import { api } from "../../services/api";
import type { ID } from "../../types/api";
import { Priority } from "../../types/api";
import { Plus, Layout } from "lucide-react";

interface KanbanBoardProps { boardId?: ID; }

export interface Task {
  id: ID; code: string; title: string; description: string; priority: "low" | "medium" | "high";
  acceptance?: string; assignee: string; assigneeId: ID | null; tags: string[]; points: number;
  status?: string; lastComment?: string; evidenceName?: string; evidence: any[]; updatedAt?: Date | string;
}

interface Column { id: ID; title: string; tasks: Task[]; }

const priorityMap: Record<string, "low" | "medium" | "high"> = { LOW: "low", MEDIUM: "medium", HIGH: "high", URGENT: "high" };
const priorityMapReverse: Record<string, Priority> = { low: Priority.LOW, medium: Priority.MEDIUM, high: Priority.HIGH };

const KanbanBoard = ({ boardId }: KanbanBoardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [creatingColumn, setCreatingColumn] = useState(false);

  const { board, columns: apiColumns, loading, error, createRequirement, moveRequirement, assignRequirement, refetch } = useKanban(boardId);

  const columns: Column[] = apiColumns.map(col => ({
    id: col.id, title: col.name,
    tasks: col.requirements.map(req => ({
      id: req.id, code: `REQ-${req.id}`, title: req.title, description: req.description || "",
      priority: priorityMap[req.priority] || "medium", acceptance: undefined,
      assignee: req.assignee ? [req.assignee.firstName, req.assignee.middleName, req.assignee.lastName, req.assignee.secondLastName].filter(Boolean).join(' ') : "Sin asignar",
      assigneeId: req.assignee?.id ?? null, tags: [], points: 0, status: req.column?.name || '', evidence: req.evidence || [], updatedAt: req.updatedAt,
    })),
  }));

  const members = board?.members ?? [];
  const handleMoveTask = (taskId: ID, targetColumnId: ID) => moveRequirement(taskId, targetColumnId, columns.find(c => c.id === targetColumnId)?.tasks.length ?? 0);
  const handleCreateTask = async (task: { title: string; description: string; priority: "low" | "medium" | "high" }) => {
    const firstColumnId = columns[0]?.id;
    if (!firstColumnId) { alert("No hay columnas disponibles."); return; }
    await createRequirement(firstColumnId, task.title, task.description, priorityMapReverse[task.priority]);
    setOpenModal(false);
  };
  const handleCreateColumn = async () => {
    if (!newColumnName.trim() || !boardId) return;
    setCreatingColumn(true);
    try { await api.createColumn(boardId, newColumnName.trim()); await refetch(); setNewColumnName(""); setShowCreateColumn(false); }
    catch (err) { alert(err instanceof Error ? err.message : "Error"); }
    finally { setCreatingColumn(false); }
  };

  if (loading) return <div className="p-4 flex items-center justify-center min-h-[200px]"><div className="w-5 h-5 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" /></div>;
  if (error) return (
    <div className="p-4 text-center">
      <p className="text-red-500 text-[11px] mb-2">{error}</p>
      <button onClick={() => refetch()} className="bg-[#2563eb] text-white px-3 py-1.5 rounded-md text-[11px]">Reintentar</button>
    </div>
  );

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] text-gray-500 mb-0.5">Tablero</p>
          <h1 className="text-sm font-bold text-[#2563eb]">{board?.name || "Tablero"}</h1>
          {board?.description && <p className="text-gray-600 text-[11px]">{board.description}</p>}
        </div>
        {columns.length > 0 && (
          <button onClick={() => setOpenModal(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-md font-semibold text-[11px] flex items-center gap-1 active:scale-[0.98]">
            <Plus size={12} /> Nuevo
          </button>
        )}
      </div>

      {columns.length > 0 ? (
        <div className="grid grid-cols-5 gap-2 mt-3">
          {columns.map(col => (
            <KanbanColumn key={col.id} column={col} allColumns={apiColumns.map(c => ({ id: c.id, name: c.name }))}
              moveTask={handleMoveTask} onAddTask={() => setOpenModal(true)} members={members}
              onAssignTask={(taskId, assigneeId) => assignRequirement(taskId, assigneeId)} />
          ))}
          <button onClick={() => setShowCreateColumn(true)} className="flex items-center gap-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-2.5 py-1.5 rounded-lg text-[11px] transition">
            <Plus size={12} /> Columna
          </button>
        </div>
      ) : (
        <div className="text-center py-12">
          <Layout size={36} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-600 text-[11px] mb-3">Este tablero no tiene columnas.</p>
          <button onClick={() => setShowCreateColumn(true)} className="bg-[#2563eb] text-white px-4 py-1.5 rounded-md font-semibold text-[11px]">Crear Primera Columna</button>
        </div>
      )}

      {openModal && columns.length > 0 && <CreateTaskModal onClose={() => setOpenModal(false)} onCreate={handleCreateTask} />}

      {showCreateColumn && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[320px] shadow-xl">
            <h2 className="text-sm font-bold mb-3 text-[#2563eb]">Nueva Columna</h2>
            <input type="text" value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Nombre de la columna" className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-[11px] mb-3 outline-none focus:border-[#2563eb]" autoFocus onKeyDown={(e) => e.key === "Enter" && handleCreateColumn()} />
            <div className="flex justify-end gap-2">
              <button onClick={() => { setShowCreateColumn(false); setNewColumnName(""); }} className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-[11px]">Cancelar</button>
              <button onClick={handleCreateColumn} disabled={!newColumnName.trim() || creatingColumn} className="bg-[#2563eb] text-white px-3 py-1.5 rounded-md text-[11px] disabled:opacity-50">{creatingColumn ? "Creando..." : "Crear"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
