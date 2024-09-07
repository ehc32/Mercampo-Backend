import SearchIcon from '@mui/icons-material/Search'; // Asegúrate de importar el icono
import { IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Input from "@mui/material/Input";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { get_order_items, get_orders } from "../api/orders";
import { edit_user, get_solo_user } from "../api/users";
import ModalRequestSeller from "../components/shared/Modal/ModalARequestSeller";
import ModalEditProfile from "../components/shared/Modal/ModalEditUser";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { useAuthStore } from "../hooks/auth";
import { Token } from "../Interfaces";

export default function UserProfile2() {
    const [searchTerm, setSearchTerm] = useState("");
    const [tabValue, setTabValue] = useState("compras");
    const [stateName, setStateName] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>("");
    const [isOrderItemsModalOpen, setIsOrderItemsModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [orderItems, setOrderItems] = useState([]);
    const [selectedOrderProducts, setSelectedOrderProducts] = useState([]);
    const [ordersData, setOrdersData] = useState<any[]>([]);

    const token: string = useAuthStore.getState().access;
    const tokenDecoded: Token = jwt_decode(token);
    const id = tokenDecoded.user_id;

    const queryClient = useQueryClient();

    // Consultar usuario actual
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
        queryKey: ["users", id],
        queryFn: () => get_solo_user(id),
    });

    const editProfileMut = useMutation(
        async (data: { name: string; avatar: File | null; email: string; role: string; phone: string }) => {
            await edit_user(data);
            toast.success("Perfil actualizado");
        }
    );

    useEffect(() => {
        if (user) {
            setStateName(user.name);
            setImage(user.avatar);
        }
    }, [user]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFilePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setFilePreview("");
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (user) {
            editProfileMut.mutate({
                name: stateName,
                avatar: image,
                email: user.email,
                role: user.role,
                phone: user.phone || "",
            });
        }
    };

    const handleOrderClick = (orderId: number) => {
        get_order_items(orderId)
            .then((items) => {
                setOrderItems(items);
                setIsOrderItemsModalOpen(true);
            })
            .catch((error) => {
                toast.error("Error fetching order items");
                console.error(error);
            });
    };

    const profileData = {
        fullName: user ? user.name : "",
        phone: user?.phone || "Sin registrar",
        email: user?.email || "",
        role: user?.role || "",
        avatar: user ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}` : "",
    };

    const bring_orders = async () => {
        try {
            const response = await get_orders();
            setOrdersData(response);
            toast.success('Órdenes cargadas con éxito');
        } catch (e) {
            toast.error('Error al cargar las órdenes registradas');
        }
    };

    useEffect(() => {
        bring_orders();
    }, []);

    const handleOpenOrderModal = (orderId: number) => {
        setSelectedOrderId(orderId);
        get_order_items(orderId)
            .then((items) => setSelectedOrderProducts(items))
            .catch((error) => {
                toast.error('Error al cargar los productos de la orden');
                console.error(error);
            });
        setIsOrderModalOpen(true);
    };

    const handleCloseOrderModal = () => {
        setSelectedOrderProducts([]);
        setSelectedOrderId(null);
        setIsOrderModalOpen(false);
    };

    const filterData = (data: any[], term: string) => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(term.toLowerCase())
            )
        );
    };

    return (
        <>
            <AsideFilter />
            <Box sx={{ maxWidth: "lg", mx: "auto", p: 6, mt: "5em" }}>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h2 className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-6">Perfil del usuario</h2>

                    <Card sx={{ my: "2em" }} className="flex flex-row justify-between items-center bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardContent className="flex items-center space-x-6">
                            <Avatar
                                src={profileData.avatar}
                                alt={profileData.fullName}
                                sx={{ width: 100, height: 100 }}
                                className="border-4 border-gray-200"
                            />
                            <div>
                                <Typography variant="h5" className="text-xl font-bold text-gray-800">{profileData.fullName}</Typography>
                                <Typography variant="body2" className="text-gray-600">{profileData.phone}</Typography>
                                <Typography variant="body2" className="text-gray-600">{profileData.email}</Typography>
                                <Typography variant="body2" className="text-gray-600">
                                    {profileData.role === "client" ? "Cliente" : profileData.role === "seller" ? "Vendedor" : "Administrador"}
                                </Typography>
                            </div>
                        </CardContent>
                        <div className="text-end w-30 p-4">
                            <ModalEditProfile
                                stateName={stateName}
                                setStateName={setStateName}
                                image={image}
                                handleFileChange={handleFileChange}
                                removeImage={removeImage}
                                handleSubmit={handleSubmit}
                            />
                            <ModalRequestSeller userId={id} requestSellerStatus={() => { }} />
                        </div>
                    </Card>
                    <div className="mt-8">
                        <h2 className="titulo-sala-compra-light text-2xl font-semibold text-gray-800 mb-2">
                            Registro de compraventa
                        </h2>
                        <h4 className="sub-titulo-sala-compra-light text-gray-600 mb-6">
                            Visualiza las órdenes de productos que has realizado{" "}
                            {profileData.role === "seller" && <span className="text-green-600"> o ventas que has logrado</span>}
                            {profileData.role === "admin" && <span className="text-green-600"> o ventas que has logrado</span>}
                        </h4>
                    </div>
                    <div className="flex flex-row justify-between items-center py-4">
                        <Input
                            type="search"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            sx={{ width: "50%", padding: ".1em" }}
                            className="border-gray-300 focus:ring-green-500 focus:border-green-500"
                        />
                        <Box>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                TabIndicatorProps={{
                                    style: { backgroundColor: "#39a900" },
                                }}
                                sx={{
                                    mb: 3,
                                    '& .Mui-selected': { color: '#39a900' },
                                }}
                            >
                                <Tab label="Compras" value="compras" sx={{
                                    '&.Mui-selected': { color: '#39A900' },
                                }} className="focus:outline-none" />
                                {profileData.role !== "client" && <Tab label="Ventas" value="ventas" sx={{
                                    '&.Mui-selected': { color: '#39A900' },
                                }} className="focus:outline-none" />}
                            </Tabs>
                        </Box>
                    </div>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-2 py-1 text-center">Usuario</th>
                                <th scope="col" className="px-2 py-1 text-center">Precio total</th>
                                <th scope="col" className="px-2 py-1 text-center">Dirección de compra</th>
                                <th scope="col" className="px-2 py-1 text-center">Fecha de pedido</th>
                                <th scope="col" className="px-2 py-1 text-center">Fecha de entrega</th>
                                <th scope="col" className="px-2 py-1 text-center">Productos</th>
                            </tr>
                        </thead>
                        {ordersData && ordersData.length > 0 ? (
                            <tbody>
                                {filterData(ordersData, searchTerm).map((order) => (
                                    <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600">
                                        <td className="px-2 py-1 text-center">{order.user || "Usuario no especificado"}</td>
                                        <td className="px-2 py-1 text-center">$ {order.total_price}</td>
                                        <td className="px-2 py-1 text-center">{order.shipping_address.city || "Sin registrar"}</td>
                                        <td className="px-2 py-1 text-center">{order.created_at ? order.created_at.slice(0, 10) : "Fecha no disponible"}</td>
                                        <td className="px-2 py-1 text-center">{order.delivered_at ? order.delivered_at.slice(0, 10) : "En espera"}</td>
                                        <td className="px-2 py-1 text-center">
                                            <IconButton onClick={() => handleOpenOrderModal(order.id)}>
                                                <SearchIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={6} className="px-6 py-1 text-center">No se encontraron órdenes</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </div>
            </Box>

            {/* Modal for Order Items */}
            <Modal
                open={isOrderItemsModalOpen}
                onClose={() => setIsOrderItemsModalOpen(false)}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6" id="modal-title" className="text-xl font-bold mb-4">
                        Detalles de la Orden
                    </Typography>
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-2 py-1 text-center">Usuario</th>
                                <th scope="col" className="px-2 py-1 text-center">Precio total</th>
                                <th scope="col" className="px-2 py-1 text-center">Dirección de compra</th>
                                <th scope="col" className="px-2 py-1 text-center">Fecha de pedido</th>
                                <th scope="col" className="px-2 py-1 text-center">Fecha de entrega</th>
                                <th scope="col" className="px-2 py-1 text-center">Productos</th>
                            </tr>
                        </thead>
                        {ordersData && ordersData.length > 0 ? (
                            <tbody>
                                {filterData(ordersData, searchTerm).map((order) => (
                                    <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600">
                                        <td className="px-2 py-1 text-center">{order.user || "Usuario no especificado"}</td>
                                        <td className="px-2 py-1 text-center">$ {order.total_price}</td>
                                        <td className="px-2 py-1 text-center">{order.shipping_address.city || "Sin registrar"}</td>
                                        <td className="px-2 py-1 text-center">{order.created_at ? order.created_at.slice(0, 10) : "Fecha no disponible"}</td>
                                        <td className="px-2 py-1 text-center">{order.delivered_at ? order.delivered_at.slice(0, 10) : "En espera"}</td>
                                        <td className="px-2 py-1 text-center">
                                            <IconButton onClick={() => handleOpenOrderModal(order.id)}>
                                                <SearchIcon />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            <tbody>
                                <tr>
                                    <td colSpan={6} className="px-6 py-1 text-center">No se encontraron órdenes</td>
                                </tr>
                            </tbody>
                        )}
                    </table>
                </Box>
            </Modal>

            {/* Modal for Order Details */}
            <Modal
                open={isOrderModalOpen}
                onClose={handleCloseOrderModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ ...modalStyle }}>
                    <Typography variant="h6" id="modal-title" className="text-xl font-bold mb-4">
                        Detalles de la Orden
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell className="font-semibold text-gray-800">ID</TableCell>
                                <TableCell className="font-semibold text-gray-800">Nombre</TableCell>
                                <TableCell className="font-semibold text-gray-800">Cantidad</TableCell>
                                <TableCell className="font-semibold text-gray-800">Precio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedOrderProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="text-sm text-gray-600">{product.id}</TableCell>
                                    <TableCell className="text-sm text-gray-600">{product.name}</TableCell>
                                    <TableCell className="text-sm text-gray-600">{product.quantity}</TableCell>
                                    <TableCell className="text-sm text-gray-600">$ {product.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </Modal>


        </>
    );
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
