"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"
import Pagination from "@mui/material/Pagination"
import {
  Box,
  Card,
  CardContent,
  Tab,
  Tabs,
  Typography,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Alert,
  CircularProgress,
  Tooltip,
  Badge,
} from "@mui/material"
import { get_solo_user } from "../api/users"
import { my_orders, my_pending_orders, seller_delivered_orders, edit_order } from "../api/orders"
import { useAuthStore } from "../hooks/auth"
import { get_all_products_by_user, get_products_in_sells_by_user } from "../api/products"
import ProfileTables from "../components/profile/profileTables"
import { CheckCircle, ThumbsUp, Package } from "lucide-react"
import { checkOrderConfirmation, confirmOrderReceived } from "../api/notifications"

interface OrderInterface {
  id: number
  user: {
    id: number
    email: string
    name: string
  }
  shoppingaddress: {
    id: number
    address: string
    city: string
    postal_code: string
    country: string
  }
  orderitem_set: Array<{
    id: number
    product: {
      id: number
      name: string
    }
    quantity: number
    price: string
  }>
  total_price: string
  is_paid: boolean
  paid_at: string | null
  is_delivered: boolean
  delivered_at: string | null
  created_at: string
  payment_method: string | null
  orderconfirmation?: {
    confirmed_at: string
    confirmed_by_user: number
  }
}

interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  role: string
}

