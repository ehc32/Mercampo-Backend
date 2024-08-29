import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
// 
import Header from './Header';
// import AsideFilter from './tienda/AsideFilter/AsideFilter';

const Layout = () => {

  const [estadoAside, setEstadoAside] = useState(false);
  // const { toggleDarkMode, darkMode } = useDarkMode();

  return (
    <div>
      <Toaster />
      <Header estadoAside={estadoAside} setEstadoAside={setEstadoAside} />
      <div className="min-h-[1000px] bg-white dark:bg-gray-900 content-layout">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
