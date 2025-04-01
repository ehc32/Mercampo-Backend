"use client"

import DeleteIcon from "@mui/icons-material/Delete"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import PaymentIcon from "@mui/icons-material/Payment"
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
  TextField,
  Grid,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Button as MuiButton,
} from "@mui/material"
import { visuallyHidden } from "@mui/utils"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { create_order } from "../api/orders"
import { useCartStore } from "../hooks/cart"
import "./../global/style.css"
import { get_paypal_user } from "../api/users"
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material"
import { get_mercadopago_config } from "../api/mercadopago"
import { create_temp_preference } from "../api/orders"

interface Data {
  id: number
  name: string
  price: number
  quantity: number
  total: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const CartPage = () => {
  const [paypal, SetPaypal] = useState<any>()
  const [showSecretKey, setShowSecretKey] = useState(false)
  const [id, SetPayPalUserId] = useState<any>()
  const [mercadoPagoConfig, setMercadoPagoConfig] = useState(null)
  const cart = useCartStore((state) => state.cart)

  const paypalUser = async () => {
    try {
      const response = await get_paypal_user(id)
      const data = response.data
      SetPaypal(data)
    } catch (e) {
      console.error("Error fetching PayPal user:", e)
    }
  }

  useEffect(() => {
    paypalUser()
  }, [])

  const removeFromCart = useCartStore((state) => state.removeFromCart)
  const addToCart = useCartStore((state) => state.addToCart)
  const removeAll = useCartStore((state) => state.removeAll)
  const removeProduct = useCartStore((state) => state.removeProduct)
  const total_price = useCartStore((state) => state.totalPrice)

  const [pagina, setPagina] = useState(1)
  const [productosPorPagina, setProductosPorPagina] = useState(8)
  const [selected, setSelected] = useState<number[]>([])

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [postal_code, setPostal_code] = useState("")

  const [lenghtProd, setLenghtProd] = useState<number>(0)

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  useEffect(() => {
    // Get seller ID from the first product in cart (if exists)
    const fetchMercadoPagoConfig = async () => {
      if (cart.length > 0 && cart[0].user) {
        try {
          const sellerId = cart[0].user
          const config = await get_mercadopago_config(sellerId)
          setMercadoPagoConfig(config)
        } catch (error) {
          console.error("Error fetching Mercado Pago config:", error)
        }
      }
    }

    fetchMercadoPagoConfig()
  }, [cart])

  // Create Mercado Pago preference
  const createMercadoPagoPreference = async () => {
    if (cart.length > 0) {
      try {
        const formData = new FormData()

        // Convert cart items to a proper JSON string
        const orderItemsJson = JSON.stringify(cart)
        formData.append("order_items", orderItemsJson)

        // Make sure all other values are strings
        formData.append("total_price", total_price.toString())
        formData.append("address", address)
        formData.append("city", city)
        formData.append("postal_code", postal_code)

        // Get seller_id from the first product if available
        if (cart[0].user) {
          formData.append("seller_id", cart[0].user.toString())
        }

        const preference = await create_temp_preference(formData)

        // Handle the preference (redirect to payment page or show checkout)
        if (preference && preference.init_point) {
          window.location.href = preference.init_point
        } else {
          toast.error("Error en la respuesta del servidor")
        }
      } catch (error) {
        console.error("Error creating payment preference:", error)
        toast.error("Error al crear preferencia de pago")
      }
    } else {
      toast.warning("No hay productos en el carrito")
    }
  }

  const createOrderMut = useMutation({
    mutationFn: create_order,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      toast.success("Order created!")
      removeAll()
      navigate("/")
    },
    onError: () => {
      toast.error("Error!")
      navigate("/")
    },
  })

