import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {

  const [estadoAside, setEstadoAside] = useState(false);

  return (
    <div>
      <Toaster />
      <Header estadoAside={estadoAside} setEstadoAside={setEstadoAside} />
      <div className="min-h-[1000px] bg-white dark:bg-gray-900">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
