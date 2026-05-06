import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-[240px] w-full min-h-screen bg-gray-50">

        <Header />

        <main className="p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default Layout;