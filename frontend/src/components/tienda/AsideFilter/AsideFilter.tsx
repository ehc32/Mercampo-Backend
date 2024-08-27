import React, { useState } from 'react';
import './Aside.css';
import { Link, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Slider,
    MenuItem,
    Select,
    IconButton,
    Backdrop,
    Modal,
    Fade,
    Chip,
} from '@mui/material';
import FilterIcon from '@mui/icons-material/Filter';
import { useAbierto } from '../../../hooks/aside';
import value from '../../../types/globals';

const AsideFilter = ({
    bringDataFilter,
    setTime,
    setSearchItem,
    setCategories,
    setStartDate,
    setPrice,
    setEndDate,
    locate,
    price,
    categories,
    time,
    searchItem,
    startDate,
    endDate, setLocate
}) => {

    const precioOptions = [
        { label: 'Menos de 50 mil pesos', value: 1 },
        { label: 'Entre 50 mil y 150 mil', value: 2 },
        { label: 'Más de 150 mil', value: 3 },
    ];
    const { abierto, toggleAbierto } = useAbierto();

    const categorias = ['FRUTAS', 'VERDURAS', 'GRANOS', 'OTROS'];

    const locationPath = useLocation();

    const handleCategoryChange = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCategories((prevCategories) => [...prevCategories, value]);
        } else {
            setCategories((prevCategories) =>
                prevCategories.filter((category) => category !== value)
            );
        }
    };

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTimeRangeChange = (e) => {
        console.log(e.target.value);
        setTime(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleLocationChange = (e) => {
        setLocate(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    return (
        <aside className="asideCard">
            <div className='nav-responsive'>
                <Link
                    to={'/'}
                    onClick={toggleAbierto}
                    className='text-black  px-2 rounded-lg fs-18px item_navbar item-res'
                >
                    Inicio
                </Link>

                <Link
                    to={'/store'}
                    onClick={toggleAbierto}
                    className='text-black px-2 rounded-lg fs-18px item_navbar item-res'
                >
                    Tienda
                </Link>
                <Link
                    to={'/addprod'}
                    onClick={toggleAbierto}
                    className='text-black px-2 rounded-lg fs-18px item_navbar item-res'
                >
                    Carrito de compras
                </Link>
            </div>
            {
                locationPath.pathname === '/store' && (
                    <>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                <Typography variant="h6" gutterBottom>
                                    Busqueda de productos
                                </Typography>
                            </Box>
                            <Typography variant="body2" gutterBottom>
                                Ingrese un término de búsqueda para encontrar productos relacionados.
                            </Typography>
                            <form
                                action=""
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <TextField
                                    fullWidth
                                    id="search"
                                    label="Buscar ..."
                                    value={searchItem}
                                    onChange={(e) => setSearchItem(e.target.value)}
                                />
                            </form>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                <Typography variant="h6" gutterBottom>
                                    Categoría
                                </Typography>
                            </Box>
                            <Typography variant="body2" gutterBottom>
                                Seleccione una o varias categorías para filtrar los productos.
                            </Typography>
                            <FormGroup>
                                {categorias.map((categoria, index) => (
                                    <FormControlLabel
                                        key={index}
                                        control={
                                            <Checkbox
                                                id={categoria}
                                                name={categoria}
                                                value={categoria}
                                                onChange={handleCategoryChange}
                                            />
                                        }
                                        label={categoria}
                                    />
                                ))}
                            </FormGroup>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                <Typography variant="h6" gutterBottom>
                                    Precio máximo
                                </Typography>
                            </Box>
                            <Typography variant="body2" gutterBottom>
                                Seleccione el rango de precio más acorde a su bolsillo.
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                                {precioOptions.map((option) => (
                                    <Chip
                                        key={option.value}
                                        label={option.label}
                                        onClick={() => setPrice(option.value)}
                                        style={{ marginRight: 10, marginBottom: 10 }}
                                    />
                                ))}
                            </Box>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                <Typography variant="h6" gutterBottom>
                                    Rango de fechas
                                </Typography>
                            </Box>
                            <Typography variant="body2" gutterBottom>
                                Seleccione un rango de fechas para filtrar los productos.
                            </Typography>
                            <div className='flex flex-col justify-between align-middle'>
                                <Select
                                    id="date-range"
                                    value={time || 'todos'}
                                    style={{ height: "4em", width: "100%" }}
                                    onChange={handleTimeRangeChange}
                                >
                                    <MenuItem value="todos">Todos</MenuItem>
                                    <MenuItem value="hoy">Publicados hoy</MenuItem>
                                    <MenuItem value="ayer">Publicados ayer</MenuItem>
                                    <MenuItem value="semana">Esta semana</MenuItem>
                                    <MenuItem value="mes">Este mes</MenuItem>
                                </Select>
                                <Button
                                    variant="contained"
                                    color="success"
                                    fullWidth
                                    onClick={handleOpen}
                                    className='my-2'
                                >
                                    Establecer fechas manualmente
                                </Button>
                            </div>
                        </Box>
                        <Box sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>

                                <Typography variant="h6" gutterBottom>
                                    Ubicación
                                </Typography>
                            </Box>
                            <Typography variant="body2" gutterBottom>
                                Seleccione una ubicación para filtrar los productos.
                            </Typography>
                            <Select
                                id="location"
                                value={locate || 'todos'}
                                style={{ height: "4em", width: "100%" }}
                                onChange={handleLocationChange}
                            >
                                <MenuItem value="todos">Todos los lugares</MenuItem>
                                <MenuItem value="bogota">Bogotá</MenuItem>
                                <MenuItem value="medellin">Medellín</MenuItem>
                                <MenuItem value="cali">Cali</MenuItem>
                                <MenuItem value="Neiva">Neiva</MenuItem>
                            </Select>
                        </Box>

                        <Modal
                            aria-labelledby="spring-modal-title"
                            aria-describedby="spring-modal-description"
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                                backdrop: {
                                    TransitionComponent: Fade,
                                },
                            }}
                        >
                            <Fade in={open}>
                                <Box sx={style}>
                                    <Typography id="spring-modal-title" variant="h6" component="h2">
                                        Establecer fechas
                                    </Typography>
                                    <Typography id="spring-modal-description" sx={{ mt: 2 }}>
                                        Seleccione un rango de fechas para filtrar los productos.
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">Fecha de inicio:</Typography>
                                        <TextField
                                            fullWidth
                                            id="start-date"
                                            type="date"
                                            sx={{ mt: 1 }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={startDate}
                                            onChange={handleStartDateChange}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2">Fecha de fin:</Typography>
                                        <TextField
                                            fullWidth
                                            id="end-date"
                                            type="date"
                                            sx={{ mt: 1 }}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={endDate}
                                            onChange={handleEndDateChange}
                                        />
                                    </Box>
                                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                        <Button variant="contained">
                                            Aceptar
                                        </Button>
                                        <Button variant="outlined">
                                            Eliminar filtros
                                        </Button>
                                    </Box>
                                </Box>
                            </Fade>
                        </Modal>
                        <Button
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={bringDataFilter}
                        >
                            Establecer filtros
                        </Button>
                    </>
                )
            }
        </aside >
    );
};

const style = {
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

export default AsideFilter;