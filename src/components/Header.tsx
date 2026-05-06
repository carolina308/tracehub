import { FiBell, FiSearch } from 'react-icons/fi';

const Header = () => {
  return (
    <div className="w-full flex items-center justify-between bg-white px-6 py-4 border-b">

      {/* LEFT */}
      <div className="flex items-center gap-4 w-full max-w-xl">
        
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          
          <input
            type="text"
            placeholder="Search tasks, requirements..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* NOTIFICATIONS */}
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiBell className="text-gray-600 text-lg" />
        </button>

        {/* USER */}
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm">
            C
          </div>
        </div>

      </div>

    </div>
  );
};

export default Header;