import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
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
  TextField
} from '@mui/material';
import { Search } from 'lucide-react';
import { get_solo_user, edit_user } from '../api/users';
import { get_orders, get_order_items } from '../api/orders';
import { useAuthStore } from '../hooks/auth';
import { get_all_products_by_user, get_products_in_sells_by_user } from '../api/products';
import ProfileTables from '../components/profile/profileTables';

const UserProfile = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [tabValue, setTabValue] = useState("compras");
  const [myProducts, setMyProducts] = useState([]);
  const [dataLenght, setDataLenght] = useState(0);
  const [myProductsSells, setMyProductsSells] = useState([]);
  const [dataLenght2, setDataLenght2] = useState(0);
  const [orders, setOrders] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);

  const { access: token } = useAuthStore();
  const id = token ? JSON.parse(atob(token.split(".")[1])).user_id : null;

  const { data: user, isLoading, isError } = useQuery(
    ["users", id],
    () => get_solo_user(id),
    {
      enabled: !!id,
    }
  );

  function formatearFecha(fechaISO: any) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, '0'); // Asegura dos dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Suma 1 y asegura dos dígitos
    const year = fecha.getFullYear();
    return `${dia}-${mes}-${year}`;
  }

  const get_my_products = async (id: number) => {
    const response = await get_all_products_by_user(id);
    setMyProducts(response.data);
    setDataLenght(response.meta.count);
  };

  const get_sells_by_user2 = async (id: number) => {
    const response = await get_products_in_sells_by_user(id);
    setMyProductsSells(response.data);  
    setDataLenght2(response.meta.count);
  };

  const handleOpenOrderModal = async (orderId: number) => {
    try {
      const items = await get_order_items(orderId);
      setSelectedOrderProducts(items);
      setIsOrderModalOpen(true);
    } catch (error) {
      toast.error("Error al cargar los productos de la orden");
    }
  };

  useEffect(() => {
    if (id) {
      get_my_products(id);
    }
  }, [id]);

  useEffect(() => {
    if (user && (user.role === "seller" || user.role === "admin")) {
      get_sells_by_user2(id);
    }
  }, [user, id]);

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto", p: 6, mt: ".1em" }}>
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
              <Tab label="Compras" value="compras" sx={{ '&.Mui-selected': { color: '#39A900' } }} className='focus:outline-none' />
              {user?.role !== "client" && <Tab label="Ventas" value="ventas" sx={{ '&.Mui-selected': { color: '#39A900' } }} className='focus:outline-none' />}
              {user?.role !== "client" && <Tab label="Mis productos" value="productos" sx={{ '&.Mui-selected': { color: '#39A900' } }} className='focus:outline-none' />}
            </Tabs>
          </div>

          <Box>
            {tabValue === "compras" && (
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
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.user}</TableCell>
                      <TableCell>${order.total_price}</TableCell>
                      <TableCell>{order.delivery_address}</TableCell>
                      <TableCell>{order.order_date}</TableCell>
                      <TableCell>{order.delivery_date}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleOpenOrderModal(order.id)}>Ver Productos</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tabValue === "ventas" && (
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
                      myProductsSells.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.description}</TableCell>
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

            {tabValue === "productos" && (<>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
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
                  {myProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.description}</TableCell>
                      <TableCell>{product.rating}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.count_in_stock}</TableCell>
                      <TableCell>{product.count_in_sells}</TableCell>
                      <TableCell className='w-32'>{formatearFecha(product.created)}</TableCell>
                      <TableCell className='w-32'>{formatearFecha(product.fecha_limite)}</TableCell>
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

export default UserProfile;
