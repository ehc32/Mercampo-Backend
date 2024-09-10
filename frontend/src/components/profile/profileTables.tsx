import React, { useEffect, useState } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Paper, Avatar, Button } from '@mui/material';
import ModalEditProfile from '../shared/Modal/ModalEditUser';
import ModalRequestSeller from '../shared/Modal/ModalARequestSeller';
import ModalSellerConfig from '../shared/Modal/ModalConfigSeller'; // Asegúrate de que esta ruta esté correcta
import { get_paypal_user } from '../../api/users';

function ProfileTables({ user, id }) {
    const [tabValue, setTabValue] = useState(0);
    const [paypal, SetPaypal] = useState<any>();
    const [showSecretKey, setShowSecretKey] = useState(false); // Estado para mostrar/ocultar secret key

    const paypalUser = async () => {
        try {
            const response = await get_paypal_user(id)
            const data = response.data
            console.log(data)
            SetPaypal(data)
        } catch (e) {
            console.log(e)
        }

    }
    useEffect(() => {
        paypalUser()
    }, [])

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);

    };
    const toggleSecretKeyVisibility = () => {
        setShowSecretKey((prevState) => !prevState); // Cambiar visibilidad
    };

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <AppBar position="static" color="default" elevation={0}>
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ '.MuiTabs-indicator': { backgroundColor: '#39A900' } }}>
                    <Tab label="Información personal" sx={{ '&.Mui-selected': { color: '#39A900' } }} className="focus:outline-none" />
                    <Tab label="Información de PayPal" sx={{ '&.Mui-selected': { color: '#39A900' } }} className="focus:outline-none" />
                    <Tab label="Configuración" sx={{ '&.Mui-selected': { color: '#39A900' } }} className="focus:outline-none" />
                </Tabs>
            </AppBar>

            {/* Información Tab */}
            <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>Información personal</Typography>
                <Typography variant="body2" color="text-black" gutterBottom>
                    En Mercampo cuidamos tu información.
                </Typography>

                <div className="flex justify-between items-center p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-6">
                        <Avatar
                            src={user?.avatar ? `${import.meta.env.VITE_BACKEND_URL}${user.avatar}` : '/placeholder.svg?height=100&width=100'}
                            alt={user?.name || 'User Avatar'}
                            sx={{ width: 100, height: 100 }}
                            className="border-4 border-gray-300 rounded-full"
                        />
                        <div>
                            <Typography variant="h5" className="text-xl font-bold text-gray-900">
                                {user?.name || 'Usuario'}
                            </Typography>
                            <Typography variant="body2" className="text-gray-700">
                                {user?.phone || "Teléfono no registrado"}
                            </Typography>
                            <Typography variant="body2" className="text-gray-700">
                                {user?.email || 'Correo no registrado'}
                            </Typography>
                            <Typography variant="body2" className={`text-gray-700 ${user?.role === "admin" && 'font-bold text-green-600'}`}>
                                {user?.role === "client" ? "Cliente" : user?.role === "seller" ? "Vendedor" : "Administrador"}
                            </Typography>
                        </div>
                    </div>
                </div>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>Información de PayPal</Typography>
                <div className="p-4 bg-white rounded-lg">
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between items-center">
                            <Typography variant="body2" className="text-gray-700 font-semibold">Client ID:</Typography>
                            <Typography variant="body2" className="text-gray-900">{paypal?.client_id || 'No disponible'}</Typography>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="body2" className="text-gray-700 font-semibold">Secret Key:</Typography>
                            <Typography variant="body2" className="text-gray-900">
                                {showSecretKey ? paypal?.secret_key || 'No disponible' : '***********'}
                            </Typography>
                            <Button onClick={toggleSecretKeyVisibility}>
                                {showSecretKey ? 'Ocultar' : 'Mostrar'}
                            </Button>
                        </div>
                        <div className="flex justify-between items-center">
                            <Typography variant="body2" className="text-gray-700 font-semibold">App Name:</Typography>
                            <Typography variant="body2" className="text-gray-900">{paypal?.app_name || 'No disponible'}</Typography>
                        </div>
                    </div>

                    <Typography variant="h6" gutterBottom>Pasos para configurar PayPal</Typography>

                    <ul>
                        <li>
                            <Typography variant="body2" color="text-black">
                                <strong>Paso 1:</strong> Crear una cuenta en PayPal. Ve a <a href="https://www.paypal.com" target="_blank" rel="noopener noreferrer">PayPal</a> y crea una cuenta de negocios.
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2" color="text-black">
                                <strong>Paso 2:</strong> Ingresa a <a href="https://developer.paypal.com/dashboard/applications/sandbox" target="_blank" rel="noopener noreferrer">PayPal for Developers</a>, crea una aplicación y obtén las credenciales (Client ID y Secret Key).
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body2" color="text-black">
                                <strong>Paso 3:</strong> Ingresar las credenciales en los campos correspondientes de nuestra plataforma para habilitar los pagos.
                            </Typography>
                        </li>
                    </ul>
                </div>
            </TabPanel>


            {/* Configuración Tab */}
            <TabPanel value={tabValue} index={2} >
                <Typography variant="h6" gutterBottom>Configuración</Typography>
                <Typography variant="body2" color="text-black" gutterBottom>
                    Gestiona tu perfil y configuración de vendedor aquí.
                </Typography>

                {/* Modales de configuración */}
                <div className="flex flex-row align-center items-start">
                    <ModalEditProfile id={id} />
                    {user?.role !== "seller" && user?.role !== "admin" && (
                        <ModalRequestSeller userId={id} requestSellerStatus={() => { }} />
                    )}
                    {(user?.role === "seller" || user?.role === "admin") && (
                        <ModalSellerConfig id={id} />
                    )}
                </div>
            </ TabPanel>
        </Box >
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default ProfileTables;
