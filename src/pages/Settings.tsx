import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, Bell, Lock, Info, LogOut } from 'lucide-react';

const inputClass = "w-full border border-gray-200 rounded-md px-2.5 py-1.5 text-[11px] outline-none focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]/20 transition-all";

const Settings = () => {
  const navigate = useNavigate();
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const userName = user ? [user.firstName, user.middleName, user.lastName, user.secondLastName].filter(Boolean).join(' ') : '';

  const [notifications, setNotifications] = useState(() => localStorage.getItem('tracehub_notifications') !== 'false');
  const [saved, setSaved] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handleSaveNotifications = () => {
    localStorage.setItem('tracehub_notifications', String(notifications));
    setSaved('Preferencias guardadas');
    setTimeout(() => setSaved(''), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user'); localStorage.removeItem('tracehub_selected_board');
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPasswordError(''); setPasswordSuccess('');
    if (newPassword !== confirmPassword) { setPasswordError('Las contraseñas no coinciden'); return; }
    if (newPassword.length < 8) { setPasswordError('Mínimo 8 caracteres'); return; }
    setChangingPassword(true);
    try {
      const result = await api.changePassword(currentPassword, newPassword);
      setPasswordSuccess(result.message || 'Contraseña actualizada');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) { setPasswordError(err instanceof Error ? err.message : 'Error'); }
    finally { setChangingPassword(false); }
  };

  const sections = [
    {
      id: 'profile', icon: User, title: 'Perfil',
      content: (
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 p-2.5 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-sm font-bold">
              {((userName || user?.email || 'U').charAt(0)).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-xs">{userName || 'Usuario'}</p>
              <p className="text-[11px] text-gray-600">{user?.email || ''}</p>
            </div>
          </div>
          <p className="text-[11px] text-gray-600">Tus datos se gestionan desde el registro.</p>
        </div>
      ),
    },
    {
      id: 'notifications', icon: Bell, title: 'Notificaciones',
      content: (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[11px]">Actualizaciones en tiempo real</p>
              <p className="text-[10px] text-gray-600">Recibir cambios al instante</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} className="sr-only peer" />
              <div className="w-7 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#2563eb]"></div>
            </label>
          </div>
          <button onClick={handleSaveNotifications} className="bg-[#2563eb] text-white px-3 py-1.5 rounded-md text-[11px] hover:bg-[#1d4ed8] active:scale-[0.97]">Guardar</button>
        </div>
      ),
    },
    {
      id: 'password', icon: Lock, title: 'Cambiar Contraseña',
      content: (
        <form onSubmit={handleChangePassword} className="space-y-2">
          {passwordError && <div className="bg-red-50 border border-red-200 text-red-700 text-[11px] p-2 rounded-md">{passwordError}</div>}
          {passwordSuccess && <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] p-2 rounded-md">{passwordSuccess}</div>}
          <div><label className="block text-[11px] font-semibold mb-0.5">Actual</label><input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className={inputClass} /></div>
          <div><label className="block text-[11px] font-semibold mb-0.5">Nueva</label><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className={inputClass} /></div>
          <div><label className="block text-[11px] font-semibold mb-0.5">Confirmar</label><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className={inputClass} /></div>
          <button type="submit" disabled={changingPassword} className="bg-[#2563eb] text-white px-3 py-1.5 rounded-md text-[11px] hover:bg-[#1d4ed8] active:scale-[0.97] disabled:opacity-50">{changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}</button>
        </form>
      ),
    },
    {
      id: 'about', icon: Info, title: 'Acerca de',
      content: (
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span className="text-gray-600">App</span><span className="font-semibold">TraceHub</span></div>
          <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span className="text-gray-600">Versión</span><span className="font-semibold">1.0.0</span></div>
          <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span className="text-gray-600">Frontend</span><span className="font-semibold">React + Vite</span></div>
          <div className="flex justify-between p-2 bg-gray-50 rounded-md"><span className="text-gray-600">Backend</span><span className="font-semibold">Express + Prisma</span></div>
        </div>
      ),
    },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-3">
      <div className="mb-3">
        <p className="text-[10px] text-gray-600 mb-0.5">Ajustes</p>
        <h1 className="text-sm font-bold text-[#2563eb]">Configuración</h1>
      </div>
      {saved && <div className="bg-green-50 border border-green-200 text-green-700 text-[11px] p-2 rounded-md mb-2">{saved}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg p-2.5 shadow-sm h-fit">
          <nav className="space-y-0.5">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium transition ${
                  activeSection === s.id ? 'bg-[#2563eb] text-white shadow-sm' : 'text-gray-800 hover:bg-gray-100'
                }`}>
                  <Icon size={13} /> {s.title}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-100 mt-2 pt-2">
            <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] font-medium text-red-600 hover:bg-red-50 transition">
              <LogOut size={13} /> Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            {sections.filter(s => s.id === activeSection).map(s => {
              const Icon = s.icon;
              return (
                <div key={s.id}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="p-1 bg-[#2563eb]/10 rounded-md">
                      <Icon size={14} className="text-[#2563eb]" />
                    </div>
                    <h2 className="text-xs font-bold">{s.title}</h2>
                  </div>
                  {s.content}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
