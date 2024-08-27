import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import jwt_decode from "jwt-decode";
import { Fragment, useState } from 'react';
import { BsFillCartFill, BsShopWindow } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useAuthStore } from "../hooks/auth";
import { useCartStore } from "../hooks/cart";
import { useAbierto } from "../hooks/aside"; // Importa el hook useAbierto
import ST_Icon from './assets/ST/ST_Icon';
import './style.css'

interface HeaderProps {
  estadoAside: boolean;
  setEstadoAside: (newState: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ estadoAside, setEstadoAside }) => {

  const token: string = useAuthStore.getState().access;
  const cart = useCartStore(state => state.cart);
  const { isAuth, role } = useAuthStore();
  const location = useLocation();
  const { abierto, toggleAbierto } = useAbierto(); // Usa el hook useAbierto

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

  return (
    <Disclosure as="nav" className=" shadow fixed top-0 w-full bg-white z-50">
      {() => (
        <>
          <div className="px-4 py-1 w-full">
            <div className="relative flex h-16 items-center justify-between ">
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
                <div className="flex">


                  {
                    location.pathname === '/store' ? (
                      <button onClick={toggleAbierto}>
                        {
                          abierto ? (
                            <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                          ) : (
                            <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                          )
                        }
                      </button>
                    ) : (
                      <button onClick={toggleAbierto} className='toggle-openaside'>
                        {
                          abierto ? (
                            <XMarkIcon className="block h-8 w-8 " aria-hidden="true" />
                          ) : (
                            <Bars3Icon className="block h-8 w-8 " aria-hidden="true" />
                          )
                        }
                      </button>
                    )
                  }
                  <Link to={'/'} className='flex flex-row'>
                    <ST_Icon />
                  </Link>

                  <div className="sm:ml-6 sm:block">
                    <div className="flex space-x-1 nav_items_block">

                      {
                        isAuth ? (
                          <>
                            <Link
                              to={'/'}
                              className='text-black  px-2 rounded-lg fs-18px item_navbar'
                              
                            >
                              Inicio
                            </Link>

                            <Link
                              to={'/store'}
                              className='text-black px-2 rounded-lg fs-18px item_navbar'
                            >
                              Tienda
                            </Link>
                          </>

                        ) : (

                          <>
                            <Link
                              to={'/login'}
                              className='text-black px-2 rounded-lg fs-18px item_navbar'
                            >
                              Iniciar sesión
                            </Link>

                            <Link
                              to={'/register'}
                              className='text-black px-2 rounded-lg fs-18px item_navbar'
                            >
                              Registrar cuenta
                            </Link>
                          </>
                        )


                      }


                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute space-x-6 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {
                  <div className='nav_items_block'>

                    <Link to={'/cart'} className="text-slate-900 hover:text-black d-flex row align-center">
                      <BsFillCartFill size={23} />
                      <span className="text-slate-900 mx-1">{cart.length}</span>
                    </Link>
                  </div>
                }

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
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Perfil
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/addprod"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Nuevo producto
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/admin"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                            >
                              Administrar
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <span
                              onClick={logOutFun}
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700 cursor-pointer')}
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
        </>
      )
      }
    </Disclosure >
  );
}

export default Header;