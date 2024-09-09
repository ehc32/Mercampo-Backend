import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  Avatar,
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
  TextField,
} from "@mui/material";
import { Search } from "lucide-react";
import { get_solo_user, edit_user } from "../api/users";
import { get_orders, get_order_items } from "../api/orders";
import { useAuthStore } from "../hooks/auth";
import ModalEditProfile from "../components/shared/Modal/ModalEditUser";
import ModalRequestSeller from "../components/shared/Modal/ModalARequestSeller";
import ModalSellerConfig from "../components/shared/Modal/ModalConfigSeller";

export default function UserProfile() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState("compras");
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);

  const queryClient = useQueryClient();
  const { access: token } = useAuthStore();
  const id = token ? JSON.parse(atob(token.split(".")[1])).user_id : null;

  const { data: user, isLoading: isUserLoading } = useQuery(
    ["users", id],
    () => get_solo_user(id),
    {
      enabled: !!id,
    }
  );

  const { data: ordersData, isLoading: isOrdersLoading } = useQuery(
    ["orders"],
    get_orders
  );

  const editProfileMutation = useMutation(edit_user, {
    onSuccess: () => {
      toast.success("Perfil actualizado");
      queryClient.invalidateQueries(["users", id]);
    },
  });

  const handleOpenOrderModal = async (orderId) => {
    try {
      const items = await get_order_items(orderId);
      setSelectedOrderProducts(items);
      setIsOrderModalOpen(true);
    } catch (error) {
      toast.error("Error al cargar los productos de la orden");
    }
  };

  const filterData = (data, term) => {
    return (
        <Box sx={{ maxWidth: "lg", mx: "auto", p: 6, mt: "5em" }}>
            <Card className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent>
                    <Typography variant="h4" className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-6">
                        Perfil del usuario
                    </Typography>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-6">
                            <Avatar
                                src={user?.avatar ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}` : '/placeholder.svg?height=100&width=100'}
                                alt={user?.name || 'User Avatar'}
                                sx={{ width: 100, height: 100 }}
                                className="border-4 border-gray-200"
                            />
                            <div>
                                <Typography variant="h5" className="text-xl font-bold text-gray-800">{user?.name || 'N/A'}</Typography>
                                <Typography variant="body2" className="text-gray-600">{user?.phone || "Sin registrar"}</Typography>
                                <Typography variant="body2" className="text-gray-600">{user?.email || 'N/A'}</Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    {user?.role === "client" ? "Cliente" : user?.role === "seller" ? "Vendedor" : "Administrador"}
                                </Typography>
                            </div>
                        </div>
                        <div className="text-end w-30 p-4">
                            <ModalEditProfile user={user} editProfileMutation={editProfileMutation} />
                            {user?.role !== "seller" && user?.role !== "admin" && (
                                <ModalRequestSeller userId={id} requestSellerStatus={() => { }} />
                            )}
                            {(user?.role === "seller" || user?.role === "admin") && (
                                <ModalSellerConfig />
                            )}
                        </div>
                    </div>
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
                        <TextField
                            type="search"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-1/2 border-gray-300 focus:ring-[#39A900] focus:border-[#39A900]"
                        />
                        <Tabs
                            value={tabValue}
                            onChange={(_, newValue) => setTabValue(newValue)}
                            textColor="primary"
                            indicatorColor="primary"
                            sx={{ '.MuiTabs-indicator': { backgroundColor: '#39A900' } }}
                        >
                            <Tab label="Compras" value="compras" sx={{
                                '&.Mui-selected': { color: '#39A900' },
                            }}  className="focus:outline-none"/>
                            {user?.role !== "client" && <Tab label="Ventas" value="ventas" sx={{
                                '&.Mui-selected': { color: '#39A900' },
                            }}  className="focus:outline-none"/> }
                            {user?.role !== "client" && <Tab label="Mis productos" value="productos" sx={{
                                '&.Mui-selected': { color: '#39A900' },
                            }}  className="focus:outline-none"/> }
                        </Tabs>
                    </div>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Precio total</TableCell>
                                <TableCell>Dirección de compra</TableCell>
                                <TableCell>Fecha de pedido</TableCell>
                                <TableCell>Fecha de entrega</TableCell>
                                <TableCell>Productos</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filterData(ordersData, searchTerm).map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.user || "Usuario no especificado"}</TableCell>
                                    <TableCell>$ {order.total_price}</TableCell>
                                    <TableCell>{order.shipping_address?.city || "Sin registrar"}</TableCell>
                                    <TableCell>{order.created_at ? new Date(order.created_at).toLocaleDateString() : "Fecha no disponible"}</TableCell>
                                    <TableCell>{order.delivered_at ? new Date(order.delivered_at).toLocaleDateString() : "En espera"}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => handleOpenOrderModal(order.id)}>
                                            <Search className="h-4 w-4" color="#39A900" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Modal
                open={isOrderModalOpen}
                onClose={() => setIsOrderModalOpen(false)}
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                }}>
                    <Typography variant="h6" id="modal-title" className="text-xl font-bold mb-4">
                        Detalles de la Orden
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedOrderProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.quantity}</TableCell>
                                    <TableCell>$ {product.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Modal>
        </Box>
    );
  };

  if (isUserLoading || isOrdersLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Box
      sx={{
        maxWidth: "lg",
        mx: "auto",
        p: 6,
        mt: "5em",
        "@media (max-width: 640px)": {
          p: 2,
        },
        "@media (min-width: 641px) and (max-width: 1024px)": {
          p: 4,
        },
      }}
    >
      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardContent>
          <Typography
            variant="h4"
            className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-6"
          >
            Perfil del usuario
          </Typography>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-6">
              <Avatar
                src={
                  user?.avatar
                    ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`
                    : "/placeholder.svg?height=100&width=100"
                }
                alt={user?.name || "User Avatar"}
                sx={{ width: 100, height: 100 }}
                className="border-4 border-gray-200"
              />
              <div>
                <Typography
                  variant="h5"
                  className="text-xl font-bold text-gray-800"
                >
                  {user?.name || "N/A"}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {user?.phone || "Sin registrar"}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {user?.email || "N/A"}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {user?.role === "client"
                    ? "Cliente"
                    : user?.role === "seller"
                      ? "Vendedor"
                      : "Administrador"}
                </Typography>
              </div>
            </div>
            <div className="text-end w-30 p-4">
              <ModalEditProfile
                user={user}
                editProfileMutation={editProfileMutation}
              />
              {user?.role !== "seller" && user?.role !== "admin" && (
                <ModalRequestSeller
                  userId={id}
                  requestSellerStatus={() => {}}
                />
              )}
              {(user?.role === "seller" || user?.role === "admin") && (
                <ModalSellerConfig />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-lg">
        <CardContent>
          <Typography
            variant="h4"
            className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-2"
          >
            Registro de compraventa
          </Typography>
          <Typography
            variant="subtitle1"
            className="sub-titulo-sala-compra-light text-gray-600 mb-6"
          >
            Visualiza tus órdenes de productos
            {user?.role === "seller" && (
              <span className="text-[#39A900]">
                {" "}
                o ventas que has realizado
              </span>
            )}
            {user?.role === "admin" && (
              <span className="text-[#39A900]">
                {" "}
                o ventas que has realizado
              </span>
            )}
          </Typography>

          <div className="flex justify-between items-center py-4">
            <TextField
              type="search"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-1/2 border-gray-300 focus:ring-[#39A900] focus:border-[#39A900]"
            />
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
                sx={{
                  "&.Mui-selected": { color: "#39A900" },
                }}
                className="focus:outline-none"
              />
              {user?.role !== "client" && (
                <Tab
                  label="Ventas"
                  value="ventas"
                  sx={{
                    "&.Mui-selected": { color: "#39A900" },
                  }}
                  className="focus:outline-none"
                />
              )}
            </Tabs>
          </div>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuario</TableCell>
                <TableCell>Precio total</TableCell>
                <TableCell>Dirección de compra</TableCell>
                <TableCell>Fecha de pedido</TableCell>
                <TableCell>Fecha de entrega</TableCell>
                <TableCell>Productos</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filterData(ordersData, searchTerm).map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    {order.user || "Usuario no especificado"}
                  </TableCell>
                  <TableCell>$ {order.total_price}</TableCell>
                  <TableCell>
                    {order.shipping_address?.city || "Sin registrar"}
                  </TableCell>
                  <TableCell>
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "Fecha no disponible"}
                  </TableCell>
                  <TableCell>
                    {order.delivered_at
                      ? new Date(order.delivered_at).toLocaleDateString()
                      : "En espera"}
                  </TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenOrderModal(order.id)}>
                      <Search className="h-4 w-4" color="#39A900" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
          }}
        >
          <Typography
            variant="h6"
            id="modal-title"
            className="text-xl font-bold mb-4"
          >
            Detalles de la Orden
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Cantidad</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrderProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>$ {product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Modal>
    </Box>
  );
}
