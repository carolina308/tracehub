import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import CreateTaskModal from "./CreateTaskModal";
import { useKanban } from "../../hooks/useKanban";
import { api } from "../../services/api";
import type { ID } from "../../types/api";
import { Priority } from "../../types/api";
import { Plus, Layout } from "lucide-react";

interface KanbanBoardProps {
  boardId?: ID;
}

export interface Task {
  id: ID;
  code: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  acceptance?: string;
  assignee: string;
  assigneeId: ID | null;
  tags: string[];
  points: number;
  status?: string;
  lastComment?: string;
  evidenceName?: string;
  evidence: any[];
  updatedAt?: Date | string;
}

interface Column {
  id: ID;
  title: string;
  tasks: Task[];
}

const priorityMap: Record<string, "low" | "medium" | "high"> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "high",
};

const priorityMapReverse: Record<string, Priority> = {
  low: Priority.LOW,
  medium: Priority.MEDIUM,
  high: Priority.HIGH,
};

const KanbanBoard = ({ boardId }: KanbanBoardProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [showCreateColumn, setShowCreateColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [creatingColumn, setCreatingColumn] = useState(false);

  const {
    board,
    columns: apiColumns,
    loading,
    error,
    createRequirement,
    moveRequirement,
    assignRequirement,
    refetch,
  } = useKanban(boardId);

  // Convert API columns to KanbanColumn format
  const columns: Column[] = apiColumns.map(col => ({
    id: col.id,
    title: col.name,
    tasks: col.requirements.map(req => ({
      id: req.id,
      code: `REQ-${req.id}`,
      title: req.title,
      description: req.description || "",
      priority: priorityMap[req.priority] || "medium",
      acceptance: undefined,
      assignee: req.assignee ? [req.assignee.firstName, req.assignee.middleName, req.assignee.lastName, req.assignee.secondLastName].filter(Boolean).join(' ') : "Sin asignar",
      assigneeId: req.assignee?.id ?? null,
      tags: [],
      points: 0,
      status: req.column?.name || '',
      evidence: req.evidence || [],
      updatedAt: req.updatedAt,
    })),
  }));

  const members = board?.members ?? [];

  /* MOVE TASK */
  const handleMoveTask = (taskId: ID, targetColumnId: ID) => {
    const targetCol = columns.find(c => c.id === targetColumnId);
    const position = targetCol ? targetCol.tasks.length : 0;
    moveRequirement(taskId, targetColumnId, position);
  };

  /* CREATE TASK */
  const handleCreateTask = async (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
  }) => {
    const firstColumnId = columns[0]?.id;
    if (!firstColumnId) {
      alert("No hay columnas disponibles. Crea una columna primero.");
      return;
    }
    
    await createRequirement(
      firstColumnId,
      task.title,
      task.description,
      priorityMapReverse[task.priority]
    );
    setOpenModal(false);
  };

  /* CREATE COLUMN */
  const handleCreateColumn = async () => {
    if (!newColumnName.trim() || !boardId) return;
    
    setCreatingColumn(true);
    try {
      await api.createColumn(boardId, newColumnName.trim());
      await refetch();
      setNewColumnName("");
      setShowCreateColumn(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error creating column");
    } finally {
      setCreatingColumn(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Cargando tablero...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="bg-[#2563eb] text-white px-4 py-2 rounded-xl transition-all duration-200 hover:bg-[#1d4ed8] active:scale-[0.97]"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-sm text-gray-400 mb-2">
            Tablero
          </p>
          <h1 className="text-4xl font-bold text-[#2563eb]">
            {board?.name || "Tablero"}
          </h1>
          {board?.description && (
            <p className="text-gray-500 mt-2">{board.description}</p>
          )}
        </div>

        <div className="flex gap-3">
          {columns.length > 0 && (
          <button
            onClick={() => setOpenModal(true)}
            className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
          >
            <Plus size={20} />
            Nuevo Requisito
          </button>
          )}
        </div>
      </div>

      {/* KANBAN */}
      {columns.length > 0 ? (
        <div className="grid grid-cols-5 gap-5 mt-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              allColumns={apiColumns.map(c => ({ id: c.id, name: c.name }))}
              moveTask={handleMoveTask}
              onAddTask={() => setOpenModal(true)}
              members={members}
              onAssignTask={(taskId, assigneeId) => assignRequirement(taskId, assigneeId)}
            />
          ))}

          {/* Add Column Button */}
          <div className="flex items-start pt-4">
            <button
                onClick={() => setShowCreateColumn(true)}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.97] w-full"
              >
                <Plus size={20} />
                <span>Nueva Columna</span>
              </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-20">
          <Layout size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Sin columnas
          </h2>
          <p className="text-gray-500 mb-6">
            Este tablero no tiene columnas todavía.
          </p>
          <button
            onClick={() => setShowCreateColumn(true)}
              className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Crear Primera Columna
          </button>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {openModal && columns.length > 0 && (
        <CreateTaskModal
          onClose={() => setOpenModal(false)}
          onCreate={handleCreateTask}
        />
      )}

      {/* CREATE COLUMN MODAL */}
      {showCreateColumn && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-[#2563eb]">
              Nueva Columna
            </h2>

            <input
              type="text"
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              placeholder="Nombre de la columna (ej: Por Hacer)"
              className="w-full border rounded-lg p-3 mb-4"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreateColumn()}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateColumn(false);
                  setNewColumnName("");
                }}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateColumn}
                disabled={!newColumnName.trim() || creatingColumn}
                className="bg-[#2563eb] text-white px-5 py-2 rounded-lg disabled:opacity-50"
              >
                {creatingColumn ? "Creando..." : "Crear"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;