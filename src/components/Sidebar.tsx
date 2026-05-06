import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: 'dashboard' },
    { name: 'Kanban', path: '/kanban', icon: 'view_kanban' },
    { name: 'Requirements', path: '/registrar-requisito', icon: 'list_alt' },
    { name: 'Change Log', path: '/registrar-cambios', icon: 'history' },
    { name: 'Quality Validation', path: '/validar-calidad', icon: 'fact_check' },
    { name: 'Team', path: '/team', icon: 'groups' },
    { name: 'Settings', path: '/settings', icon: 'settings' }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r bg-white flex flex-col py-4">
      <div className="text-2xl font-bold px-6 py-6">TRACEHUB</div>

      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-4 py-2 rounded ${
              location.pathname === item.path
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }`}
          >
            {item.name}
          </button>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="m-4 bg-red-500 text-white py-2 rounded"
      >
        Salir
      </button>
    </aside>
  );
};

export default Sidebar;