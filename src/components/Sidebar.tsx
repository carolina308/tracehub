import {
  LayoutDashboard,
  ClipboardList,
  History,
  ShieldCheck,
  Users,
  LogOut,
  UserPlus,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const navigate = useNavigate();

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
       name: "Asignar Requisitos",
       icon: UserPlus,
       path: "/asignar-requisitos",
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
    ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-white border-r border-blue-200 flex flex-col justify-between overflow-x-hidden overflow-y-hidden">

      {/* TOP */}
      <div className="overflow-y-auto flex-1">

        {/* LOGO */}
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-base font-bold text-red-600 tracking-wide">
            Tracehub
          </h1>

          <p className="text-gray-400 text-sm mt-2">
            Agile Command
          </p>
        </div>

        {/* MENU */}
        <nav className="flex flex-col gap-3 px-4">

          {menu.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path;

             return (
               <Link
                 key={item.name}
                 to={item.path}
                 className={`flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 text-sm font-medium
                   
                   ${
                     active
                       ? "bg-blue-600 text-white shadow-lg"
                       : "text-gray-700 hover:bg-[#101b35] hover:text-white"
                   }
                 `}
               >
                 <Icon size={20} />

                 <span>{item.name}</span>
               </Link>
             );
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="p-4">

        <button
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            justify-center
            gap-2
            bg-red-500
            hover:bg-red-600
            text-white
            py-4
            rounded-2xl
            transition-all
            duration-200
            font-semibold
          "
        >
          <LogOut size={18} />

          Salir
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;