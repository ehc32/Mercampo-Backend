"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { getNotifications, markNotificationAsRead, type Notification } from "../api/notifications"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

interface NotificationBadgeProps {
  userId: number
  userRole: string
}

const NotificationBadge = ({ userId, userRole }: NotificationBadgeProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const unreadCount = notifications.filter((notification) => !notification.is_read).length

  // Cargar notificaciones
  useEffect(() => {
    const fetchNotifications = async () => {
      if (userRole === "seller" || userRole === "admin") {
        try {
          setIsLoading(true)
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
          setIsLoading(false)
        } catch (error) {
          console.error("Error al cargar notificaciones:", error)
          setIsLoading(false)
        }
      }
    }

    fetchNotifications()

    // Configurar un intervalo para actualizar las notificaciones cada 30 segundos
    const intervalId = setInterval(fetchNotifications, 30000)

    return () => clearInterval(intervalId)
  }, [userRole])

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

  // Si el usuario no es vendedor o admin, no mostrar nada
  if (userRole !== "seller" && userRole !== "admin") {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-1 rounded-full text-white hover:text-green-500 focus:outline-none"
        aria-label="Notificaciones"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="origin-top-left absolute left-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
            </div>

            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Cargando notificaciones...</div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 ${!notification.is_read ? "bg-green-50" : ""}`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {!notification.is_read && (
                            <span className="inline-block w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                          )}
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatNotificationDate(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">No tienes notificaciones</div>
                )}
              </div>
            )}

            {notifications.length > 0 && unreadCount > 0 && (
              <div className="px-4 py-2 border-t border-gray-200">
                <button onClick={handleMarkAllAsRead} className="text-sm text-green-600 hover:text-green-800">
                  Marcar todas como leídas
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )

}

export default NotificationBadge

