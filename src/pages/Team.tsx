import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Board, BoardMember, ID, User } from '../types/api';
import { UserPlus, Trash2, Shield } from 'lucide-react';

const getUserName = (u: User) => [u.firstName, u.middleName, u.lastName, u.secondLastName].filter(Boolean).join(' ');

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
      try {
        const data = await api.getBoards();
        setBoards(data);
        if (data.length > 0) setSelectedBoardId(data[0].id);
      } catch {
        setError('Error al cargar tableros');
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  useEffect(() => {
    if (!selectedBoardId) return;
    const fetchMembers = async () => {
      try {
        const data = await api.listMembers(selectedBoardId);
        setMembers(data);
      } catch {
        setError('Error al cargar miembros');
      }
    };
    fetchMembers();
  }, [selectedBoardId]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !selectedBoardId) return;
    setAdding(true);
    setError('');
    setSuccess('');

    try {
      await api.addMember(selectedBoardId, newEmail.trim(), newRole);
      setSuccess(`Invitación enviada a ${newEmail.trim()}`);
      setNewEmail('');
      setNewRole('MEMBER');
      setShowAddForm(false);
      const updated = await api.listMembers(selectedBoardId);
      setMembers(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agregar miembro');
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (userId: ID) => {
    if (!selectedBoardId) return;
    if (!confirm('¿Estás seguro de eliminar este miembro?')) return;
    try {
      await api.removeMember(selectedBoardId, userId);
      const updated = await api.listMembers(selectedBoardId);
      setMembers(updated);
      setSuccess('Miembro eliminado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar miembro');
    }
  };

  const handleUpdateRole = async (userId: ID, role: string) => {
    if (!selectedBoardId) return;
    try {
      await api.updateMemberRole(selectedBoardId, userId, role);
      const updated = await api.listMembers(selectedBoardId);
      setMembers(updated);
      setSuccess('Rol actualizado');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar rol');
    }
  };

  const selectedBoard = boards.find(b => b.id === selectedBoardId);

  const selectClass = "w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">Equipo</p>
        <h1 className="text-4xl font-bold text-[#2563eb] tracking-tight">Gestión del Equipo</h1>
        <p className="text-gray-500 mt-2">Administrá los miembros de cada tablero</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-5">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-5">{success}</div>
      )}

      <div className="bg-white rounded-3xl p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 text-gray-700">TABLERO</label>
            <select
              value={selectedBoardId ?? ''}
              onChange={(e) => setSelectedBoardId(Number(e.target.value) || null)}
              className={`${selectClass} max-w-md`}
            >
              {boards.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-[#2563eb] text-white px-5 py-3 rounded-2xl hover:bg-[#1d4ed8] font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <UserPlus size={20} />
            Invitar Miembro
          </button>
        </div>
      </div>

      {!selectedBoardId ? (
        <div className="text-center py-10 text-gray-500">Seleccioná un tablero</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6">
                Miembros ({members.length})
              </h2>
              {members.length === 0 ? (
                <p className="text-gray-500">No hay miembros en este tablero.</p>
              ) : (
                <div className="space-y-4">
                  {members.map(m => (
                    <div key={m.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl transition-all duration-200 hover:shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-lg font-bold">
                          {getUserName(m.user).charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{getUserName(m.user)}</p>
                          <p className="text-sm text-gray-500">{m.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <select
                          value={m.role}
                          onChange={(e) => handleUpdateRole(m.user.id, e.target.value)}
                          className="border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#2563eb] transition"
                          disabled={m.role === 'OWNER'}
                        >
                          <option value="MEMBER">Member</option>
                          <option value="VIEWER">Viewer</option>
                          <option value="OWNER">Owner</option>
                        </select>
                        {m.role !== 'OWNER' && (
                          <button
                            onClick={() => handleRemoveMember(m.user.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-[0.9]"
                            title="Eliminar miembro"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Shield size={20} />
                Roles
              </h2>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-semibold">OWNER</p>
                  <p className="text-gray-500">Dueño del tablero. Control total.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-semibold">MEMBER</p>
                  <p className="text-gray-500">Puede ver y editar requisitos.</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-semibold">VIEWER</p>
                  <p className="text-gray-500">Solo lectura.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Acerca de</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Tablero</span>
                  <span className="font-semibold">{selectedBoard?.name}</span>
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

      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[480px] shadow-xl">
            <h2 className="text-2xl font-bold text-[#2563eb] mb-6">Invitar Miembro</h2>
            <form onSubmit={handleAddMember} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Correo electrónico del usuario
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  required
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-2">
                  El usuario debe estar registrado en TraceHub
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Rol</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all duration-300"
                >
                  <option value="MEMBER">Miembro</option>
                  <option value="VIEWER">Espectador</option>
                </select>
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setNewEmail(''); setError(''); }}
                  className="px-5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all duration-200 active:scale-[0.98]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={adding || !newEmail.trim()}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
                >
                  {adding ? 'Enviando...' : 'Enviar Invitación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;
