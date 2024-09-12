import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Checkbox,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { create_order } from "../api/orders";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { useCartStore } from "../hooks/cart";
import "./style.css";
import { get_paypal_user } from "../api/users";

const CartPage = () => {
  const [paypal, SetPaypal] = useState<any>();
  const [showSecretKey, setShowSecretKey] = useState(false); // Estado para mostrar/ocultar secret key

  const paypalUser = async () => {
    try {
      const response = await get_paypal_user(id);
      const data = response.data;
      SetPaypal(data);
    } catch (e) {}
  };
  useEffect(() => {
    paypalUser();
  }, []);

  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeAll = useCartStore((state) => state.removeAll);
  const removeProduct = useCartStore((state) => state.removeProduct);
  const cart = useCartStore((state) => state.cart);
  const total_price = useCartStore((state) => state.totalPrice);

  const [pagina, setPagina] = useState(1);
  const [productosPorPagina, setProductosPorPagina] = useState(8);
  const [selected, setSelected] = useState([]);

  const ultimaPagina = Math.ceil(cart.length / productosPorPagina);
  const primerProducto = (pagina - 1) * productosPorPagina;
  const ultimoProducto = primerProducto + productosPorPagina;
  const cartPagina = cart.slice(primerProducto, ultimoProducto);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postal_code, setPostal_code] = useState("");

  const [lenghtProd, setLenghtProd] = useState<number>(0);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // paypal

  // end paypal functions

  const createOrderMut = useMutation({
    mutationFn: create_order,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order created!");
      removeAll();
      navigate("/");
    },
    onError: () => {
      toast.error("Error!");
      navigate("/");
    },
  });

  const createOrder = (data, actions) => {
    if (cart.length > 0) {
      const translateCOPtoUSD = () => {
        const cop = total_price;
        const usd = cop / 70000;
        return usd.toFixed(2);
      };
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
      });
    } else {
      toast.warning("No se hay objetos para comprar");
    }
  };

  const onApprove = (data, actions) => {
    return actions.order
      .capture()
      .then(function (details) {
        handleSubmit(); // Enviar datos de la orden a tu backend
        toast.success(
          "Pago completado. Gracias, " + details.payer.name.given_name
        );
      })
      .catch((error) => {
        toast.error("Error al capturar el pago");
        console.error("Error en la captura de pago:", error);
      });
  };

  const handleSubmit = () => {
    try {
      const formData = new FormData();
      formData.append("order_items", JSON.stringify(cart));
      formData.append("total_price", total_price.toString());
      formData.append("address", address);
      formData.append("city", city);
      formData.append("postal_code", postal_code);

      create_order(formData);
      toast.success(
        "Se ha realizado correctamente su compra, espere a que llegue su pedido 😊"
      );
    } catch (error) {
      toast.warning("Ha ocurrido un error al registrar su compra");
    }
  };

  const handleDeleteSelected = () => {
    selected.forEach((id) => {
      const product = cart.find((p) => p.id === id);
      if (product) {
        removeProduct(product);
      }
    });
    setSelected([]); // Limpiar selección
    toast.success("Productos eliminados");
  };

  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("name");
  const [dense, setDense] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = cartPagina.map((p) => p.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cartPagina.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      [...cartPagina]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, cartPagina]
  );

  const headCells = [
    { id: "name", numeric: false, disablePadding: true, label: "Producto" },
    { id: "price", numeric: true, disablePadding: false, label: "Precio" },
    { id: "quantity", numeric: true, disablePadding: false, label: "Cantidad" },
    { id: "total", numeric: true, disablePadding: false, label: "Total" },
  ];

  useEffect(() => {
    const cartLengh = cart.length;
    setLenghtProd(cartLengh);
  }, []);

  return (
    <>
      <section className="dark:bg-gray-900 p-3 sm:p-5 mt-10">
        <div className="px-4 padre-divisor lg:px-12">
          <div className="divisor gap-6">
            <div className="card-bordered bg-white relative flex flex-col justify-start mb-2 shadow-md sm:rounded-lg overflow-hidden p-8">
              <div className="card-tite mb-5">
                <h4 className="text-2xl  text-center text-black font-bold mb-2">
                  Formulario de pago
                </h4>
                <h6 className="fs-16px text-black  text-center mb-4">
                  ¿Terminaste? ¡Haz tu pedido!
                </h6>
              </div>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div className="inputForm">
                  <label className="block mb-2 text-sm  text-black font-bold">
                    Dirección
                  </label>
                  <input
                    onChange={(e) => setAddress(e.target.value)}
                    value={address}
                    type="text"
                    className="inputForm border border-gray-300 text-black font-bold sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5"
                    placeholder="Dirección"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm  text-black font-bold">
                    Ciudad
                  </label>
                  <input
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    type="text"
                    className="inputForm border border-gray-300 text-black font-bold sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5"
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm  text-black font-bold">
                    Código Postal
                  </label>
                  <input
                    onChange={(e) => setPostal_code(e.target.value)}
                    value={postal_code}
                    type="text"
                    className="inputForm border border-gray-300 text-black font-bold sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5"
                    placeholder="Código Postal"
                  />
                </div>
                <div className="botonDePaypal overflow-auto mt-4">
                  <PayPalScriptProvider
                    options={{
                      clientId: paypal?.client_id,
                    }}
                  >
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </PayPalScriptProvider>
                </div>
              </form>
            </div>

            <div className="card-bordered  mb-2 bg-white relative shadow-md sm:rounded-lg overflow-hidden p-2">
              <h4 className="fs-22px font-bold text-center text-black  my-4">
                Tu carrito
              </h4>
              <h6 className="fs-16px text-black f text-center my-4">
                Estos son los productos en tu carrito
              </h6>
              <div className="flex flex-row justify-between mx-2 my-6">
                <h3 className="font-semibold text-black fs-18px">
                  <span>Total a pagar:</span>{" "}
                  <span className="text-[#39A900] ml-2 font-bold">
                    $ {total_price.toLocaleString("es-ES")}
                  </span>
                </h3>
                <h3 className="fs-16px font-semibold text-black">
                  {lenghtProd} producto{lenghtProd == 1 ? "" : "s"}
                </h3>
              </div>
              <div className="div-class">
                <TableContainer component={Paper}>
                  {selected.length > 0 && (
                    <div className="p-2 bg-gray-100 rounded-md flex items-center whitespace-nowrap justify-around deleteselecteds">
                      <DeleteIcon
                        onClick={handleDeleteSelected}
                        className="text-red-500 cursor-pointer"
                      />
                      {selected.length} seleccionado
                      {selected.length !== 1 ? "s" : ""}
                    </div>
                  )}

                  <Table
                    sx={{
                      minWidth: 750,
                      overflowY: "none",
                      paddingBottom: "2em",
                    }}
                    aria-labelledby="tableTitle"
                    size={dense ? "small" : "medium"}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell padding="checkbox">
                          <Checkbox
                            indeterminate={
                              selected.length > 0 &&
                              selected.length < cartPagina.length
                            }
                            checked={
                              cartPagina.length > 0 &&
                              selected.length === cartPagina.length
                            }
                            onChange={handleSelectAllClick}
                            inputProps={{
                              "aria-label": "select all desserts",
                            }}
                          />
                        </TableCell>
                        {headCells.map((headCell) => (
                          <TableCell
                            key={headCell.id}
                            align="center"
                            padding={
                              headCell.disablePadding ? "none" : "normal"
                            }
                            sortDirection={
                              orderBy === headCell.id ? order : false
                            }
                          >
                            <TableSortLabel
                              active={orderBy === headCell.id}
                              direction={
                                orderBy === headCell.id ? order : "asc"
                              }
                              onClick={(event) =>
                                handleRequestSort(event, headCell.id)
                              }
                              className="font-bold"
                            >
                              {headCell.label}
                              {orderBy === headCell.id ? (
                                <Box component="span" sx={visuallyHidden}>
                                  {order === "desc"
                                    ? "sorted descending"
                                    : "sorted ascending"}
                                </Box>
                              ) : null}
                            </TableSortLabel>
                          </TableCell>
                        ))}
                        <TableCell
                          align="center"
                          className="font-bold"
                          width={"100px"}
                        >
                          <p className="acciones-force">Acciones</p>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody sx={{ overflowY: "auto" }}>
                      {visibleRows.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
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
                            <TableCell
                              align="center"
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.name}
                            </TableCell>
                            <TableCell align="center">
                              $ {Number(row.price).toFixed(0)}
                            </TableCell>
                            <TableCell align="center">{row.quantity}</TableCell>
                            <TableCell align="center">
                              $ {(row.price * row.quantity).toFixed(0)}
                            </TableCell>
                            <td className="px-4 py-2 flex  text-black font-bold whitespace-nowrap">
                              <div className="flex  w-full space-x-3">
                                <button
                                  onClick={() => removeFromCart(row)}
                                  className="inline-flex items-center p-1 text-sm  text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 min-w-6"
                                  type="button"
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
                                </button>
                                <span className="fs-16px ">{row.quantity}</span>
                                <button
                                  onClick={() => addToCart(row)}
                                  className="inline-flex items-center p-1 text-sm  text-gray-500 bg-white border border-gray-300 rounded-full focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 min-w-6"
                                  type="button"
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
                                </button>
                              </div>
                            </td>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow
                          style={{ height: (dense ? 33 : 53) * emptyRows }}
                        >
                          <TableCell colSpan={8} />
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <div className=" w-12/12 text-center mx-auto">
                  <div className="w-12/12 text-center mx-auto">
                    <Pagination
                      count={Math.ceil(cart.length / rowsPerPage)} // Calcula el total de páginas basado en cart.length
                      page={page} // Página actual
                      showFirstButton // Muestra el botón "Primero"
                      showLastButton // Muestra el botón "Último"
                      onChange={handleChangePage} // Manejador para cambiar de página
                      className="flex flex-row w-full justify-center my-6" // Estilos de Tailwind
                    />
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartPage;

// Implementación de funciones adicionales necesarias para la tabla
interface Data {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: "asc" | "desc",
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
