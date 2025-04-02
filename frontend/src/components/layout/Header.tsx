"use client"

import { Disclosure, Menu, Transition } from "@headlessui/react"
import jwt_decode from "jwt-decode"
import { Fragment, useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuthStore } from "../../hooks/auth"
import { useCartStore } from "../../hooks/cart"
import type { Token } from "../../Interfaces"
import ST_Icon from "../assets/ST/ST_Icon"
import AsideToggle from "../shared/tooltip/TooltipAside"
import BasicTooltip from "../shared/tooltip/TooltipOpenCart"
import "./../../global/style.css"
import { getNotifications, markNotificationAsRead, type Notification } from "../../api/notifications"
import NotificationBadge from "../NotificationBadge"
// Importar el componente NotificationBadge

const Header = () => {
  const [roleLocal, setRoleLocal] = useState("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const cart = useCartStore((state) => state.cart)
  const [userId, setUserId] = useState<number | null>(null)
  const { isAuth, access, id } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const avatar = ""

  useEffect(() => {
    const setRoleAndUserIdFromToken = () => {
      const token: string | null = access
      if (token) {
        try {
          const tokenDecoded: Token = jwt_decode(token)
          const userRole = tokenDecoded.role
          const userEnterprise = tokenDecoded.enterprise
          const userIdFromToken = tokenDecoded.user_id
          
          setRoleLocal(userRole)
          setUserId(userIdFromToken) 
          console.log(userEnterprise)
        } catch (error) {
          console.error("Error al decodificar el token:", error)
        }
      } else {
        setRoleLocal("")
        setUserId(null)
      }
    }

    setRoleAndUserIdFromToken()
  }, [access])

  const currentUserId = id || userId

  // Cargar notificaciones
  const fetchNotifications = async () => {
    if (isAuth && (roleLocal === "seller" || roleLocal === "admin")) {
      try {
        const data = await getNotifications()

        // Ordenar notificaciones: no leídas primero, luego por fecha (más recientes primero)
        const sortedNotifications = [...data].sort((a, b) => {
          // Primero ordenar por estado de lectura
          if (a.is_read !== b.is_read) {
            return a.is_read ? 1 : -1
          }
          // Luego ordenar por fecha (más recientes primero)
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        })

        // Limitar a máximo 20 notificaciones para evitar sobrecarga
        const limitedNotifications = sortedNotifications.slice(0, 20)

        setNotifications(limitedNotifications)
      } catch (error) {
        console.error("Error al cargar notificaciones:", error)
      }
    }
  }

  useEffect(() => {
    fetchNotifications()

    // Configurar un intervalo para actualizar las notificaciones cada 30 segundos
    const intervalId = setInterval(fetchNotifications, 30000)

    return () => clearInterval(intervalId)
  }, [isAuth, roleLocal])

  // Mejorar la función handleMarkAsRead para actualizar correctamente el estado
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markNotificationAsRead(notificationId)

      // Actualizar el estado local inmediatamente
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId ? { ...notification, is_read: true } : notification,
        ),
      )
    } catch (error) {
      console.error("Error al marcar notificación como leída:", error)
    }
  }

  // Mejorar la función handleNotificationClick para mejor navegación
  const handleNotificationClick = (notification: Notification) => {
    // Marcar como leída
    handleMarkAsRead(notification.id)

    // Navegar a la orden si existe
    if (notification.order_id) {
      // Guardar el ID de la orden para resaltarla en la página de perfil
      localStorage.setItem("highlightedOrderId", notification.order_id.toString())

      // Cambiar a la pestaña de ventas
      localStorage.setItem("profileTab", "ventas")

      // Navegar a la página de perfil
      navigate(`/profile`)
      toast.info("Navegando a la orden confirmada")
    }

    setShowNotifications(false)
  }

  // Añadir una función para marcar todas las notificaciones como leídas
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notification) => !notification.is_read)

      // Si no hay notificaciones sin leer, no hacer nada
      if (unreadNotifications.length === 0) {
        return
      }

      // Mostrar indicador de carga
      toast.info("Marcando todas las notificaciones como leídas...")

      // Marcar cada notificación como leída
      for (const notification of unreadNotifications) {
        await markNotificationAsRead(notification.id)
      }

      // Actualizar el estado local
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, is_read: true })),
      )

      toast.success("Todas las notificaciones han sido marcadas como leídas")
    } catch (error) {
      console.error("Error al marcar todas las notificaciones como leídas:", error)
      toast.error("Error al marcar las notificaciones como leídas")
    }
  }

  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  function logOutFun() {
    useAuthStore.getState().logout()
    navigate("/login")
  }

  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ")
  }

  useEffect(() => {
    if (!isAuth || (roleLocal !== "admin" && roleLocal !== "seller")) {
      if (location.pathname === "/admin" || location.pathname === "/addprod") {
        navigate("/")
        toast.info("No tienes permisos de acceso a esta ruta.")
      }
    }
  }, [isAuth, roleLocal, location.pathname, navigate])

  if (!isAuth && (location.pathname === "/admin" || location.pathname === "/addprod")) {
    return null
  }

  const isWideScreen = window.innerWidth > 900

  // Formatear fecha para notificaciones
  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Ahora mismo"
    if (diffMins < 60) return `Hace ${diffMins} minutos`
    if (diffHours < 24) return `Hace ${diffHours} horas`
    if (diffDays === 1) return "Ayer"
    return `Hace ${diffDays} días`
  }

  return (
    <Disclosure as="nav" className=" shadow fixed top-0 w-full bg-[#2A2A2A] z-50">
      {() => (
        <>
          <div className="px-4 py-1 w-full">
            <div className="relative flex h-12 items-center justify-evenly">
              <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start subnav-1">
                <div className="flex">
                  {location.pathname === "/store" && <AsideToggle />}
                  {location.pathname !== "/store" && window.innerWidth < 900 && <AsideToggle />}
                  {isWideScreen && (
                    <Link to={"/"} className="flex flex-row">
                      <ST_Icon />
                    </Link>
                  )}
                  {!isWideScreen && (
                    <h1 className="titulo-while-auth font-bold text-white ml-14 subnav-1 justify-center align-center">
                      Mercampo
                    </h1>
                  )}
                  <div className="sm:ml-6 sm:block">
                    <div className="flex space-x-1 nav_items_block">
                      <Link
                        to={"/"}
                        className="text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar"
                      >
                        Inicio
                      </Link>

                      <Link
                        to={"/store"}
                        className="text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar"
                      >
                        Tienda
                      </Link>
                      <Link
                        to={"/enterpriseShop"}
                        className="text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar"
                      >
                        Emprendimientos
                      </Link>
                      <Link
                        to={'/blogs'}
                        className='text-white font-bold hover:text-green-500 px-2 rounded-lg fs-18px item_navbar'
                      >
                        Blogs
                      </Link>
                      <a>
                      <NotificationBadge userId={id} userRole={roleLocal} />

                      </a>
                    </div>
                  </div>
                </div>
                {isWideScreen && (
                  <h1 className="titulo-while-auth font-bold text-white ml-14 subnav-1 justify-center align-center">
                    Mercampo
                  </h1>
                  
                )}
              </div>
              {isWideScreen && (
                <div className="absolute space-x-6 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 subnav-1 justify-end">
                  <div className="nav_items_block flex flex-row justify-between">
                    <BasicTooltip />
                    <span className="mx-1 fs-18px text-white">{cart.length}</span>
                  </div>
                  {isAuth ? (
                    <>
                      {/* Notificaciones - Solo para vendedores y administradores */}
                      {(roleLocal === "seller" || roleLocal === "admin") && (
<a
></a>
                      )}

                      <Menu as="div" className="relative ml-1">
                        <div>
                          <Menu.Button className="flex rounded-full text-sm focus:outline-none border-2 border-green-600">
                            <span className="sr-only">Menú de usuario</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={avatar ? `${import.meta.env.VITE_BACKEND_URL}${avatar}` : "/avatar.png"}
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
                                  className={classNames(
                                    active ? "bg-[#3A3A3A]" : "",
                                    "block px-4 py-2 text-sm text-white",
                                  )}
                                >
                                  Perfil
                                </Link>
                              )}
                            </Menu.Item>

                            {roleLocal === "admin" && (
                              <>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/addprod"
                                      className={classNames(
                                        active ? "bg-[#3A3A3A]" : "",
                                        "block px-4 py-2 text-sm text-white",
                                      )}
                                    >
                                      Nuevo producto
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/admin"
                                      className={classNames(
                                        active ? "bg-[#3A3A3A]" : "",
                                        "block px-4 py-2 text-sm text-white",
                                      )}
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
                                    to={currentUserId ? `/myEnterprise/${currentUserId}` : '#'}
                                    className={classNames(
                                      active ? "bg-[#3A3A3A]" : "",
                                      "block px-4 py-2 text-sm text-white",
                                      !currentUserId ? "opacity-50 cursor-not-allowed" : ""
                                    )}
                                    onClick={e => {
                                      if (!currentUserId) {
                                        e.preventDefault()
                                        toast.error("No se pudo identificar tu usuario")
                                      }
                                    }}
                                    >
                                      Emprender
                                    </Link>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      to="/addprod"
                                      className={classNames(
                                        active ? "bg-[#3A3A3A]" : "",
                                        "block px-4 py-2 text-sm text-white",
                                      )}
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
                                  className={classNames(
                                    active ? "bg-[#3A3A3A]" : "",
                                    "block px-4 py-2 text-sm text-white cursor-pointer",
                                  )}
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
  )
}

export default Header

