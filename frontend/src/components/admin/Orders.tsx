"use client"

import SearchIcon from "@mui/icons-material/Search"
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Modal from "@mui/material/Modal"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { get_order_items, get_orders } from "../../api/orders"

interface Props {
  results?: any
}

const Orders = ({ results }: Props) => {
  const [data, setData] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedOrderProducts, setSelectedOrderProducts] = useState<any[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null)

  let contador = 0

  const bring_orders = async () => {
    try {
      const response = await get_orders()
      setData(response)
      contador++
      if (contador == 2) {
        toast.success("Órdenes cargadas con éxito")
        contador = 0
      }
    } catch (e) {
      toast.error("Error al cargar las órdenes registradas")
    }
  }

  const fetchOrderProducts = async (orderId: number) => {
    try {
      const response = await get_order_items(orderId)
      setSelectedOrderProducts(response)
    } catch (e) {
      toast.error("Error al cargar los productos de la orden")
    }
  }

  useEffect(() => {
    bring_orders()
  }, [])

  const handleOpenModal = (orderId: number) => {
    setSelectedOrderId(orderId)
    fetchOrderProducts(orderId)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedOrderProducts([])
    setSelectedOrderId(null)
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <h2 className="text-xl font-semibold my-3 text-center text-black">Lista de órdenes</h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2 py-1 text-center">
              Usuario
            </th>
            <th scope="col" className="px-2 py-1 text-center">
              Precio total
            </th>
            <th scope="col" className="px-2 py-1 text-center">
              Dirección de compra
            </th>
            <th scope="col" className="px-2 py-1 text-center">
              Fecha de pedido
            </th>
            <th scope="col" className="px-2 py-1 text-center">
              Fecha de entrega
            </th>
            <th scope="col" className="px-2 py-1 text-center">
              Productos
            </th>
          </tr>
        </thead>
        {data && data.length > 0 ? (
          <tbody>
            {data.map((o: any) => (
              <tr
                key={o.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600"
              >
                <td className="px-2 py-1 text-center">{o.user?.name || "Sin usuario"}</td>
                <td className="px-2 py-1 text-center">$ {o.total_price}</td>
                <td className="px-2 py-1 text-center">
                  {o.shoppingaddress?.city ? o.shoppingaddress.city : "Sin registrar"}
                </td>
                <td className="px-2 py-1 text-center">{o.created_at.slice(0, 10)}</td>
                <td className="px-2 py-1 text-center">{o.delivered_at ? o.delivered_at.slice(0, 10) : "En espera"}</td>
                <td className="px-2 py-1 text-center">
                  <IconButton onClick={() => handleOpenModal(o.id)}>
                    <SearchIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={7} className="px-6 py-1 text-center">
                No se encontraron órdenes
              </td>
            </tr>
          </tbody>
        )}
      </table>

      {/* Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 500,
            maxHeight: 700,
            padding: 2,
            backgroundColor: "background.paper",
            margin: "auto",
            marginTop: "10%",
          }}
        >
          <h2 className="text-xl font-semibold my-3 text-center text-black">Lista de productos</h2>
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3 text-center">
                  Nombre
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Precio
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Cantidad
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedOrderProducts.length > 0 ? (
                selectedOrderProducts.map((product: any) => (
                  <tr
                    key={product.id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600"
                  >
                    <td className="px-6 py-1 text-center">{product.product?.name || product.product}</td>
                    <td className="px-6 py-1 text-center">$ {product.price}</td>
                    <td className="px-6 py-1 text-center">{product.quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-1 text-center">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="w-full text-center">
            <button onClick={handleCloseModal} className="mt-4 px-4 py-2 bg-[#39A900] text-white rounded w-6/12">
              Cerrar
            </button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default Orders

