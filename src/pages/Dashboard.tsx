import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import KanbanBoard from "../components/kanban/KanbanBoard";
import { api } from "../services/api";
import type { Board, ID } from "../types/api";
import { Plus, Layout } from "lucide-react";

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState("");
  const [newBoardDesc, setNewBoardDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const selectedBoardId: ID | null = (() => {
    const param = searchParams.get('boardId');
    return param ? Number(param) : null;
  })();

  const setSelectedBoardId = (id: ID | null) => {
    if (id) {
      setSearchParams({ boardId: String(id) });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await api.getBoards();
        setBoards(boardsData);
        if (boardsData.length > 0) {
          const boardIdParam = searchParams.get('boardId');
          const validBoard = boardsData.find(b => b.id === Number(boardIdParam));
          if (!boardIdParam || !validBoard) {
            setSearchParams({ boardId: String(boardsData[0].id) });
          }
        }
      } catch (err) {
        console.error("Error fetching boards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim()) return;
    setCreating(true);
    try {
      const newBoard = await api.createBoard(newBoardName.trim(), newBoardDesc.trim() || undefined);
      setBoards(prev => [newBoard, ...prev]);
      setSelectedBoardId(newBoard.id);
      setShowCreateModal(false);
      setNewBoardName("");
      setNewBoardDesc("");
    } catch (err) {
      console.error("Error creating board:", err);
      alert(err instanceof Error ? err.message : "Error creating board");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
          <div className="text-gray-500 text-sm">Cargando tableros...</div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300";

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="bg-white border-b border-slate-200/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600">Tablero:</label>
            <select
              value={selectedBoardId ?? ""}
              onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 bg-white min-w-[250px] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
            >
              {boards.length === 0 && (
                <option value="">Sin tableros</option>
              )}
              {boards.map((board) => (
                <option key={board.id} value={board.id}>
                  {board.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-2.5 rounded-xl hover:bg-[#1d4ed8] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            Nuevo Tablero
          </button>
        </div>

        {boards.length === 0 && (
          <div className="mt-6 text-center text-gray-500 py-4">
            <Layout size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No tenés tableros todavía.</p>
            <p className="text-sm">Creá uno para comenzar.</p>
          </div>
        )}
      </div>

      {selectedBoardId ? (
        <KanbanBoard boardId={selectedBoardId} />
      ) : boards.length === 0 ? (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Bienvenido a TraceHub
          </h2>
          <p className="text-gray-500 mb-6">
            Creá tu primer tablero para comenzar a gestionar requisitos.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            Crear Primer Tablero
          </button>
        </div>
      ) : null}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[450px] shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-[#2563eb] mb-6">
              Nuevo Tablero
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Nombre del tablero *
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Ej: Proyecto Principal"
                  className={inputClass}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  placeholder="Descripción del tablero..."
                  className={`${inputClass} h-24 resize-none`}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName("");
                  setNewBoardDesc("");
                }}
                className="px-5 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 font-medium transition-all duration-200 active:scale-[0.98]"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim() || creating}
                className="bg-[#2563eb] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#1d4ed8] transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
              >
                {creating ? "Creando..." : "Crear Tablero"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
