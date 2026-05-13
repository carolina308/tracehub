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
    if (id) setSearchParams({ boardId: String(id) });
    else setSearchParams({});
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsData = await api.getBoards();
        setBoards(boardsData);
        if (boardsData.length > 0) {
          const boardIdParam = searchParams.get('boardId');
          const validBoard = boardsData.find(b => b.id === Number(boardIdParam));
          if (!boardIdParam || !validBoard) setSearchParams({ boardId: String(boardsData[0].id) });
        }
      } catch (err) { console.error("Error fetching boards:", err); }
      finally { setLoading(false); }
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
      setShowCreateModal(false); setNewBoardName(""); setNewBoardDesc("");
    } catch (err) { console.error("Error creating board:", err); alert(err instanceof Error ? err.message : "Error creating board"); }
    finally { setCreating(false); }
  };

  const btnClass = "bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-md font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-[11px]";

  if (loading) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb]">
      <div className="bg-white border-b border-slate-200/50 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-medium text-gray-600">Tablero:</label>
            <select value={selectedBoardId ?? ""} onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)}
              className="border border-gray-200 rounded-md px-2 py-1.5 bg-white min-w-[150px] text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20">
              {boards.length === 0 && <option value="">Sin tableros</option>}
              {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <button onClick={() => setShowCreateModal(true)} className={btnClass}>
            <Plus size={12} className="inline mr-0.5" />Nuevo Tablero
          </button>
        </div>
        {boards.length === 0 && (
          <div className="mt-2 text-center text-gray-500 py-2">
            <Layout size={24} className="mx-auto mb-1 text-gray-300" />
            <p className="text-[11px]">No tenés tableros todavía.</p>
          </div>
        )}
      </div>

      {selectedBoardId ? <KanbanBoard boardId={selectedBoardId} />
      : boards.length === 0 ? (
        <div className="p-6 text-center">
          <h2 className="text-sm font-bold text-gray-600 mb-2">Bienvenido a TraceHub</h2>
          <p className="text-gray-500 text-[11px] mb-3">Creá tu primer tablero.</p>
          <button onClick={() => setShowCreateModal(true)} className={btnClass}>Crear Primer Tablero</button>
        </div>
      ) : null}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[340px] shadow-xl">
            <h2 className="text-sm font-bold text-[#2563eb] mb-3">Nuevo Tablero</h2>
            <div className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Nombre *</label>
                <input type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="Ej: Proyecto Principal" className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20" autoFocus />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-0.5">Descripción</label>
                <textarea value={newBoardDesc} onChange={(e) => setNewBoardDesc(e.target.value)} placeholder="Descripción..." className="w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 h-14 resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setShowCreateModal(false); setNewBoardName(""); setNewBoardDesc(""); }} className="px-3 py-1.5 rounded-md border border-gray-200 hover:bg-gray-50 text-[11px] font-medium active:scale-[0.98]">Cancelar</button>
              <button onClick={handleCreateBoard} disabled={!newBoardName.trim() || creating} className={btnClass}>{creating ? "Creando..." : "Crear"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