  const createOrder = (data, actions) => {
    if (cart.length > 0) {
      const translateCOPtoUSD = () => {
        const cop = total_price
        const usd = cop / 70000
        return usd.toFixed(2)
      }
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              value: translateCOPtoUSD(),
            },
          },
        ],
        application_context: {
          shipping_preference: "NO_SHIPPING",
        },
      })
    } else {
      toast.warning("No hay objetos para comprar")
    }
  }

  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then((details) => {
        handleSubmit() // Enviar datos de la orden a tu backend
        toast.success("Pago completado. Gracias, " + details.payer.name.given_name)
      })
      .catch((error) => {
        toast.error("Error al capturar el pago")
        console.error("Error en la captura de pago:", error)
      })
  }

  const handleSubmit = () => {
    try {
      const formData = new FormData()
      formData.append("order_items", JSON.stringify(cart))
      formData.append("total_price", total_price.toString())
      formData.append("address", address)
      formData.append("city", city)
      formData.append("postal_code", postal_code)

      create_order(formData)
      toast.success("Se ha realizado correctamente su compra, espere a que llegue su pedido 😊")
    } catch (error) {
      toast.warning("Ha ocurrido un error al registrar su compra")
    }
  }

  const handleDeleteSelected = () => {
    selected.forEach((id) => {
      const product = cart.find((p) => p.id === id)
      if (product) {
        removeProduct(product)
      }
    })
    setSelected([]) // Limpiar selección
    toast.success("Productos eliminados")
  }

  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [orderBy, setOrderBy] = useState<string>("name")
  const [dense, setDense] = useState(false)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(7)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cart.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((p) => p.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cart.length) : 0

  const visibleRows = React.useMemo(
    () => [...cart].sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, cart],
  )

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Producto" },
    { id: "price", numeric: true, disablePadding: false, label: "Precio" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Cantidad" },
    { id: "total", numeric: true, disablePadding: false, label: "Total" },
  ]

  useEffect(() => {
    const cartLengh = cart.length
    setLenghtProd(cartLengh)
  }, [cart])

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Typography variant="h4" component="h1" className="text-center mb-8 font-bold">
          <ShoppingCartIcon sx={{ mr: 1, verticalAlign: "middle" }} />
          Carrito de Compras
        </Typography>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardHeader
                title={
                  <Typography variant="h5" className="font-bold">
                    Tu Carrito
                  </Typography>
                }
                subheader={
                  <Typography variant="subtitle1" color="text.secondary">
                    {lenghtProd} producto{lenghtProd !== 1 ? "s" : ""} en tu carrito
                  </Typography>
                }
              />
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <Typography variant="h6" className="font-semibold">
                    Total: <span className="text-green-600 ml-2">$ {total_price.toLocaleString()}</span>
                  </Typography>

                  {cart.length > 0 && (
                    <MuiButton variant="outlined" color="error" onClick={() => removeAll()} startIcon={<DeleteIcon />}>
                      Vaciar Carrito
                    </MuiButton>
                  )}
                </div>

                <TableContainer component={Paper} elevation={0} className="border border-gray-200 rounded-lg">
                  {selected.length > 0 && (
                    <div className="p-3 bg-blue-50 rounded-t-lg flex items-center justify-between">
                      <Typography variant="body2">
                        {selected.length} producto{selected.length !== 1 ? "s" : ""} seleccionado
                        {selected.length !== 1 ? "s" : ""}
                      </Typography>
                      <MuiButton size="small" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteSelected}>
                        Eliminar
                      </MuiButton>
                    </div>
                  )}

                  <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? "small" : "medium"}>
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={selected.length > 0 && selected.length < visibleRows.length}
                            checked={visibleRows.length > 0 && selected.length === visibleRows.length}
                            onChange={handleSelectAllClick}
                            inputProps={{
                              "aria-label": "select all desserts",
                            }}
                          />
                        </TableCell>
                        {headCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align={headCell.numeric ? "right" : "left"}
                            padding={headCell.disablePadding ? "none" : "normal"}
                            sortDirection={orderBy === headCell.id ? order : false}
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={orderBy === headCell.id ? order : "asc"}
                              onClick={(event) => handleRequestSort(event, headCell.id)}
                              className="font-bold"
                            >
                              {headCell.label}
                              {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                        <TableCell align="center" className="font-bold">
                          Acciones
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(row.id)
                        const labelId = `enhanced-table-checkbox-${index}`
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                onChange={(event) => handleClick(event, row.id)}
                                inputProps={{
                                  "aria-labelledby": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell component="th" id={labelId} scope="row" padding="none">
                              <Typography variant="body1" className="font-medium pl-2">
                                {row.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">$ {Number(row.price).toLocaleString()}</TableCell>
                            <TableCell align="right">{row.quantity}</TableCell>
                            <TableCell align="right">$ {(row.price * row.quantity).toLocaleString()}</TableCell>
                            <TableCell align="center">
                              <div className="flex items-center justify-center space-x-2">
                                <IconButton
                                  size="small"
                                  onClick={() => removeFromCart(row)}
                                  className="border border-gray-300 bg-white hover:bg-gray-100"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M18 12H6"
                                    ></path>
                                  </svg>
                                </IconButton>
                                <span className="w-8 text-center">{row.quantity}</span>
                                <IconButton
                                  size="small"
                                  onClick={() => addToCart(row)}
                                  className="border border-gray-300 bg-white hover:bg-gray-100"
                                >
                                  <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    ></path>
                                  </svg>
                                </IconButton>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                      {cart.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                              No hay productos en el carrito
                            </Typography>
                            <MuiButton variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => navigate("/")}>
                              Continuar Comprando
                            </MuiButton>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>

                  <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={cart.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    ActionsComponent={(props) => (
                      <div className="flex items-center">
                        <IconButton
                          onClick={(event) => props.onPageChange(event, props.page - 1)}
                          disabled={props.page === 0}
                          aria-label="Página anterior"
                        >
                          <KeyboardArrowLeft />
                        </IconButton>
                        <IconButton
                          onClick={(event) => props.onPageChange(event, props.page + 1)}
                          disabled={props.page >= Math.ceil(props.count / props.rowsPerPage) - 1}
                          aria-label="Página siguiente"
                        >
                          <KeyboardArrowRight />
                        </IconButton>
                      </div>
                    )}
                  />
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Checkout Form */}
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardHeader
                title={
                  <Typography variant="h5" className="font-bold">
                    <LocationOnIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                    Datos de Envío
                  </Typography>
                }
                subheader="Completa tus datos para finalizar la compra"
              />
              <CardContent>
                <form className="space-y-4">
                  <TextField
                    label="Dirección"
                    variant="outlined"
                    fullWidth
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ingresa tu dirección"
                    required
                    margin="normal"
                  />

                  <TextField
                    label="Ciudad"
                    variant="outlined"
                    fullWidth
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ingresa tu ciudad"
                    required
                    margin="normal"
                  />

                  <TextField
                    label="Código Postal"
                    variant="outlined"
                    fullWidth
                    value={postal_code}
                    onChange={(e) => setPostal_code(e.target.value)}
                    placeholder="Ingresa tu código postal"
                    required
                    margin="normal"
                  />
                </form>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" className="font-bold mb-3">
                  <PaymentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Métodos de Pago
                </Typography>

                {/* PayPal Payment */}
                <Paper elevation={0} className="border border-gray-200 p-4 rounded-lg mb-4">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    PayPal
                  </Typography>
                  <div className="paypal-container">
                    <PayPalScriptProvider
                      options={{
                        clientId: paypal?.client_id || "test_client_id",
                      }}
                    >
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        style={{ layout: "horizontal" }}
                        disabled={cart.length === 0}
                      />
                    </PayPalScriptProvider>

                    <Divider sx={{ my: 2 }} />

                    <MuiButton
                      variant="contained"
                      fullWidth
                      onClick={handleSubmit}
                      disabled={cart.length === 0 || !address || !city || !postal_code}
                      sx={{
                        bgcolor: "#0070ba",
                        "&:hover": { bgcolor: "#005ea6" },
                        color: "white",
                        py: 1.5,
                        mt: 1,
                      }}
                    >
                      Pagar directamente con PayPal
                    </MuiButton>
                  </div>
                </Paper>

                {/* Mercado Pago Payment */}
                <Paper elevation={0} className="border border-gray-200 p-4 rounded-lg">
                  <Typography variant="subtitle1" className="font-medium mb-3">
                    Mercado Pago
                  </Typography>
                  <MuiButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={createMercadoPagoPreference}
                    disabled={!mercadoPagoConfig || cart.length === 0}
                    sx={{
                      bgcolor: "#009ee3",
                      "&:hover": { bgcolor: "#008dcb" },
                      py: 1.5,
                    }}
                  >
                    Pagar con Mercado Pago
                  </MuiButton>
                </Paper>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default CartPage

