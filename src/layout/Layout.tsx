import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex min-h-[100dvh] w-full overflow-hidden">
      <Sidebar />
      
      <div className="ml-[240px] w-full min-h-[100dvh] bg-[#f4f7fb] flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;