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

  // Read selected board from URL
  const selectedBoardId: ID | null = (() => {
    const param = searchParams.get('boardId');
    return param ? Number(param) : null;
  })();

  // Update URL when board is selected
  const setSelectedBoardId = (id: ID | null) => {
    if (id) {
      setSearchParams({ boardId: String(id) });
    } else {
      setSearchParams({});
    }
  };

  // Fetch boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await api.getBoards();
        setBoards(boardsData);
        
        // Auto-select first board if URL has no valid selection
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
  }, []); // Only on mount

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
        <div className="text-gray-500">Cargando tableros...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      {/* Board Selector Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-600">Tablero:</label>
            <select
              value={selectedBoardId ?? ""}
              onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)}
              className="border rounded-lg px-4 py-2 bg-white min-w-[250px]"
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
            className="flex items-center gap-2 bg-[#2563eb] text-white px-4 py-2 rounded-lg hover:bg-[#1d4ed8]"
          >
            <Plus size={18} />
            Nuevo Tablero
          </button>
        </div>

        {boards.length === 0 && (
          <div className="mt-4 text-center text-gray-500">
            <Layout size={48} className="mx-auto mb-2 text-gray-300" />
            <p>No tienes tableros todavía.</p>
            <p className="text-sm">Crea uno para comenzar.</p>
          </div>
        )}
      </div>

      {/* Kanban Board */}
      {selectedBoardId ? (
        <KanbanBoard boardId={selectedBoardId} />
      ) : boards.length === 0 ? (
        <div className="p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Bienvenido a TraceHub
          </h2>
          <p className="text-gray-500 mb-6">
            Crea tu primer tablero para comenzar a gestionar requisitos.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#2563eb] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Crear Primer Tablero
          </button>
        </div>
      ) : null}

      {/* Create Board Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[450px] shadow-xl">
            <h2 className="text-xl font-bold mb-4 text-[#2563eb]">
              Nuevo Tablero
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del tablero *
                </label>
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Ej: Proyecto Principal"
                  className="w-full border rounded-lg p-3"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción (opcional)
                </label>
                <textarea
                  value={newBoardDesc}
                  onChange={(e) => setNewBoardDesc(e.target.value)}
                  placeholder="Descripción del tablero..."
                  className="w-full border rounded-lg p-3 h-20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewBoardName("");
                  setNewBoardDesc("");
                }}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim() || creating}
                className="bg-[#2563eb] text-white px-5 py-2 rounded-lg disabled:opacity-50"
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