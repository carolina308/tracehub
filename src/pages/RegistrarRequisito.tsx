import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Priority } from "../types/api";
import type { Board, ID } from "../types/api";

const inputClass = "w-full border border-gray-200 rounded-md p-2 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all";

const RegistrarRequisito = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<ID | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<ID | null>(null);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchBoards = async () => {
      try { const data = await api.getBoards(); setBoards(data); if (data.length > 0) setSelectedBoardId(data[0].id); }
      catch (err) { setError("Error al cargar tableros: " + (err instanceof Error ? err.message : "")); }
      finally { setLoading(false); }
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    const board = boards.find(b => b.id === selectedBoardId);
    if (board?.columns?.length) setSelectedColumnId(board.columns[0].id);
    else setSelectedColumnId(null);
  }, [selectedBoardId, boards]);

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSuccess("");
    if (!title.trim()) { setError("El título es obligatorio"); return; }
    if (!selectedColumnId) { setError("El tablero no tiene columnas."); return; }
    try {
      await api.createRequirement(selectedColumnId, { title: title.trim(), description: description.trim() || undefined, priority });
      setSuccess("Requisito creado"); setTitle(""); setDescription(""); setPriority(Priority.MEDIUM);
    } catch (err) { setError(err instanceof Error ? err.message : "Error al crear requisito"); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-3">
      <div className="mb-3">
        <p className="text-[10px] text-gray-400 mb-0.5">Requisitos &gt; Nueva Entrada</p>
        <h1 className="text-sm font-bold text-[#2563eb]">Crear Requisito</h1>
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] p-2 rounded-md mb-2">{success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] p-2 rounded-md mb-2">{error}</div>}

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <label className="block text-[10px] font-semibold mb-1 text-gray-700">TABLERO *</label>
          <select value={selectedBoardId ?? ""} onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)} className={inputClass}>
            {boards.length === 0 && <option value="">Sin tableros</option>}
            {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <label className="block text-[10px] font-semibold mb-1 text-gray-700">COLUMNA *</label>
          <select value={selectedColumnId ?? ""} onChange={(e) => setSelectedColumnId(Number(e.target.value) || null)} className={inputClass} disabled={!selectedBoard?.columns?.length}>
            {!selectedBoard ? <option value="">Seleccioná un tablero</option>
            : !selectedBoard.columns?.length ? <option value="">Sin columnas</option>
            : selectedBoard.columns.map(col => <option key={col.id} value={col.id}>{col.name}</option>)}
          </select>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
        <div className="col-span-2 bg-white rounded-lg p-4 shadow-sm">
          <div className="mb-2">
            <label className="block text-[10px] font-semibold mb-1 text-gray-700">NOMBRE *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej: Autenticación con SAML" className={inputClass} />
          </div>
          <div>
            <label className="block text-[10px] font-semibold mb-1 text-gray-700">DESCRIPCIÓN</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Detalle técnico..." className={inputClass} />
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <label className="block text-[10px] font-semibold mb-1 text-gray-700">PRIORIDAD *</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className={inputClass}>
              <option value={Priority.LOW}>Baja</option>
              <option value={Priority.MEDIUM}>Media</option>
              <option value={Priority.HIGH}>Alta</option>
              <option value={Priority.URGENT}>Urgente</option>
            </select>
          </div>
          <div className="bg-gradient-to-br from-[#1e3a8a] to-[#2563eb] text-white rounded-lg p-3">
            <h3 className="font-bold text-xs mb-1">Sugerencia</h3>
            <p className="text-[10px] text-blue-100 leading-relaxed">Según la capacidad del sprint, este requisito puede priorizarse.</p>
          </div>
          <div className="space-y-1">
            <button type="submit" className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-md font-semibold active:scale-[0.98] text-[11px]">Registrar</button>
            <button type="button" className="w-full bg-white border border-gray-200 py-2 rounded-md font-semibold hover:bg-gray-50 active:scale-[0.98] text-[11px]">Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrarRequisito;
