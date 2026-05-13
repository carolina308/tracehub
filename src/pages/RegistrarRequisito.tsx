import { useState, useEffect } from "react";
import { api } from "../services/api";
import { Priority } from "../types/api";
import type { Board, Requirement, ID } from "../types/api";

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

  // Load boards on mount
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await api.getBoards();
        setBoards(data);
        if (data.length > 0) {
          setSelectedBoardId(data[0].id);
        }
      } catch (err) {
        setError("Error al cargar tableros: " + (err instanceof Error ? err.message : ""));
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  // Reset column when board changes
  useEffect(() => {
    const board = boards.find(b => b.id === selectedBoardId);
    if (board && board.columns && board.columns.length > 0) {
      setSelectedColumnId(board.columns[0].id);
    } else {
      setSelectedColumnId(null);
    }
  }, [selectedBoardId, boards]);

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("El título del requisito es obligatorio");
      return;
    }

    if (!selectedColumnId) {
      setError("El tablero no tiene columnas. Creá una columna primero en el Dashboard.");
      return;
    }

    try {
      await api.createRequirement(selectedColumnId, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
      });

      setSuccess("Requisito creado exitosamente");
      setTitle("");
      setDescription("");
      setPriority(Priority.MEDIUM);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear requisito");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
        <div className="text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      {/* HEADER */}
      <div className="mb-10">
        <p className="text-sm text-gray-400 mb-2">
          Requisitos {" > "} Nueva Entrada
        </p>
        <h1 className="text-5xl font-bold text-[#2563eb]">
          Crear Requisito
        </h1>
        <p className="text-gray-500 mt-4">
          Define un nuevo requisito funcional o técnico para el proyecto.
        </p>
      </div>

      {/* ALERTS */}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-2xl mb-5">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl mb-5">
          {error}
        </div>
      )}

      {/* BOARD & COLUMN SELECTORS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            TABLERO *
          </label>
          <select
            value={selectedBoardId ?? ""}
            onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)}
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
          >
            {boards.length === 0 && <option value="">Sin tableros</option>}
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm">
          <label className="block text-sm font-semibold mb-3 text-gray-700">
            COLUMNA *
          </label>
          <select
            value={selectedColumnId ?? ""}
            onChange={(e) => setSelectedColumnId(Number(e.target.value) || null)}
            className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            disabled={!selectedBoard || !selectedBoard.columns || selectedBoard.columns.length === 0}
          >
            {!selectedBoard ? (
              <option value="">Seleccioná un tablero primero</option>
            ) : !selectedBoard.columns || selectedBoard.columns.length === 0 ? (
              <option value="">El tablero no tiene columnas</option>
            ) : (
              selectedBoard.columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm">
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              NOMBRE DEL REQUISITO *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Autenticación con SAML"
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              DESCRIPCIÓN DETALLADA
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Detalle técnico del requisito..."
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <label className="block text-sm font-semibold mb-3 text-gray-700">
              PRIORIDAD *
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
            >
              <option value={Priority.LOW}>Baja</option>
              <option value={Priority.MEDIUM}>Media</option>
              <option value={Priority.HIGH}>Alta</option>
              <option value={Priority.URGENT}>Urgente</option>
            </select>
          </div>

          <div className="bg-[#1e3a8a] text-white rounded-3xl p-6">
            <h3 className="font-bold text-xl mb-4">Sugerencia</h3>
            <p className="text-sm text-blue-100 leading-7">
              Según la capacidad actual del sprint, este requisito
              puede ser priorizado para desarrollo inmediato.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-4 rounded-2xl font-semibold transition"
            >
              Registrar
            </button>
            <button
              type="button"
              className="w-full bg-white border border-gray-200 py-4 rounded-2xl font-semibold"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrarRequisito;