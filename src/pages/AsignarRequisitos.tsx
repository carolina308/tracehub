import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Board, Requirement, BoardMember, ID } from '../types/api';

const AsignarRequisitos = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<ID | null>(null);
  const [boardRequirements, setBoardRequirements] = useState<Requirement[]>([]);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [requisitoSeleccionado, setRequisitoSeleccionado] = useState('');
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');
  const [loading, setLoading] = useState(true);
  const [asignando, setAsignando] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Load boards on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const boardsData = await api.getBoards();
        setBoards(boardsData);
        if (boardsData.length > 0) {
          setSelectedBoardId(boardsData[0].id);
        }
      } catch (err) {
        setError('Error al cargar tableros');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // When board changes, load requirements and members
  useEffect(() => {
    if (!selectedBoardId) return;

    const fetchBoardData = async () => {
      setLoading(true);
      setError('');
      try {
        const [boardData, membersData] = await Promise.all([
          api.getBoard(selectedBoardId),
          api.listMembers(selectedBoardId),
        ]);

        // Collect all requirements from all columns
        const allReqs = boardData.columns.flatMap(col => col.requirements);
        setBoardRequirements(allReqs);
        setMembers(membersData);
      } catch (err) {
        setError('Error al cargar datos del tablero');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [selectedBoardId]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requisitoSeleccionado || !usuarioSeleccionado) return;

    setAsignando(true);
    setError('');
    setSuccess('');

    try {
      await api.assignRequirement(
        Number(requisitoSeleccionado),
        Number(usuarioSeleccionado)
      );

      setSuccess('Requisito asignado exitosamente');

      // Refresh data
      const [boardData, membersData] = await Promise.all([
        api.getBoard(selectedBoardId!),
        api.listMembers(selectedBoardId!),
      ]);
      setBoardRequirements(boardData.columns.flatMap(col => col.requirements));
      setMembers(membersData);

      setRequisitoSeleccionado('');
      setUsuarioSeleccionado('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al asignar requisito');
    } finally {
      setAsignando(false);
    }
  };

  // Flatten all requirements into a list for status display
  const unassignedReqs = boardRequirements.filter(r => !r.assignee);
  const assignedReqs = boardRequirements.filter(r => r.assignee);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">
          Requisitos {' > '} Asignar
        </p>
        <h1 className="text-4xl font-bold text-[#2563eb]">Asignar Requisitos</h1>
        <p className="text-gray-500 mt-2">
          Vinculá responsables a los requisitos del proyecto
        </p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-2xl mb-5">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-300 text-green-700 p-4 rounded-2xl mb-5">{success}</div>
      )}

      {/* Board Selector */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <label className="block text-sm font-semibold mb-3 text-gray-700">TABLERO</label>
        <select
          value={selectedBoardId ?? ''}
          onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)}
          className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
        >
          {boards.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando...</div>
      ) : !selectedBoardId ? (
        <div className="text-center py-10 text-gray-500">Seleccioná un tablero</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Assign Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">Configurar Asignación</h2>
              <form onSubmit={handleAssign} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Requisito</label>
                  <select
                    value={requisitoSeleccionado}
                    onChange={(e) => setRequisitoSeleccionado(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
                  >
                    <option value="">Seleccionar requisito...</option>
                    {unassignedReqs.map(req => (
                      <option key={req.id} value={req.id}>
                        #{req.id} - {req.title} ({req.column?.name ?? ''})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Responsable</label>
                  <select
                    value={usuarioSeleccionado}
                    onChange={(e) => setUsuarioSeleccionado(e.target.value)}
                    required
                    className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb]"
                  >
                    <option value="">Seleccionar usuario...</option>
                    {members.map(m => (
                      <option key={m.user.id} value={m.user.id}>
                        {m.user.name} ({m.user.email}) - {m.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="submit"
                    disabled={asignando || !requisitoSeleccionado || !usuarioSeleccionado}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl font-semibold disabled:opacity-50"
                  >
                    {asignando ? 'Asignando...' : 'Confirmar Asignación'}
                  </button>
                </div>
              </form>
            </div>

            {/* Requirements List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
              <h2 className="text-xl font-bold mb-6">
                Requisitos ({boardRequirements.length})
              </h2>

              {boardRequirements.length === 0 ? (
                <p className="text-gray-500">No hay requisitos en este tablero.</p>
              ) : (
                <div className="space-y-4">
                  {boardRequirements.map(req => {
                    const member = members.find(m => m.user.id === req.assignee?.id);
                    return (
                      <div key={req.id} className="border border-gray-100 rounded-2xl p-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs font-bold text-[#2563eb] mb-1">
                              #{req.id} · {req.column?.name ?? ''}
                            </p>
                            <h3 className="font-semibold text-gray-800">{req.title}</h3>
                            {req.description && (
                              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{req.description}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`text-xs px-3 py-1 rounded-xl font-medium ${
                              req.priority === 'HIGH' || req.priority === 'URGENT'
                                ? 'bg-red-100 text-red-600'
                                : req.priority === 'MEDIUM'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-600'
                            }`}>
                              {req.priority}
                            </span>
                            {req.assignee && (
                              <p className="text-xs text-gray-500 mt-2">
                                {member ? member.user.name : `ID ${req.assignee.id}`}
                              </p>
                            )}
                            {!req.assignee && (
                              <p className="text-xs text-gray-400 mt-2">Sin asignar</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right: Members */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Miembros del tablero</h2>
              {members.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin miembros</p>
              ) : (
                <div className="space-y-3">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold">
                        {m.user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{m.user.name}</p>
                        <p className="text-xs text-gray-500">{m.user.email}</p>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          {m.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Resumen</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total requisitos</span>
                  <span className="font-semibold">{boardRequirements.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Asignados</span>
                  <span className="font-semibold text-green-600">{assignedReqs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sin asignar</span>
                  <span className="font-semibold text-orange-600">{unassignedReqs.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Miembros</span>
                  <span className="font-semibold">{members.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsignarRequisitos;