import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';
import AsideFilter from './tienda/AsideFilter/AsideFilter';
import { useDarkMode } from "../store/theme";

const Layout = () => {

  const [estadoAside, setEstadoAside] = useState(true);
  const { toggleDarkMode, darkMode } = useDarkMode();

  return (
      <div>
          <Toaster />
          {/* <Header /> */}
          <Header estadoAside={estadoAside} setEstadoAside={setEstadoAside} />
        <div className="min-h-[1000px] bg-white dark:bg-gray-900">
            <AsideFilter estadoAside={estadoAside} darkMode={darkMode} />
            <Outlet />
        </div>
      </div>
  )
}

export default Layout
