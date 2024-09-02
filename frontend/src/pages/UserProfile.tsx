import React, { useState, useEffect, ChangeEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-hot-toast';
import Input from '@mui/material/Input';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Modal from '@mui/material/Modal';
import { get_solo_user, edit_user } from '../api/users';
import { get_order_items } from '../api/orders';
import Loader from '../components/Loader';
import { useAuthStore } from '../hooks/auth';
import { Token } from '../Interfaces';
import ModalEditProfile from '../components/shared/Modal/ModalEditUser';
import ModalRequestSeller from '../components/shared/Modal/ModalARequestSeller';

export default function UserProfile2() {
    const [searchTerm, setSearchTerm] = useState('');
    const [tabValue, setTabValue] = useState('compras');
    const [stateName, setStateName] = useState('');
    const [stateLast, setStateLast] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>('');
    const [show, setShow] = useState(true);
    const [openModal, setOpenModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [orderItems, setOrderItems] = useState([]); // Estado para almacenar los productos de la orden seleccionada

    const token: string = useAuthStore.getState().access;
    const tokenDecoded: Token = jwt_decode(token);
    const id = tokenDecoded.user_id;

    const queryClient = useQueryClient();

    // Consultar usuario actual
    const { data: user, isLoading: isUserLoading, isError: isUserError } = useQuery({
        queryKey: ['users', id],
        queryFn: () => get_solo_user(id),
    });

    const editProfileMut = useMutation({
        mutationFn: edit_user,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('Profile updated!');
        },
        onError: () => {
            toast.error('Error, u not added nothing!');
        },
    });

    useEffect(() => {
        if (user) {
            setStateName(user.name);
            setImage(user.avatar);
        }
    }, [user]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];
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
        setFilePreview('');
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        editProfileMut.mutate({
            name: stateName,
            avatar: image,
            email: user.email,
            role: '',
            phone: '',
        });
    };

    const handleOrderClick = (orderId) => {
        // Llamar a la API para obtener los productos de la orden específica
        get_order_items(orderId)
            .then((items) => {
                setOrderItems(items); // Actualizar los productos de la orden
                setOpenModal(true); // Mostrar el modal
            })
            .catch((error) => {
                toast.error('Error fetching order items');
                console.error(error);
            });
    };

    const handleCloseModal = () => {
        setOpenModal(false); // Cerrar el modal
        setOrderItems([]); // Limpiar los productos de la orden
    };

    if (isUserLoading) return <Loader />;
    if (isUserError) return <p>Error loading data.</p>;

    const profileData = {
        fullName: user.name,
        phone: user.phone || 'Sin registrar',
        email: user.email,
        avatar: `${import.meta.env.VITE_BACKEND_URL}${user.avatar}`,
    };

    const tablesData = {
        projects: [
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
        ],
        tasks: [
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
            { id: 1, name: 'Website Redesign', status: 'In Progress', dueDate: '2023-12-31', total_price: '2000' },
            { id: 2, name: 'Mobile App Development', status: 'Planning', dueDate: '2024-03-15', total_price: '5000' },
            { id: 3, name: 'Database Migration', status: 'Completed', dueDate: '2023-11-30', total_price: '4000' },
        ],
    };

    const filterData = (data, term) => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(term.toLowerCase())
            )
        );
    };

    return (
        <Box sx={{ maxWidth: 'lg', mx: 'auto', p: 6, mt: '5em' }}>
            <Card sx={{ my: "2em" }} className='flex flex-row justify-between align-center'>
                <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                            src={profileData.avatar}
                            alt={profileData.fullName}
                            sx={{ width: 100, height: 100 }}
                        />
                        <Box sx={{ ml: 4 }}>
                            <Typography variant="h5">{profileData.fullName}</Typography>
                            <Typography variant="body2">{profileData.phone}</Typography>
                            <Typography variant="body2">{profileData.email}</Typography>
                        </Box>
                    </Box>
                </CardContent>
                <div className='text-end w-30'>
                    <ModalEditProfile
                        stateName={stateName}
                        setStateName={setStateName}
                        stateLast={stateLast}
                        setStateLast={setStateLast}
                        image={image}
                        handleFileChange={handleFileChange}
                        removeImage={removeImage}
                        setShow={setShow}
                        handleSubmit={handleSubmit}
                    />
                    <ModalRequestSeller userId={id} requestSellerStatus={() => { }} />
                </div>
            </Card>
            <div className='flex flex-row justify-between py-4'>
                <Input
                    type="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: '50%', padding: '.1em' }}
                />

                <Box>
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Compras" value="compras" />
                        <Tab label="Ordenes" value="orders" />
                    </Tabs>
                </Box>
            </div>

            {tabValue === 'compras' && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Fecha de entrega</TableCell>
                            <TableCell>Fecha de creación</TableCell>
                            <TableCell>Precio total</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterData(tablesData.projects, searchTerm).map((project) => (
                            <TableRow key={project.id}>
                                <TableCell>{project.id}</TableCell>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>{project.dueDate}</TableCell>
                                <TableCell>{project.date_creation}</TableCell>
                                <TableCell>{project.date_creation}</TableCell>
                                <TableCell>{project.total_price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {tabValue === 'orders' && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Usuario</TableCell>
                            <TableCell>Fecha de entrega</TableCell>
                            <TableCell>Fecha de creación</TableCell>
                            <TableCell>Precio total</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filterData(tablesData.tasks, searchTerm).map((task) => (
                            <TableRow key={task.id} onClick={() => handleOrderClick(task.id)}>
                                <TableCell>{task.id}</TableCell>
                                <TableCell>{task.name}</TableCell>
                                <TableCell>{task.dueDate}</TableCell>
                                <TableCell>{task.date_creation}</TableCell>
                                <TableCell>{task.date_creation}</TableCell>
                                <TableCell>{task.total_price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            )}

            {/* Modal para mostrar los productos de la orden */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{ width: 400, p: 4, bgcolor: 'white', margin: 'auto', marginTop: '5em' }}>
                    <Typography id="modal-title" variant="h6" component="h2">
                        Productos de la Orden
                    </Typography>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre del Producto</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderItems.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <button onClick={handleCloseModal}>Cerrar</button>
                </Box>
            </Modal>

        </Box>
    );
}
