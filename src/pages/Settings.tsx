import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { User, Bell, Lock, Info, LogOut } from 'lucide-react';

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tracehub_selected_board');
    navigate('/login');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setChangingPassword(true);
    try {
      const result = await api.changePassword(currentPassword, newPassword);
      setPasswordSuccess(result.message || 'Contraseña actualizada');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Error al cambiar contraseña');
    } finally {
      setChangingPassword(false);
    }
  };

  const sections = [
    {
      id: 'profile',
      icon: User,
      title: 'Perfil',
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 rounded-full bg-[#1e3a8a] text-white flex items-center justify-center text-2xl font-bold">
              {((userName || user?.email || 'U').charAt(0)).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-lg">{userName || 'Usuario'}</p>
              <p className="text-sm text-gray-500">{user?.email || ''}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Tus datos se gestionan desde el registro.</p>
        </div>
      ),
    },
    {
      id: 'notifications',
      icon: Bell,
      title: 'Notificaciones',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">Actualizaciones en tiempo real</p>
              <p className="text-sm text-gray-500">Recibir cambios de otros miembros al instante</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2563eb]"></div>
            </label>
          </div>
          <button
            onClick={handleSaveNotifications}
            className="bg-[#2563eb] text-white px-5 py-2 rounded-xl text-sm hover:bg-[#1d4ed8] transition-all duration-300 active:scale-[0.97]"
          >
            Guardar
          </button>
        </div>
      ),
    },
    {
      id: 'password',
      icon: Lock,
      title: 'Cambiar Contraseña',
      content: (
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passwordError && <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{passwordError}</div>}
          {passwordSuccess && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm">{passwordSuccess}</div>}
          <div>
            <label className="block text-sm font-semibold mb-1.5">Contraseña actual</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Nueva contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={8} className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1.5">Confirmar nueva contraseña</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all" />
          </div>
          <button type="submit" disabled={changingPassword} className="bg-[#2563eb] text-white px-5 py-2 rounded-xl text-sm hover:bg-[#1d4ed8] transition-all duration-300 active:scale-[0.97] disabled:opacity-50">
            {changingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
          </button>
        </form>
      ),
    },
    {
      id: 'about',
      icon: Info,
      title: 'Acerca de',
      content: (
        <div className="space-y-3 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">Aplicación</span>
            <span className="font-semibold">TraceHub</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">Versión</span>
            <span className="font-semibold">1.0.0</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">Frontend</span>
            <span className="font-semibold">React + Vite</span>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">Backend</span>
            <span className="font-semibold">Express + Prisma + Socket.io</span>
          </div>
        </div>
      ),
    },
  ];

  const [activeSection, setActiveSection] = useState(sections[0].id);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-10">
      <div className="mb-8">
        <p className="text-sm text-gray-400 mb-2">Ajustes</p>
        <h1 className="text-4xl font-bold text-[#2563eb] tracking-tight">Configuración</h1>
        <p className="text-gray-500 mt-2">Preferencias de la aplicación</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl mb-5">{saved}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-3xl p-4 shadow-sm h-fit">
          <nav className="space-y-1">
            {sections.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    activeSection === s.id ? 'bg-[#2563eb] text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {s.title}
                </button>
              );
            })}
          </nav>
          <div className="border-t border-gray-100 mt-4 pt-4">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200">
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {sections.filter(s => s.id === activeSection).map(s => {
              const Icon = s.icon;
              return (
                <div key={s.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-[#2563eb]/10 rounded-xl">
                      <Icon size={24} className="text-[#2563eb]" />
                    </div>
                    <h2 className="text-2xl font-bold">{s.title}</h2>
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
