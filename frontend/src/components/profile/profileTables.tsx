import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Typography, Box, Paper, Avatar } from '@mui/material';
import ModalEditProfile from '../shared/Modal/ModalEditUser';
import ModalRequestSeller from '../shared/Modal/ModalARequestSeller';
import ModalSellerConfig from '../shared/Modal/ModalConfigSeller'; // Asegúrate de que esta ruta esté correcta

function ProfileTables({ user, editProfileMutation, id }) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', mt: 4 }}>
            <AppBar position="static" color="default" elevation={0}>
                <Tabs value={tabValue} onChange={handleTabChange} indicatorColor="primary" textColor="primary" variant="fullWidth" sx={{ '.MuiTabs-indicator': { backgroundColor: '#39A900' } }}>
                    <Tab label="Información" sx={{ '&.Mui-selected': { color: '#39A900' } }} className="focus:outline-none" />
                    <Tab label="Notificación" sx={{ '&.Mui-selected': { color: '#39A900' } }} className="focus:outline-none" />
                    <Tab label="Configuración" sx={{ '&.Mui-selected': { color: '#39A900' } }} className="focus:outline-none" />
                </Tabs>
            </AppBar>

            {/* Información Tab */}
            <TabPanel value={tabValue} index={0}>
                <Paper elevation={1} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Información</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
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
                </Paper>
            </TabPanel>

            {/* Notificaciones Tab */}
            <TabPanel value={tabValue} index={1}>
                <Paper elevation={1} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Notificaciones</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Tus datos de PayPal aparecen aqui, la cuenta que registres aqui sera la cual reciba tu dinero,<br /> recuerda ingresar correctamente la información.
                    </Typography>
                    {/* Agregar configuraciones de notificación aquí */}
                </Paper>
            </TabPanel>

            {/* Configuración Tab */}
            <TabPanel value={tabValue} index={2}>
                <Paper elevation={1} sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Configuración</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Gestiona tu perfil y configuración de vendedor aquí.
                    </Typography>

                    {/* Modales de configuración */}
                    <div className="flex flex-col items-start space-y-2">
                        <ModalEditProfile user={user} editProfileMutation={editProfileMutation} />
                        {user?.role !== "seller" && user?.role !== "admin" && (
                            <ModalRequestSeller userId={id} requestSellerStatus={() => { }} />
                        )}
                        {(user?.role === "seller" || user?.role === "admin") && (
                            <ModalSellerConfig />
                        )}
                    </div>
                </Paper>
            </TabPanel>
        </Box>
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
