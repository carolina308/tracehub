import { Settings } from "lucide-react";
import { FiBell, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between bg-white px-6 py-4 border-b border-slate-200/50">

      {/* LEFT */}
      <div className="flex items-center gap-4 w-full max-w-xl">
        
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search tasks, requirements..."
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow duration-300"
          />
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* SETTINGS */}
        <Link
          to="/settings"
          className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-110 active:scale-95"
        >
          <Settings size={20} />
        </Link>

        {/* NOTIFICATIONS */}
        <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ease-out hover:scale-110 active:scale-95">
          <FiBell className="text-lg" />
        </button>

        {/* USER */}
        <div className="flex items-center gap-2 cursor-pointer pl-2 border-l border-slate-200">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-sm text-white font-medium shadow-sm">
            C
          </div>
        </div>

      </div>

    </header>
  );
};

export default Header;