interface MyOrder {
  id: number
  name: string
  price: number
  description: string
  created: string
  count_in_sells: number
  rating: number
  count_in_stock: number
  fecha_limite: string
  quantity: number
}

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [tabValue, setTabValue] = useState(() => {
    // Recuperar la pestaña seleccionada del localStorage si existe
    const savedTab = localStorage.getItem("profileTab")
    return savedTab || "compras"
  })
  const [myProducts, setMyProducts] = useState([])
  const [dataLenght, setDataLenght] = useState(0)
  const [myProductsSells, setMyProductsSells] = useState([])
  const [dataLenght2, setDataLenght2] = useState(0)
  const [orders, setOrders] = useState<OrderInterface[]>([])
  const [pendingOrders, setPendingOrders] = useState<OrderInterface[]>([])
  const [deliveredOrders, setDeliveredOrders] = useState<OrderInterface[]>([])
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPendingLoading, setIsPendingLoading] = useState(false)
  const [isDeliveredLoading, setIsDeliveredLoading] = useState(false)
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(null)
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null)
  const [confirmedCount, setConfirmedCount] = useState(0)

  const { access: token } = useAuthStore()
  const id = token ? JSON.parse(atob(token.split(".")[1])).user_id : null

  const { data: user } = useQuery<User>(["users", id], () => get_solo_user(id), {
    enabled: !!id,
  })

  // Guardar la pestaña seleccionada en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("profileTab", tabValue)
  }, [tabValue])

  function formatearFecha(fechaISO: any) {
    if (!fechaISO) return "N/A"
    const fecha = new Date(fechaISO)
    const dia = fecha.getDate().toString().padStart(2, "0")
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0")
    const year = fecha.getFullYear()
    return `${dia}-${mes}-${year}`
  }

  const get_my_products = async (id: number) => {
    const response = await get_all_products_by_user(id)
    setMyProducts(response.data)
    setDataLenght(response.meta.count)
  }

  const get_sells_by_user2 = async (id: number) => {
    const response = await get_products_in_sells_by_user(id)
    setMyProductsSells(response.data)
    setDataLenght2(response.meta.count)
  }

  // Modificar la función fetchMyOrders para incluir la verificación de confirmaciones
  const fetchMyOrders = async () => {
    try {
      setIsLoading(true)
      const response = await my_orders()
      console.log("Orders response:", response)

      // Asegurarse de que todas las órdenes tengan la propiedad orderconfirmation
      const ordersWithConfirmation = response.map((order) => {
        // Si ya tiene orderconfirmation, mantenerlo
        if (order.orderconfirmation) {
          return order
        }
        // Si no tiene orderconfirmation pero está marcado como entregado,
        // verificar si ya ha sido confirmado en el backend
        if (order.is_delivered && !order.orderconfirmation) {
          return {
            ...order,
            // Inicialmente sin confirmación, se actualizará si es necesario
            orderconfirmation: null,
          }
        }
        return order
      })

      setOrders(ordersWithConfirmation)
      setIsLoading(false)

      // Verificar el estado de confirmación de cada orden entregada
      for (const order of ordersWithConfirmation) {
        if (order.is_delivered && !order.orderconfirmation) {
          try {
            const confirmationStatus = await checkOrderConfirmation(order.id)
            if (confirmationStatus.confirmed) {
              // Actualizar el estado local si la orden ya fue confirmada
              setOrders((prevOrders) =>
                prevOrders.map((o) =>
                  o.id === order.id
                    ? {
                        ...o,
                        orderconfirmation: {
                          confirmed_at: confirmationStatus.confirmed_at,
                          confirmed_by_user: confirmationStatus.confirmed_by_user,
                        },
                      }
                    : o,
                ),
              )
            }
          } catch (error) {
            console.error(`Error checking confirmation for order ${order.id}:`, error)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Error al cargar tus órdenes")
      setIsLoading(false)
    }
  }

  // Modificar la función fetchDeliveredOrders para verificar confirmaciones
  const fetchDeliveredOrders = async () => {
    try {
      setIsDeliveredLoading(true)
      const response = await seller_delivered_orders()
      console.log("Delivered orders response:", response)

      // Verificar cada orden para ver si tiene confirmación
      let confirmedOrdersCount = 0

      // Primero establecer las órdenes en el estado
      setDeliveredOrders(response)

      // Luego verificar cada orden para actualizar el contador de confirmaciones
      for (const order of response) {
        try {
          // Si ya tiene confirmación en la respuesta, contarla
          if (order.orderconfirmation) {
            confirmedOrdersCount++
            continue
          }

          // Si no tiene confirmación, verificar con el backend
          const confirmationStatus = await checkOrderConfirmation(order.id)
          if (confirmationStatus.confirmed) {
            confirmedOrdersCount++

            // Actualizar la orden en el estado
            setDeliveredOrders((prevOrders) =>
              prevOrders.map((o) =>
                o.id === order.id
                  ? {
                      ...o,
                      orderconfirmation: {
                        confirmed_at: confirmationStatus.confirmed_at,
                        confirmed_by_user: confirmationStatus.confirmed_by_user,
                      },
                    }
                  : o,
              ),
            )
          }
        } catch (error) {
          console.error(`Error checking confirmation for order ${order.id}:`, error)
        }
      }

      // Actualizar el contador de confirmaciones
      setConfirmedCount(confirmedOrdersCount)
      setIsDeliveredLoading(false)
    } catch (error) {
      console.error("Error fetching delivered orders:", error)
      toast.error("Error al cargar órdenes entregadas")
      setIsDeliveredLoading(false)
    }
  }

  const fetchPendingOrders = async () => {
    try {
      setIsPendingLoading(true)
      const response = await my_pending_orders()
      console.log("Pending orders response:", response)
      setPendingOrders(response)
      setIsPendingLoading(false)
    } catch (error) {
      console.error("Error fetching pending orders:", error)
      toast.error("Error al cargar órdenes pendientes")
      setIsPendingLoading(false)
    }
  }

  // Modificar la función handleConfirmReceived para manejar mejor los errores y evitar confirmaciones duplicadas
  const handleConfirmReceived = async (orderId: number) => {
    try {
      // Verificar primero si la orden ya ha sido confirmada
      const confirmationStatus = await checkOrderConfirmation(orderId)
      if (confirmationStatus.confirmed) {
        // Si ya está confirmada, actualizar el estado local y mostrar un mensaje
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderconfirmation: {
                    confirmed_at: confirmationStatus.confirmed_at,
                    confirmed_by_user: confirmationStatus.confirmed_by_user,
                  },
                }
              : order,
          ),
        )
        toast.info("Este pedido ya ha sido confirmado anteriormente")
        return
      }

      // Si no está confirmada, proceder con la confirmación
      setConfirmingOrderId(orderId)
      const response = await confirmOrderReceived(orderId)

      // Actualizar la lista de órdenes con la confirmación
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                orderconfirmation: {
                  confirmed_at: response.confirmed_at || new Date().toISOString(),
                  confirmed_by_user: id as number,
                },
              }
            : order,
        ),
      )

      toast.success("¡Gracias por confirmar la recepción de tu pedido! El vendedor ha sido notificado.")
      setConfirmingOrderId(null)
    } catch (error) {
      console.error("Error al confirmar la recepción:", error)

      // Verificar si el error es porque ya está confirmada
      if (error.response && error.response.status === 400 && error.response.data.detail === "Order already confirmed") {
        toast.info("Este pedido ya ha sido confirmado anteriormente")

        // Actualizar el estado local para reflejar que ya está confirmado
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  orderconfirmation: {
                    confirmed_at: new Date().toISOString(),
                    confirmed_by_user: id as number,
                  },
                }
              : order,
          ),
        )
      } else {
        toast.error("Error al confirmar la recepción del pedido")
      }

      setConfirmingOrderId(null)
    }
  }

  const handleMarkAsDelivered = async (orderId: number) => {
    try {
      setProcessingOrderId(orderId)
      await edit_order(orderId)

      // Actualizar la lista de órdenes pendientes
      setPendingOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId))

      // Actualizar la lista de órdenes entregadas si estamos en esa pestaña
      if (tabValue === "ventas") {
        fetchDeliveredOrders()
      }

      toast.success("Orden marcada como entregada exitosamente")
      setProcessingOrderId(null)
    } catch (error) {
      console.error("Error al marcar la orden como entregada:", error)
      toast.error("Error al marcar la orden como entregada")
      setProcessingOrderId(null)
    }
  }

  const handleOpenOrderModal = async (orderId: number, ordersList: OrderInterface[]) => {
    try {
      // Encontrar la orden por ID
      const order = ordersList.find((o) => o.id === orderId)
      if (order) {
        // Transformar orderitem_set al formato esperado por el modal
        const items = order.orderitem_set.map((item) => ({
          id: item.id,
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        }))
        setSelectedOrderProducts(items)
        setIsOrderModalOpen(true)
      }
    } catch (error) {
      toast.error("Error al cargar los productos de la orden")
    }
  }

  useEffect(() => {
    if (id) {
      get_my_products(id)
    }
  }, [id])

  useEffect(() => {
    if (user && (user.role === "seller" || user.role === "admin")) {
      get_sells_by_user2(id)
    }
  }, [user, id])

  // Fetch orders when component loads or tab changes
  useEffect(() => {
    if (tabValue === "compras") {
      fetchMyOrders()
    } else if (tabValue === "pendientes" && user?.role === "seller") {
      fetchPendingOrders()
    } else if (tabValue === "ventas" && user?.role === "seller") {
      fetchDeliveredOrders()
    }
  }, [tabValue, user?.role])

  // Verificar si hay un ID de orden para resaltar (desde notificaciones)
  useEffect(() => {
    const highlightedOrderId = localStorage.getItem("highlightedOrderId")
    if (highlightedOrderId && tabValue === "ventas" && deliveredOrders.length > 0) {
      // Resaltar la orden específica (puedes implementar un efecto visual aquí)
      const orderId = Number.parseInt(highlightedOrderId)
      const orderElement = document.getElementById(`order-row-${orderId}`)
      if (orderElement) {
        orderElement.scrollIntoView({ behavior: "smooth", block: "center" })
        orderElement.classList.add("bg-green-100")
        setTimeout(() => {
          orderElement.classList.remove("bg-green-100")
        }, 3000)
      }

      // Limpiar el ID después de usarlo
      localStorage.removeItem("highlightedOrderId")
    }
  }, [tabValue, deliveredOrders])

  const isWideScreen = window.innerWidth > 900

  // Calcular el total de ventas
  const calculateTotalSales = () => {
    if (!deliveredOrders || deliveredOrders.length === 0) return 0
    return deliveredOrders.reduce((total, order) => total + Number(order.total_price), 0)
  }

  // Calcular el total de ventas confirmadas
  const calculateConfirmedSales = () => {
    // Usar el contador actualizado en lugar de calcular en el momento
    return confirmedCount
  }

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", p: isWideScreen ? 6 : 1, mt: ".1em" }}>
      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent>
          <Typography variant="h4" className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-6">
            Perfil del usuario
          </Typography>
          <ProfileTables user={user} id={id} />
        </CardContent>
      </Card>

      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-lg">
        <CardContent>
          <Typography variant="h4" className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-2">
            Registro de compraventa
          </Typography>
          <Typography variant="subtitle1" className="sub-titulo-sala-compra-light text-gray-600 mb-6">
            Visualiza tus órdenes de productos
            {user?.role === "seller" && <span className="text-[#39A900]"> o ventas que has realizado</span>}
            {user?.role === "admin" && <span className="text-[#39A900]"> o ventas que has realizado</span>}
          </Typography>

          <div className="flex justify-between items-center py-4">
            <Tabs
              value={tabValue}
              onChange={(_, newValue) => setTabValue(newValue)}
              textColor="primary"
              indicatorColor="primary"
              sx={{ ".MuiTabs-indicator": { backgroundColor: "#39A900" } }}
            >
              <Tab
                label="Compras"
                value="compras"
                sx={{ "&.Mui-selected": { color: "#39A900" } }}
                className="focus:outline-none"
              />
              {user?.role === "seller" && (
                <Tab
                  label="Órdenes Pendientes"
                  value="pendientes"
                  sx={{ "&.Mui-selected": { color: "#39A900" } }}
                  className="focus:outline-none"
                />
              )}
              {user?.role !== "client" && (
                <Tab
                  label="Ventas"
                  value="ventas"
                  sx={{ "&.Mui-selected": { color: "#39A900" } }}
                  className="focus:outline-none"
                />
              )}
              {user?.role !== "client" && (
                <Tab
                  label="Mis productos"
                  value="productos"
                  sx={{ "&.Mui-selected": { color: "#39A900" } }}
                  className="focus:outline-none"
                />
              )}
            </Tabs>
          </div>

          <Box>
            {tabValue === "compras" && (
              <>
                {isLoading ? (
                  <Typography align="center" py={3}>
                    Cargando órdenes...
                  </Typography>
                ) : orders && orders.length > 0 ? (
                  <>
                    <Alert severity="info" className="mb-4">
                      Cuando recibas tu pedido, por favor confirma la recepción para notificar al vendedor.
                    </Alert>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Usuario</TableCell>
                          <TableCell>Precio total</TableCell>
                          <TableCell>Dirección de compra</TableCell>
                          <TableCell>Fecha de pedido</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Productos</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.user.name}</TableCell>
                            <TableCell>${Number(order.total_price).toLocaleString()}</TableCell>
                            <TableCell>
                              {order.shoppingaddress
                                ? `${order.shoppingaddress.address}, ${order.shoppingaddress.city}`
                                : "No disponible"}
                            </TableCell>
                            <TableCell>{formatearFecha(order.created_at)}</TableCell>
                            <TableCell>
                              {order.is_delivered ? (
                                <span className="text-green-600">
                                  Entregado {order.delivered_at && `(${formatearFecha(order.delivered_at)})`}
                                  {order.orderconfirmation && (
                                    <Tooltip
                                      title={`Confirmado el ${formatearFecha(order.orderconfirmation.confirmed_at)}`}
                                    >
                                      <Badge color="success" variant="dot" sx={{ ml: 1 }}>
                                        <ThumbsUp size={16} className="text-green-600" />
                                      </Badge>
                                    </Tooltip>
                                  )}
                                </span>
                              ) : (
                                <span className="text-yellow-600">Pendiente</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => handleOpenOrderModal(order.id, orders)}>
                                Ver Productos ({order.orderitem_set.length})
                              </Button>
                            </TableCell>
                            <TableCell>
                              {order.is_delivered && !order.orderconfirmation ? (
                                <Button
                                  variant="contained"
                                  color="success"
                                  startIcon={
                                    confirmingOrderId === order.id ? (
                                      <CircularProgress size={20} color="inherit" />
                                    ) : (
                                      <Package size={20} />
                                    )
                                  }
                                  onClick={() => handleConfirmReceived(order.id)}
                                  disabled={confirmingOrderId === order.id}
                                  sx={{
                                    backgroundColor: "#39A900",
                                    "&:hover": { backgroundColor: "#2c7d00" },
                                  }}
                                >
                                  {confirmingOrderId === order.id ? "Procesando..." : "Confirmar recepción"}
                                </Button>
                              ) : order.orderconfirmation ? (
                                <Typography variant="body2" className="text-green-600 font-medium">
                                  Recepción confirmada
                                </Typography>
                              ) : (
                                <Typography variant="body2" className="text-gray-500">
                                  Pendiente de entrega
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <Typography align="center" py={3}>
                    No tienes órdenes de compra
                  </Typography>
                )}
              </>
            )}

            {tabValue === "pendientes" && user?.role === "seller" && (
              <>
                {isPendingLoading ? (
                  <Typography align="center" py={3}>
                    Cargando órdenes pendientes...
                  </Typography>
                ) : pendingOrders && pendingOrders.length > 0 ? (
                  <>
                    <Alert severity="info" className="mb-4">
                      Tienes {pendingOrders.length} órdenes pendientes por entregar. Marca como entregadas las órdenes
                      que ya hayas procesado.
                    </Alert>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Cliente</TableCell>
                          <TableCell>Precio total</TableCell>
                          <TableCell>Dirección de entrega</TableCell>
                          <TableCell>Fecha de pedido</TableCell>
                          <TableCell>Estado de pago</TableCell>
                          <TableCell>Productos</TableCell>
                          <TableCell>Acciones</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {pendingOrders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>{order.user.name}</TableCell>
                            <TableCell>${Number(order.total_price).toLocaleString()}</TableCell>
                            <TableCell>
                              {order.shoppingaddress
                                ? `${order.shoppingaddress.address}, ${order.shoppingaddress.city}`
                                : "No disponible"}
                            </TableCell>
                            <TableCell>{formatearFecha(order.created_at)}</TableCell>
                            <TableCell>
                              {order.is_paid ? (
                                <span className="text-green-600">
                                  Pagado {order.paid_at && `(${formatearFecha(order.paid_at)})`}
                                </span>
                              ) : (
                                <span className="text-red-600">No pagado</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => handleOpenOrderModal(order.id, pendingOrders)}>
                                Ver Productos ({order.orderitem_set.length})
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={
                                  processingOrderId === order.id ? (
                                    <CircularProgress size={20} color="inherit" />
                                  ) : (
                                    <CheckCircle size={20} />
                                  )
                                }
                                onClick={() => handleMarkAsDelivered(order.id)}
                                disabled={processingOrderId === order.id || !order.is_paid}
                                sx={{
                                  backgroundColor: "#39A900",
                                  "&:hover": { backgroundColor: "#2c7d00" },
                                  "&.Mui-disabled": { backgroundColor: "#e0e0e0", color: "#a0a0a0" },
                                }}
                              >
                                {processingOrderId === order.id ? "Procesando..." : "Marcar entregado"}
                              </Button>
                              {!order.is_paid && (
                                <Typography variant="caption" className="block text-red-500 mt-1">
                                  Debe estar pagada para entregar
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="py-8 px-4">
                    <Alert severity="success" className="mb-4">
                      ¡No tienes órdenes pendientes por entregar!
                    </Alert>
                    <div className="text-center mt-4">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setTabValue("ventas")}
                        sx={{ backgroundColor: "#39A900", "&:hover": { backgroundColor: "#2c7d00" } }}
                      >
                        Ver mis ventas completadas
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {tabValue === "ventas" && user?.role === "seller" && (
              <>
                {isDeliveredLoading ? (
                  <Typography align="center" py={3}>
                    Cargando ventas completadas...
                  </Typography>
                ) : deliveredOrders && deliveredOrders.length > 0 ? (
                  <>
                    <div className="bg-green-50 p-4 rounded-lg mb-4 border border-green-200">
                      <Typography variant="h6" className="text-green-800 font-semibold">
                        Resumen de Ventas
                      </Typography>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <Typography variant="body2" className="text-gray-600">
                            Total de ventas completadas
                          </Typography>
                          <Typography variant="h6" className="text-green-700 font-bold">
                            {deliveredOrders.length}
                          </Typography>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <Typography variant="body2" className="text-gray-600">
                            Ventas confirmadas por clientes
                          </Typography>
                          <Typography variant="h6" className="text-green-700 font-bold">
                            {calculateConfirmedSales()} de {deliveredOrders.length}
                          </Typography>
                        </div>
                        <div className="bg-white p-3 rounded-md shadow-sm">
                          <Typography variant="body2" className="text-gray-600">
                            Monto total
                          </Typography>
                          <Typography variant="h6" className="text-green-700 font-bold">
                            ${calculateTotalSales().toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Cliente</TableCell>
                          <TableCell>Precio total</TableCell>
                          <TableCell>Dirección de entrega</TableCell>
                          <TableCell>Fecha de pedido</TableCell>
                          <TableCell>Fecha de entrega</TableCell>
                          <TableCell>Estado</TableCell>
                          <TableCell>Productos</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {deliveredOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            id={`order-row-${order.id}`}
                            className="transition-colors duration-300"
                          >
                            <TableCell>{order.user.name}</TableCell>
                            <TableCell>${Number(order.total_price).toLocaleString()}</TableCell>
                            <TableCell>
                              {order.shoppingaddress
                                ? `${order.shoppingaddress.address}, ${order.shoppingaddress.city}`
                                : "No disponible"}
                            </TableCell>
                            <TableCell>{formatearFecha(order.created_at)}</TableCell>
                            <TableCell>{formatearFecha(order.delivered_at)}</TableCell>
                            <TableCell>
                              {order.orderconfirmation ? (
                                <Tooltip
                                  title={`Confirmado el ${formatearFecha(order.orderconfirmation.confirmed_at)}`}
                                >
                                  <span className="flex items-center text-green-600">
                                    <ThumbsUp size={16} className="mr-1" />
                                    Recibido por cliente
                                  </span>
                                </Tooltip>
                              ) : (
                                <span className="text-yellow-600">Pendiente de confirmación</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button onClick={() => handleOpenOrderModal(order.id, deliveredOrders)}>
                                Ver Productos ({order.orderitem_set.length})
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="py-8 px-4">
                    <Alert severity="info" className="mb-4">
                      No tienes ventas completadas todavía
                    </Alert>
                    <div className="text-center mt-4">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setTabValue("pendientes")}
                        sx={{ backgroundColor: "#39A900", "&:hover": { backgroundColor: "#2c7d00" } }}
                      >
                        Ver órdenes pendientes
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}

            {tabValue === "ventas" && user?.role !== "seller" && (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Usuario</TableCell>
                      <TableCell>Precio total</TableCell>
                      <TableCell>Dirección de venta</TableCell>
                      <TableCell>Fecha de venta</TableCell>
                      <TableCell>Productos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dataLenght2 > 0 ? (
                      myProductsSells.map((product: MyOrder) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name.slice(0, 10)}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.description.slice(0, 20)}...</TableCell>
                          <TableCell>{formatearFecha(product.created)}</TableCell>
                          <TableCell>{product.count_in_sells}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="textSecondary">
                            No hay información disponible
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <div>
                  <Pagination
                    count={Math.ceil(dataLenght2 / 10)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    className="flex flex-row w-full justify-center my-6"
                  />
                </div>
              </>
            )}

            {tabValue === "productos" && (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="font-bold ">Nombre</TableCell>
                      <TableCell>Descripción</TableCell>
                      <TableCell>Calificación</TableCell>
                      <TableCell>Precio</TableCell>
                      <TableCell>Cantidad restante</TableCell>
                      <TableCell>Vendidos</TableCell>
                      <TableCell>F. Creación</TableCell>
                      <TableCell>F. Vencimiento</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {myProducts.map((product: MyOrder) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.name.slice(0, 12)}...</TableCell>
                        <TableCell>{product.description.slice(0, 20)}...</TableCell>
                        <TableCell>{product.rating}</TableCell>
                        <TableCell>${Number(product.price).toLocaleString()}</TableCell>
                        <TableCell>{product.count_in_stock}</TableCell>
                        <TableCell>{product.count_in_sells}</TableCell>
                        <TableCell className="w-32">{formatearFecha(product.created)}</TableCell>
                        <TableCell className="w-32">{formatearFecha(product.fecha_limite)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div>
                  <Pagination
                    count={Math.ceil(dataLenght / 10)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    className="flex flex-row w-full justify-center my-6"
                  />
                </div>
              </>
            )}
          </Box>
        </CardContent>
      </Card>

      <Modal open={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" id="modal-title" className="text-xl font-bold mb-4">
            Detalles de la Orden
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold ">ID</TableCell>
                <TableCell className="font-bold ">Nombre</TableCell>
                <TableCell className="font-bold ">Cantidad</TableCell>
                <TableCell className="font-bold ">Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrderProducts.map((product: MyOrder) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>$ {product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <Button
              onClick={() => setIsOrderModalOpen(false)}
              variant="contained"
              sx={{ backgroundColor: "#39A900", "&:hover": { backgroundColor: "#2c7d00" } }}
            >
              Cerrar
            </Button>
          </div>
        </Box>
      </Modal>
    </Box>
  )
}

export default UserProfile

