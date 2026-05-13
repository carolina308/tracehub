import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Board, Requirement, BoardMember, ID, User } from '../types/api';

const getUserName = (u: User) => [u.firstName, u.middleName, u.lastName, u.secondLastName].filter(Boolean).join(' ');
const selectClass = "w-full border border-gray-300 rounded-md p-2 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all";

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

  useEffect(() => {
    const fetchData = async () => {
      try { const data = await api.getBoards(); setBoards(data); if (data.length > 0) setSelectedBoardId(data[0].id); }
      catch { setError('Error al cargar tableros'); } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedBoardId) return;
    const fetchBoardData = async () => {
      setLoading(true); setError('');
      try { const [bd, md] = await Promise.all([api.getBoard(selectedBoardId), api.listMembers(selectedBoardId)]);
        setBoardRequirements(bd.columns.flatMap(col => col.requirements)); setMembers(md); }
      catch { setError('Error al cargar datos'); } finally { setLoading(false); }
    };
    fetchBoardData();
  }, [selectedBoardId]);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requisitoSeleccionado || !usuarioSeleccionado) return;
    setAsignando(true); setError(''); setSuccess('');
    try {
      await api.assignRequirement(Number(requisitoSeleccionado), Number(usuarioSeleccionado));
      setSuccess('Requisito asignado');
      const [bd, md] = await Promise.all([api.getBoard(selectedBoardId!), api.listMembers(selectedBoardId!)]);
      setBoardRequirements(bd.columns.flatMap(col => col.requirements)); setMembers(md);
      setRequisitoSeleccionado(''); setUsuarioSeleccionado('');
    } catch (err) { setError(err instanceof Error ? err.message : 'Error al asignar'); }
    finally { setAsignando(false); }
  };

  const unassignedReqs = boardRequirements.filter(r => !r.assignee);
  const assignedReqs = boardRequirements.filter(r => r.assignee);

  if (loading && boardRequirements.length === 0) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-3">
      <div className="mb-3">
        <p className="text-[10px] text-gray-500 mb-0.5">Requisitos &gt; Asignar</p>
        <h1 className="text-sm font-bold text-[#2563eb]">Asignar Requisitos</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] p-2 rounded-md mb-2">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] p-2 rounded-md mb-2">{success}</div>}

      <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
        <label className="block text-[10px] font-semibold mb-1 text-gray-800">TABLERO</label>
        <select value={selectedBoardId ?? ''} onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)} className={selectClass}>
          {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {!selectedBoardId ? <div className="text-center py-4 text-gray-600 text-[11px]">Seleccioná un tablero</div>
      : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xs font-bold mb-3">Configurar Asignación</h2>
              <form onSubmit={handleAssign} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold mb-0.5">Requisito</label>
                  <select value={requisitoSeleccionado} onChange={(e) => setRequisitoSeleccionado(e.target.value)} required className={selectClass}>
                    <option value="">Seleccionar...</option>
                    {boardRequirements.map(req => {
                      const member = members.find(m => m.user.id === req.assignee?.id);
                      return (<option key={req.id} value={req.id}>
                        #{req.id} - {req.title} ({req.column?.name ?? ''}) {req.assignee ? `- ${member ? getUserName(member.user) : `ID ${req.assignee.id}`}` : '- Sin asignar'}
                      </option>);
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold mb-0.5">Responsable</label>
                  <select value={usuarioSeleccionado} onChange={(e) => setUsuarioSeleccionado(e.target.value)} required className={selectClass}>
                    <option value="">Seleccionar...</option>
                    {members.map(m => <option key={m.user.id} value={m.user.id}>{getUserName(m.user)} ({m.user.email}) - {m.role}</option>)}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={asignando || !requisitoSeleccionado || !usuarioSeleccionado}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 py-1.5 rounded-md font-semibold active:scale-[0.98] text-[11px] disabled:opacity-50">
                    {asignando ? 'Asignando...' : 'Confirmar'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm mt-3">
              <h2 className="text-xs font-bold mb-3">Requisitos ({boardRequirements.length})</h2>
              {boardRequirements.length === 0 ? <p className="text-gray-600 text-[11px]">No hay requisitos.</p> : (
                <div className="space-y-1.5">
                  {boardRequirements.map(req => {
                    const member = members.find(m => m.user.id === req.assignee?.id);
                    return (
                      <div key={req.id} className="border border-gray-100 rounded-lg p-2.5 hover:shadow-sm">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold text-[#2563eb] mb-0.5">#{req.id} · {req.column?.name ?? ''}</p>
                            <h3 className="font-semibold text-gray-900 text-[11px] truncate">{req.title}</h3>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium ${
                              req.priority === 'HIGH' || req.priority === 'URGENT' ? 'bg-red-100 text-red-600'
                              : req.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                            }`}>{req.priority}</span>
                            {req.assignee ? <p className="text-[10px] text-gray-600 mt-0.5">{member ? getUserName(member.user) : ''}</p>
                            : <p className="text-[10px] text-gray-500 mt-0.5">Sin asignar</p>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h2 className="text-xs font-bold mb-2">Miembros</h2>
              {members.length === 0 ? <p className="text-gray-600 text-[11px]">Sin miembros</p> : (
                <div className="space-y-1">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-md">
                      <div className="w-6 h-6 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[9px] font-bold">{getUserName(m.user).charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold truncate">{getUserName(m.user)}</p>
                        <span className="text-[10px] px-1 py-0.5 rounded-full bg-blue-100 text-blue-700">{m.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h2 className="text-xs font-bold mb-2">Resumen</h2>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-semibold">{boardRequirements.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Asignados</span><span className="font-semibold text-green-600">{assignedReqs.length}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Sin asignar</span><span className="font-semibold text-orange-600">{unassignedReqs.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsignarRequisitos;
