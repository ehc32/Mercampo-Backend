import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import jwt_decode from "jwt-decode";
import { Fragment, useState } from 'react';
import { BsFillCartFill, BsFillMoonStarsFill, BsFillSunFill, BsShopWindow } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useAuthStore } from "../hooks/auth";
import { useCartStore } from "../hooks/cart";
import { useDarkMode } from "../hooks/theme";
import { Token } from "../Interfaces";
import ST_Icon from './assets/ST/ST_Icon';

interface HeaderProps {
  estadoAside: boolean;
  setEstadoAside: (newState: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ estadoAside, setEstadoAside }) => {

  const { toggleDarkMode, darkMode } = useDarkMode();
  const token: string = useAuthStore.getState().access;
  const cart = useCartStore(state => state.cart);
  const { isAuth, role } = useAuthStore();
  const [imgMenu, setImgMenu] = useState(false);

  let is_admin: boolean = false;
  let user_id: number;
  let avatar: string;

  if (isAuth) {
    const tokenDecoded: Token = jwt_decode(token);
    is_admin = role == 'admin';
    user_id = tokenDecoded.user_id;
    avatar = String(tokenDecoded.avatar);
  }

  function logOutFun() {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
  }

  const handleToggleMenu = () => {
    setEstadoAside(!estadoAside);
  };

  return (
    <Disclosure as="nav" className={darkMode ? 'nav-dark' : 'nav-light'}>
      {() => (
        <>
          <div className="px-5">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                <div className="flex space-x-1">
                  <button onClick={handleToggleMenu}>
                    {location.pathname === '/store' && (
                      estadoAside ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )
                    )}
                  </button>
                  <Link to={'/'} className='flex flex-row'>
                    <ST_Icon />
                  </Link>

                  <div className="sm:ml-6 sm:block">
                    <div className="flex space-x-1">
                      {isAuth ? (
                        <>
                          <Link
                            to={'/'}
                            className='text-black p-4 px-2 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                          >
                            Inicio
                          </Link>

                          <Link
                            to={'/store'}
                            className='text-black p-4 px-2 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                          >
                            Tienda
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to={'/login'}
                            className='text-black p-4 px-2 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                          >
                            Iniciar sesión
                          </Link>

                          <Link
                            to={'/register'}
                            className='text-black p-4 px-2 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                          >
                            Registrar cuenta
                          </Link>
                        </>
                      )}

                      <Link
                        to={'/admin'}
                        className='text-black p-4 px-2 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                      >
                        Panel de administración
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute space-x-6 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  onClick={toggleDarkMode}
                  type="button"
                >
                  {darkMode ?
                    <BsFillMoonStarsFill size={20} className="text-slate-200 hover:text-white " />
                    :
                    <BsFillSunFill size={23} className="text-slate-900 hover:text-black" />
                  }
                </button>

                <Link to={'/cart'} className="text-slate-900 hover:text-black dark:text-slate-200 dark:hover:text-white d-flex row align-center">
                  <BsFillCartFill size={23} />
                  <span className="text-slate-900 dark:text-slate-200 mx-1">{cart.length}</span>
                </Link>

                <Link to={'/addprod'} className="text-slate-900 hover:text-black dark:text-slate-200 dark:hover:text-white d-flex row align-center">
                  <BsShopWindow size={23} />
                  <span className="text-slate-900 dark:text-slate-200 mx-1">{cart.length}</span>
                </Link>

                {isAuth && (
                  <Menu as="div" className="relative ml-2">
                    <div>
                      <Menu.Button className="flex rounded-full ml-8 text-sm focus:outline-none">
                        <span className="sr-only">Menú de usuario</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={`${import.meta.env.VITE_BACKEND_URL}${avatar}`}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white dark:bg-slate-950 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(active ? 'bg-gray-100 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-slate-200')}
                            >
                              Perfil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              onClick={logOutFun}
                              className={classNames(active ? 'bg-gray-100 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer dark:text-slate-200')}
                            >
                              Cerrar sesión
                            </span>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">

            <div className="space-y-1 px-2 pb-3 pt-2">
              {isAuth ? (
                <div className="w-full grid grid-cols-1">
                  <Link
                    to={'/'}
                    className='bg-slate-400 p-2 px-4 rounded-lg text-black dark:bg-gray-900 dark:text-white'
                  >
                    Inicio
                  </Link>

                  <Link
                    to={'/cate'}
                    className='text-black p-2 px-4 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                  >
                    Tienta
                  </Link>
                </div>
              ) : (
                <div className="w-full grid grid-cols-1">
                  <Link
                    to={'/login'}
                    className='bg-slate-400 p-2 px-4 rounded-lg text-black dark:bg-gray-900 dark:text-white'
                  >
                    Ingresar
                  </Link>

                  <Link
                    to={'/register'}
                    className='text-black p-2 px-4 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                  >
                    Cerrar sesión
                  </Link>
                </div>
              )}

              {is_admin && (
                <div className="w-full">
                  <Link
                    to={'/admin'}
                    className='text-black p-2 px-4 rounded-lg fs-16px dark:text-gray-300 dark:hover:text-white'
                  >
                    Administrador
                  </Link>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Header;
