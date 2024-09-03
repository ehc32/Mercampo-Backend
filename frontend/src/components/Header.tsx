import { Disclosure, Menu, Transition } from '@headlessui/react';
import jwt_decode from "jwt-decode";
import { Fragment } from 'react';
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../hooks/auth";
import { useCartStore } from "../hooks/cart";
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ST_Icon from './assets/ST/ST_Icon';
import AsideToggle from './shared/tooltip/TooltipAside';
import BasicTooltip from './shared/tooltip/TooltipOpenCart';
import './style.css';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {

  const token: string = useAuthStore.getState().access;
  const cart = useCartStore(state => state.cart);
  const { isAuth, role } = useAuthStore();
  const location = useLocation();


  let is_admin: boolean = false;
  let is_seller: boolean = false;
  let user_id: number;
  let avatar: string;

  if (isAuth) {
    const tokenDecoded: Token = jwt_decode(token);
    is_admin = role == 'admin';
    is_seller = role == 'seller';
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
            <div className="relative flex h-16 items-center justify-evenly">
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start subnav-1">
                <div className="flex">
                  {
                    location.pathname == "/store" && (
                      <AsideToggle />
                    )
                  }
                  {
                    location.pathname !== "/store" && window.innerWidth < 900 && (
                      <AsideToggle />
                    )
                  }
                  <Link to={'/'} className='flex flex-row'>
                    <ST_Icon />
                  </Link>
                  <div className="sm:ml-6 sm:block">
                    <div className="flex space-x-1 nav_items_block">
                      {
                        isAuth && (
                          <>
                            <Link
                              to={'/'}
                              className='text-black font-bold  px-2 rounded-lg fs-18px item_navbar'

                            >
                              Inicio
                            </Link>

                            <Link
                              to={'/store'}
                              className='text-black font-bold px-2 rounded-lg fs-18px item_navbar'
                            >
                              Tienda
                            </Link>
                          </>

                        )
                      }
                    </div>
                  </div>
                </div>
                
              <h1 className='titulo-while-auth text-black  subnav-1 justify-center align-center'>Mercampo</h1>
              </div>


              <div className="absolute space-x-6 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 subnav-1 justify-end">
                {isAuth ? (
                  <>
                    <div className='nav_items_block'>
                      <div className='nav_items_block flex flex-row justify-between'>
                        <BasicTooltip />
                        <span className="text-slate-900 mx-1 fs-18px">{cart.length}</span>
                      </div>
                    </div>
                    <Menu as="div" className="relative ml-1">

                      <div>
                        <Menu.Button className="flex rounded-full text-sm focus:outline-none border-2 border-green-600">                        <span className="sr-only">Menú de usuario</span>
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
                                className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2                              text-sm text-gray-700')}
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
                  </>
                ) : (
                  <>
                    {
                      location.pathname != "/login" && (
                        window.innerWidth > 900 ? (

                          <Link
                            to={'/login'}
                            className='bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded'
                          >
                            Iniciar sesión
                          </Link>
                        ) : (
                          <Link
                            to={'/login'}>
                            <LoginIcon style={{ fontSize: '24px' }} />
                          </Link>
                        )
                      )
                    }
                    {
                      location.pathname != "/register" && (
                        window.innerWidth > 900 ? (
                          <Link
                            to={'/register'}
                            className='text-green-600 hover:bg-green-600 hover:text-white font-bold py-2 px-4 rounded border border-green-600'
                          >
                            Registrar cuenta
                          </Link>

                        ) : (
                          <Link
                            to={'/register'}>
                            <PersonAddIcon style={{ fontSize: '24px' }} />
                          </Link>
                        )
                      )
                    }
                  </>
                )
                }
              </div>
            </div>
          </div>
        </>
      )
      }
    </Disclosure >
  );
};

export default Header;