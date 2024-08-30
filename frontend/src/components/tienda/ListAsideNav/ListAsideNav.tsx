import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import HomeIcon from '@mui/icons-material/Home';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ST_Icon from '../../assets/ST/ST_Icon';
import { Link } from 'react-router-dom';

export default function ListAsideNav() {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            <div className='w-full mx-4'>
                <ST_Icon />
            </div>
            <nav aria-label="main mailbox folders">
                <List>
                    <ListItem disablePadding>
                        <Link to="/" className='w-full'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <HomeIcon />
                                </ListItemIcon>
                                <ListItemText primary="Inicio" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link to="/store" className='w-full'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <StoreIcon />
                                </ListItemIcon>
                                <ListItemText primary="Tienda" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                    <ListItem disablePadding>
                        <Link to="/cart" className='w-full'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ShoppingCartIcon />
                                </ListItemIcon>
                                <ListItemText primary="Carrito de compras" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </nav>
            <Divider />
            <nav aria-label="secondary mailbox folders">
                <List>
                    <ListItem disablePadding>
                        <Link to="/profile" className='w-full'>
                            <ListItemButton>
                                <ListItemIcon>
                                    <AccountCircleIcon />
                                </ListItemIcon>
                                <ListItemText primary="Perfil del usuario" />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                </List>
            </nav>
            <Divider />
        </Box>
    );
}
