import { BsFillMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { useDarkMode } from "../store/theme";
import { Fragment, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth";
import jwt_decode from "jwt-decode"
import { useCartStore } from "../store/cart"
import { Token } from "../Interfaces";
import { useSearchStore } from "../store/search";

const Header = () => {

  const { toggleDarkMode, darkMode } = useDarkMode();
  const token: string = useAuthStore.getState().access;
  const { isAuth } = useAuthStore()
  const cart = useCartStore(state => state.cart);

  let is_admin: boolean;
  let user_id: number;
  let avatar: string;

  if (isAuth) {
    const tokenDecoded: Token = jwt_decode(token)
    is_admin = tokenDecoded.is_staff;
    user_id = tokenDecoded.user_id;
    avatar = String(tokenDecoded.avatar)
  }

  const setSearchTerm = useSearchStore((state) => state.setSearchTerm);
  const location = useLocation();  // Hook para obtener la ubicación actual

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }


  function logOutFun() {
    useAuthStore.getState().logout()
    window.location.href = '/login'
  }

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
  }
  const handleToggleMenu = () => {
    setOpen(!open);
  };
  const [open, setOpen] = useState(false); // aside

  return (
    <Disclosure as="nav" className="bg-grey dark:bg-gray-800">
      {() => (
        <>
          <div className="px-5">
            <div className="relative flex h-16 items-center justify-between">
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">


                <div className="flex space-x-4">
                  <button onClick={handleToggleMenu}>
                    {location.pathname === "/cate" && (
                      open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )
                    )}
                  </button>
                  <div className="flex flex-shrink-0 items-center">

                    <img
                      className=" h-8 w-auto lg:block"
                      src="/public/logo.png"
                      alt="Logo"
                    />
                  </div>
                  {isAuth ? (
                    <>
                      <Link
                        to={'/'}
                        className='bg-slate-400 p-2 px-4 rounded-lg text-black dark:bg-gray-900 dark:text-white'
                      >
                        Inicio
                      </Link>

                      <Link
                        to={'/cate'}
                        className='text-black p-2 px-4 rounded-lg hover:bg-slate-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      >
                        Categorias
                      </Link>
                    </>

                  ) : (
                    <>
                      <Link
                        to={'/login'}
                        className='bg-slate-400 p-2 px-4 rounded-lg text-black dark:bg-gray-900 dark:text-white'
                      >
                        Iniciar sesión
                      </Link>

                      <Link
                        to={'/register'}
                        className='text-black p-2 px-4 rounded-lg hover:bg-slate-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      >
                        Registrar cuenta
                      </Link>
                    </>
                  )}

                  {is_admin && is_admin && (
                    <Link
                      to={'/admin'}
                      className='text-black p-2 px-4 rounded-lg hover:bg-slate-400 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    >
                      Panel de administración
                    </Link>
                  )}

                </div>
              </div>

              {/* Mostrar el campo de búsqueda solo si no estamos en la página de login */}
              {/* {location.pathname !== "/login" && location.pathname !== "/register" && (
                <div className="relative hidden md:block">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                    </svg>
                    <span className="sr-only">Buscar</span>
                  </div>
                  <input
                    type="text"
                    onChange={handleInputChange}
                    className="block w-full md:w-[200px] lg:w-[400px] xl:w-[600px] p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-full bg-gray-50 dark:bg-gray-700 outline-none dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Buscar..."
                  />
                </div>
              )} */}

              <div className="absolute space-x-2 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  onClick={toggleDarkMode}
                  type="button"
                >
                  {darkMode ?

                    <BsFillMoonStarsFill size={20} className="text-slate-200 hover:text-white " />

                    :

                    <BsFillSunFill size={23} className="text-slate-900 hover:text-black" />}

                </button>
                <div className="absolute space-x-2 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <button onClick={toggleDarkMode} type="button">
                    {/* ... */}
                  </button>

                  {location.pathname !== "/login" && location.pathname !== "/register" && (
                    <>
                      <Link to={'/cart'} className="text-slate-900 hover:text-black dark:text-slate-200 dark:hover:text-white">
                        <HiOutlineShoppingBag size={23} />
                      </Link>
                      <span className="text-slate-900 dark:text-slate-200">{cart.length}</span>
                    </>
                  )}

                  {/* ... */}
                </div>

                {isAuth && (
                  <Menu as="div" className="relative ml-2">
                    <div>
                      <Menu.Button className="flex rounded-full ml-8 text-sm focus:outline-none ">
                        <span className="sr-only">Open user menu</span>
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
                            <Link
                              to="/profile/purchases"
                              className={classNames(active ? 'bg-gray-100 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-slate-200')}
                            >
                              Compras
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile/favorites"
                              className={classNames(active ? 'bg-gray-100 dark:bg-slate-700' : '', 'block px-4 py-2 text-sm text-gray-700 dark:text-slate-200')}
                            >
                              Favoritos
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logOutFun}
                              className={classNames(active ? 'bg-gray-100 dark:bg-slate-700' : '', 'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200')}
                            >
                              Cerrar sesión
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  )
}

export default Header;

