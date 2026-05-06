import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BiMenuAltLeft, BiMenuAltRight } from 'react-icons/bi';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      path: '/', 
      icon: 'dashboard' 
    },
    { 
      name: 'Requirements', 
      path: '/registrar-requisito', 
      icon: 'list_alt' 
    },
    { 
      name: 'Change Log', 
      path: '/registrar-cambios', 
      icon: 'history' 
    },
    { 
      name: 'Quality Validation', 
      path: '/validar-calidad', 
      icon: 'fact_check' 
    },
    { 
      name: 'Team', 
      path: '/team', 
      icon: 'groups' 
    },
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: 'settings' 
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col h-full py-4 z-50">
      <div className=\"text-2xl font-extrabold text-blue-900 dark:text-white px-6 py-8\">
        TRACEHUB
        <div className=\"font-['Manrope'] font-semibold text-xs text-slate-500 tracking-normal mt-1\">Agile Command</div>
      </div>
      <nav className=\"flex-1 space-y-1 px-3\">
        {menuItems.map((item) => (
          <a
            key={item.path}
            href={item.path}
            className={\lex items-center gap-3 px-4 py-3 rounded-lg \$\{
              location.pathname === item.path
                ? 'bg-slate-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-400 border-r-4 border-blue-900 dark:border-blue-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            \ transition-all font-['Manrope'] font-semibold text-sm\">
            <span className=\"material-symbols-outlined\" data-icon={item.icon}>
              {item.icon}
            </span>
            <span>{item.name}</span>
          </a>
        ))}
      </nav>
      <div className=\"mt-auto pt-4 px-4\">
        <button 
          onClick={handleLogout}
          className=\"w-full bg-primary text-white py-3 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-opacity-90 transition-all\"
        >
          <span className=\"material-symbols-outlined\">logout</span>
          Salir
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
