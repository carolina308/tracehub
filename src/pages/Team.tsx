import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Board, BoardMember, ID, User } from '../types/api';
import { UserPlus, Trash2, Shield } from 'lucide-react';

const getUserName = (u: User) => [u.firstName, u.middleName, u.lastName, u.secondLastName].filter(Boolean).join(' ');
const selectClass = "w-full border border-gray-300 rounded-md p-2 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all";

const Team = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<ID | null>(null);
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('MEMBER');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try { const data = await api.getBoards(); setBoards(data); if (data.length > 0) setSelectedBoardId(data[0].id); }
      catch { setError('Error al cargar tableros'); } finally { setLoading(false); }
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    if (!selectedBoardId) return;
    (async () => { try { setMembers(await api.listMembers(selectedBoardId)); } catch { setError('Error al cargar miembros'); } })();
  }, [selectedBoardId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !selectedBoardId) return;
    setAdding(true); setError(''); setSuccess('');
    try {
      await api.addMember(selectedBoardId, newEmail.trim(), newRole);
      setSuccess(`Invitación enviada a ${newEmail.trim()}`);
      setNewEmail(''); setNewRole('MEMBER'); setShowAddForm(false);
      setMembers(await api.listMembers(selectedBoardId));
    } catch (err) { setError(err instanceof Error ? err.message : 'Error'); }
    finally { setAdding(false); }
  };

  const handleRemoveMember = async (userId: ID) => {
    if (!selectedBoardId) return;
    if (!confirm('¿Eliminar este miembro?')) return;
    try { await api.removeMember(selectedBoardId, userId); setMembers(await api.listMembers(selectedBoardId)); setSuccess('Miembro eliminado'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Error'); }
  };

  const handleUpdateRole = async (userId: ID, role: string) => {
    if (!selectedBoardId) return;
    try { await api.updateMemberRole(selectedBoardId, userId, role); setMembers(await api.listMembers(selectedBoardId)); setSuccess('Rol actualizado'); }
    catch (err) { setError(err instanceof Error ? err.message : 'Error'); }
  };

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  if (loading) return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-3">
      <div className="mb-3">
        <p className="text-[10px] text-gray-600 mb-0.5">Equipo</p>
        <h1 className="text-sm font-bold text-[#2563eb]">Gestión del Equipo</h1>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] p-2 rounded-md mb-2">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] p-2 rounded-md mb-2">{success}</div>}

      <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-semibold mb-1 text-gray-800">TABLERO</label>
            <select value={selectedBoardId ?? ''} onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)} className={`${selectClass} max-w-[200px]`}>
              {boards.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <button onClick={() => setShowAddForm(true)} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3 py-1.5 rounded-md font-semibold text-[11px] flex items-center gap-1 active:scale-[0.98]">
            <UserPlus size={12} /> Invitar
          </button>
        </div>
      </div>

      {!selectedBoardId ? <div className="text-center py-4 text-gray-700 text-[11px]">Seleccioná un tablero</div>
      : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="text-xs font-bold mb-3">Miembros ({members.length})</h2>
              {members.length === 0 ? <p className="text-gray-700 text-[11px]">Sin miembros.</p> : (
                <div className="space-y-1.5">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-[10px] font-bold shrink-0">{getUserName(m.user).charAt(0)}</div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold truncate">{getUserName(m.user)}</p>
                          <p className="text-[10px] text-gray-600 truncate">{m.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <select value={m.role} onChange={(e) => handleUpdateRole(m.user.id, e.target.value)} className="border border-gray-300 rounded-md px-1.5 py-0.5 text-[10px] outline-none" disabled={m.role === 'OWNER'}>
                          <option value="MEMBER">Member</option>
                          <option value="VIEWER">Viewer</option>
                          <option value="OWNER">Owner</option>
                        </select>
                        {m.role !== 'OWNER' && (
                          <button onClick={() => handleRemoveMember(m.user.id)} className="p-1 text-red-500 hover:bg-red-50 rounded-md active:scale-[0.9]">
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h2 className="text-xs font-bold mb-2 flex items-center gap-1"><Shield size={12} /> Roles</h2>
              <div className="space-y-1 text-[11px]">
                <div className="p-1.5 bg-gray-50 rounded-md"><p className="font-semibold text-[11px]">OWNER</p><p className="text-[10px] text-gray-600">Control total</p></div>
                <div className="p-1.5 bg-gray-50 rounded-md"><p className="font-semibold text-[11px]">MEMBER</p><p className="text-[10px] text-gray-600">Edita requisitos</p></div>
                <div className="p-1.5 bg-gray-50 rounded-md"><p className="font-semibold text-[11px]">VIEWER</p><p className="text-[10px] text-gray-600">Solo lectura</p></div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm">
              <h2 className="text-xs font-bold mb-2">Info</h2>
              <div className="space-y-0.5 text-[11px]">
                <div className="flex justify-between"><span className="text-gray-600">Tablero</span><span className="font-semibold">{selectedBoard?.name}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Miembros</span><span className="font-semibold">{members.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 w-[360px] shadow-xl">
            <h2 className="text-sm font-bold text-[#2563eb] mb-3">Invitar Miembro</h2>
            <form onSubmit={handleAddMember} className="space-y-2">
              <div>
                <label className="block text-[11px] font-semibold mb-0.5 text-gray-800">Correo electrónico</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="usuario@ejemplo.com" required className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20" autoFocus />
                <p className="text-[10px] text-gray-600 mt-0.5">Debe estar registrado en TraceHub</p>
              </div>
              <div>
                <label className="block text-[11px] font-semibold mb-0.5 text-gray-800">Rol</label>
                <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="w-full border border-gray-300 rounded-md px-2.5 py-1.5 text-[11px] outline-none focus:border-[#2563eb]">
                  <option value="MEMBER">Miembro</option>
                  <option value="VIEWER">Espectador</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setShowAddForm(false); setNewEmail(''); setError(''); }} className="px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 text-[11px] font-medium active:scale-[0.98]">Cancelar</button>
                <button type="submit" disabled={adding || !newEmail.trim()} className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-3.5 py-1.5 rounded-md font-semibold text-[11px] active:scale-[0.98] disabled:opacity-50">{adding ? 'Enviando...' : 'Enviar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
