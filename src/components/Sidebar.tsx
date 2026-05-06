import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  BiMenuAltLeft,
  BiMenuAltRight,
  BiGridAlt,
  BiListUl,
  BiHistory,
  BiCheckShield,
  BiGroup,
  BiCog,
  BiLogOut
} from 'react-icons/bi';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: 'Tablero', path: '/', icon: <BiGridAlt /> },
    { name: 'Requerimientos', path: '/registrar-requisito', icon: <BiListUl /> },
    { name: 'Registrar cambios', path: '/registrar-cambios', icon: <BiHistory /> },
    { name: 'Calidad', path: '/validar-calidad', icon: <BiCheckShield /> },
    { name: 'Grupo', path: '/team', icon: <BiGroup /> },
    { name: 'Ajustes', path: '/settings', icon: <BiCog /> }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r
        transition-all duration-300 z-50 flex flex-col
        ${collapsed ? 'w-[70px]' : 'w-[240px]'}
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-5">
        {!collapsed && (
          <div>
            <h1 className="text-lg font-bold text-blue-900 dark:text-white">
              TRACEHUB
            </h1>
            <p className="text-xs text-slate-500">Agile Command</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl text-slate-500 hover:text-blue-600"
        >
          {collapsed ? <BiMenuAltRight /> : <BiMenuAltLeft />}
        </button>
      </div>

      {/* MENU */}
      <nav className="flex-1 px-2 space-y-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-200
                ${
                  active
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-800'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>

              {!collapsed && (
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          <BiLogOut />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;