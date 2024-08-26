import React, { useState } from 'react';
import './Aside.css';
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
} from '@mui/material';
import FilterIcon from '@mui/icons-material/Filter';

const AsideFilter = ({ bringDataFilter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [timeRange, setTimeRange] = useState('');
    const [maxPrice, setMaxPrice] = useState(0);
    const [minPrice, setMinPrice] = useState(0);
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const categorias = ['Frutas', 'Verduras', 'Grano', 'Otros'];

    const buscarSimilitudes = () => {
        if (searchTerm.length > 0) {
            console.log('Buscar: ' + searchTerm);
        }
    };

    const handleCategoryChange = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setSelectedCategories((prevCategories) => [...prevCategories, value]);
        } else {
            setSelectedCategories((prevCategories) =>
                prevCategories.filter((category) => category !== value)
            );
        }
    };

    const handleTimeRangeChange = (e) => {
        console.log(e.target.value);
        setTimeRange(e.target.value);
    };

    const handlePriceChange = (e) => {
        console.log(e.target.value);
        setMaxPrice(e.target.value);
    };

    const handleLocationChange = (e) => {
        console.log(e.target.value);
        setLocation(e.target.value);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <aside className="asideCard">
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
                        buscarSimilitudes();
                    }}
                >
                    <TextField
                        fullWidth
                        id="search"
                        label="Buscar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
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
                    Ingrese un rango de precios para filtrar los productos.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        id="min-price"
                        label="Minimo"
                        type="number"
                        sx={{ mr: 2 }}
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <Typography variant="body2">-</Typography>
                    <TextField
                        id="max-price"
                        label="Maximo"
                        type="number"
                        sx={{ ml: 2 }}
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
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
                        value={timeRange || 'todos'}
                        style={{ height: "4em", width: "100%" }}
                        onChange={handleTimeRangeChange}
                    >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="hoy">Publicados hoy</MenuItem>
                        <MenuItem value="semana">Esta semana</MenuItem>
                        <MenuItem value="mes">Este mes</MenuItem>
                        <MenuItem value="manual">Fechas manual</MenuItem>
                    </Select>
                    <Button sx={{ color: '#39A900', width: '100%' }} onClick={handleOpen}>
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
                    value={location || 'todos'}
                    style={{ height: "4em", width: "40%" }}
                    onChange={handleLocationChange}
                >
                    <MenuItem value="todos">Todos los lugares</MenuItem>
                    <MenuItem value="bogota">Bogotá</MenuItem>
                    <MenuItem value="medellin">Medellín</MenuItem>
                    <MenuItem value="cali">Cali</MenuItem>
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
                            <Button variant="contained" onClick={handleClose}>
                                Aceptar
                            </Button>
                            <Button variant="outlined" onClick={handleClose}>
                                Eliminar filtros
                            </Button>
                        </Box>
                    </Box>
                </Fade>
            </Modal>
            <Button sx={{ color: '#39A900', width: '100%' }} onClick={bringDataFilter}>
                Establecer filtros
            </Button>
        </aside>
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