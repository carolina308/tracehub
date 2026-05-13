import { LayoutDashboard, ClipboardList, History, ShieldCheck, Users, LogOut, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menu = [
    { name: "Tablero", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Requerimientos", icon: ClipboardList, path: "/register-requirement" },
    { name: "Asignar Requisitos", icon: UserPlus, path: "/asignar-requisitos" },
    { name: "Registrar cambios", icon: History, path: "/historial" },
    { name: "Calidad", icon: ShieldCheck, path: "/qa" },
    { name: "Grupo", icon: Users, path: "/team" },
  ];

  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); };

  return (
    <aside className="w-48 h-screen fixed top-0 left-0 bg-white border-r border-blue-200 flex flex-col justify-between overflow-hidden">
      <div className="overflow-y-auto flex-1">
        <div className="px-3 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-blue-600 tracking-wide">Tracehub</h1>
          <p className="text-gray-500 text-[10px] mt-0.5">Agile Command</p>
        </div>
        <nav className="flex flex-col gap-0.5 px-2">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all duration-200 text-[11px] font-medium ${
                  active ? "bg-blue-600 text-white shadow-sm" : "text-gray-800 hover:bg-[#101b35] hover:text-white"
                }`}
              >
                <Icon size={13} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-2">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-1 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md transition-all duration-200 font-semibold text-[11px] active:scale-[0.97]">
          <LogOut size={12} /> Salir
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
