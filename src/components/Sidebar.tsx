import {
  LayoutDashboard,
  ClipboardList,
  History,
  ShieldCheck,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menu = [
    {
      name: "Tablero",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      name: "Requerimientos",
      icon: ClipboardList,
      path: "/register-requirement",
    },
    {
      name: "Registrar cambios",
      icon: History,
      path: "/historial",
    },
    {
      name: "Calidad",
      icon: ShieldCheck,
      path: "/qa",
    },
    {
      name: "Grupo",
      icon: Users,
      path: "/team",
    },
    {
      name: "Ajustes",
      icon: Settings,
      path: "/settings",
    },
  ];

  return (
    <aside className="w-[230px] min-h-screen bg-[#081028] flex flex-col justify-between border-r border-[#1e293b]">
      {/* TOP */}
      <div>
        {/* LOGO */}
        <div className="p-8">
          <h1 className="text-5xl font-bold text-[#2563eb]">
            TRACEHUB
          </h1>

          <p className="text-gray-500 text-sm mt-4">
            Agile Command
          </p>
        </div>

        {/* MENU */}
        <nav className="px-4 space-y-3">
          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${
                  active
                    ? "bg-[#172554] text-white"
                    : "text-gray-400 hover:bg-[#111827]"
                }`}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-4">
        <button className="w-full bg-red-500 hover:bg-red-600 transition-all text-white rounded-2xl py-4 flex items-center justify-center gap-3 font-semibold">
          <LogOut size={18} />
          Salir
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;