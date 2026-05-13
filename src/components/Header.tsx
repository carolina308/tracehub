import { Settings } from "lucide-react";
import { FiBell, FiSearch } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between bg-white px-3 py-2 border-b border-slate-200/50">
      <div className="flex items-center gap-2 w-full max-w-xl">
        <div className="relative w-full">
          <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
          <input type="text" placeholder="Search..."
            className="w-full pl-7 pr-2.5 py-1 border border-slate-200 rounded-md text-[11px] focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Link to="/settings" className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-110">
          <Settings size={14} />
        </Link>
        <button className="p-1 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:scale-110">
          <FiBell size={14} />
        </button>
        <div className="flex items-center pl-1.5 border-l border-slate-200">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-[9px] text-white font-medium">C</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
