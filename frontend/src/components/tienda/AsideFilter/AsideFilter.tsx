import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    Chip,
    Drawer,
    Fade,
    FormControlLabel,
    FormGroup,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDrawer } from '../../../context/DrawerProvider'; // Importa el hook del contexto
import ListAsideNav from '../ListAsideNav/ListAsideNav';

const AsideFilter = ({
    bringDataFilter,
    deleteDataFilter,
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
    endDate,
    setLocate
}) => {
    const { abierto, toggleAbierto } = useDrawer(); // Usa el hook del contexto
    const location = useLocation()
    const [timer, setTimer] = useState(null);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const buscarTextfield = (e) => {
        setSearchItem(e);
        bringDataFilter();
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchItem(value);

        if (timer) {
            clearTimeout(timer);
        }

        const newTimer = setTimeout(() => {
            buscarTextfield(value);
        }, 1000);

        setTimer(newTimer);
    };

    const precioOptions = [
        { label: 'Menos de 50 mil pesos', value: 1 },
        { label: 'Entre 50 mil y 150 mil', value: 2 },
        { label: 'Más de 150 mil', value: 3 },
    ];

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
        <Drawer
            open={abierto} // Usa el estado del contexto para determinar si el Drawer está abierto
            onClose={toggleAbierto} // Usa la función del contexto para alternar el Drawer
            sx={{
                width: 300,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 300,
                    boxSizing: 'border-box',
                },
            }}
        >
            {
                window.innerWidth < 900 && (
                    <ListAsideNav />
                )
            }
            {
                location.pathname == "/store" && (



                    <Box sx={{ p: 2, maxWidth: "350px" }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h6" gutterBottom>
                                Búsqueda de productos
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
                                onChange={handleChange}
                            />
                        </form>
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
                                        label={capitalizeFirstLetter(categoria)}
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
                                        <Button variant="contained" onClick={handleClose}>
                                            Aceptar
                                        </Button>
                                    </Box>
                                </Box>
                            </Fade>
                        </Modal>
                        <Button
                            className='mt-2'
                            variant="contained"
                            color="success"
                            fullWidth
                            onClick={bringDataFilter}
                        >
                            Establecer filtros
                        </Button>
                        <Button
                            className='mt-2'
                            variant="contained"
                            color="error"
                            fullWidth
                            onClick={deleteDataFilter}
                        >
                            Borrar filtros
                        </Button>
                    </Box>
                )
            }
        </Drawer>
    );
};

export default AsideFilter;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
