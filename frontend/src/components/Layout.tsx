import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {

  const [estadoAside, setEstadoAside] = useState(false);

  return (
    <div>
      <Toaster />
      <Header estadoAside={estadoAside} setEstadoAside={setEstadoAside} />
      <div className="pt-5 bg-white dark:bg-gray-900">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default Layout
