import { Disclosure, Menu, Transition } from '@headlessui/react';
import jwt_decode from 'jwt-decode';
import { Fragment, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useAuthStore } from "../../hooks/auth";
import { useCartStore } from "../../hooks/cart";
import { Token } from '../../Interfaces';
import ST_Icon from '../assets/ST/ST_Icon';
import AsideToggle from '../shared/tooltip/TooltipAside';
import BasicTooltip from '../shared/tooltip/TooltipOpenCart';
import './../../global/style.css';

const Header = () => {
  const [roleLocal, setRoleLocal] = useState("");
  const cart = useCartStore(state => state.cart);
  const { isAuth, access } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  let avatar: string = '';

  useEffect(() => {
    const setRoleFromToken = () => {
      const token: string | null = access;
      if (token) {
        try {
          const tokenDecoded: Token = jwt_decode(token);
          const userRole = tokenDecoded.role;
          const userEnterprise = tokenDecoded.enterprise;
          setRoleLocal(userRole);
          console.log(userEnterprise)
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      } else {
        setRoleLocal("");
      }
    };

    setRoleFromToken();

  }, [access]);

  function logOutFun() {
    useAuthStore.getState().logout();
    navigate('/login');
  }

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    if (!isAuth || (roleLocal !== "admin" && roleLocal !== "seller")) {
      if (location.pathname === "/admin" || location.pathname === "/addprod") {
        navigate('/');
        toast.info("No tienes permisos de acceso a esta ruta.");
      }
    }
  }, [isAuth, roleLocal, location.pathname, navigate]);

  if (!isAuth && (location.pathname === "/admin" || location.pathname === "/addprod")) {
    return null;
  }

  const isWideScreen = window.innerWidth > 900;

  return (
    <Disclosure as="nav" className=" shadow fixed top-0 w-full bg-[#2A2A2A] z-50">
      {() => (
        <>
          <div className="px-4 py-1 w-full">
            <div className="relative flex h-12 items-center justify-evenly">
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start subnav-1">
                <div className="flex">
                  {
                    location.pathname === "/store" && (
                      <AsideToggle />
                    )
                  }
                  {
                    location.pathname !== "/store" && window.innerWidth < 900 && (
                      <AsideToggle />
                    )
                  }
                  {
                    isWideScreen &&

                    <Link to={'/'} className='flex flex-row'>
                      <ST_Icon />
                    </Link>

                  }
                  {
                    !isWideScreen &&
                    <h1 className='titulo-while-auth font-bold text-white ml-14 subnav-1 justify-center align-center'>Mercampo</h1>
                  }
                  <div className="sm:ml-6 sm:block">
                    <div className="flex space-x-1 nav_items_block">

                      <Link
                        to={'/'}
                        className='text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar'
                      >
                        Inicio
                      </Link>

                      <Link
                        to={'/store'}
                        className='text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar'
                      >
                        Tienda
                      </Link>
                      <Link
                        to={'/enterpriseShop'}
                        className='text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar'
                      >
                        Emprendimientos
                      </Link>
                    </div>
                  </div>
                </div>
                {
                  isWideScreen &&
                  <h1 className='titulo-while-auth font-bold text-white ml-14 subnav-1 justify-center align-center'>Mercampo</h1>
                }
              </div>
              {isWideScreen && (
                <div className="absolute space-x-6 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 subnav-1 justify-end">
                  <div className="nav_items_block flex flex-row justify-between">
                    <BasicTooltip />
                    <span className="mx-1 fs-18px text-white">{cart.length}</span>
                  </div>

                  {isAuth ? (
                    <>
                      <Menu as="div" className="relative ml-1">
                        <div>
                          <Menu.Button className="flex rounded-full text-sm focus:outline-none border-2 border-green-600">
                            <span className="sr-only">Menú de usuario</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={avatar ? `${import.meta.env.VITE_BACKEND_URL}${avatar}` : '/avatar.png'}
                              alt="Avatar"
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
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right bg-[#2A2A2A] py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/profile"
                                  className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white')}
                                >
                                  Perfil
                                </Link>
                              )}
                            </Menu.Item>

                            {roleLocal === "admin" && (
                              <>
                                {/* <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/myEnterprise"
                                      className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white')}
                                    >
                                      Mi emprendimiento
                                    </Link>
                                  )}
                                </Menu.Item> */}
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/addprod"
                                      className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white')}
                                    >
                                      Nuevo producto
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/admin"
                                      className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white')}
                                    >
                                      Administrar
                                    </Link>
                                  )}
                                </Menu.Item>
                              </>
                            )}

                            {roleLocal === "seller" && (
                              <>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/myEnterprise"
                                      className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white')}
                                    >
                                      Emprender
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/addprod"
                                      className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white')}
                                    >
                                      Nuevo producto
                                    </Link>
                                  )}
                                </Menu.Item>
                              </>
                            )}

                            <Menu.Item>
                              {({ active }) => (
                                <span
                                  onClick={logOutFun}
                                  className={classNames(active ? 'bg-[#3A3A3A]' : '', 'block px-4 py-2 text-sm text-white cursor-pointer')}
                                >
                                  Cerrar sesión
                                </span>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </>
                  ) : (
                    <>
                      {isWideScreen && location.pathname !== "/login" && (
                        <Link
                          to="/login"
                          className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap font-bold py-2 px-4 rounded"
                        >
                          Iniciar sesión
                        </Link>
                      )}

                      {isWideScreen && location.pathname !== "/register" && (
                        <Link
                          to="/register"
                          className="text-white hover:bg-green-600 hover:text-white whitespace-nowrap font-bold py-2 px-4 rounded border border-green-600"
                        >
                          Registrar cuenta
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
