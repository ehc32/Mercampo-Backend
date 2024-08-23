import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#FFFFFF',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

function ChildModal() {
    const [open, setOpen] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleConfirmOpen = () => {
        setConfirmOpen(true);
    };
    const handleConfirmClose = () => {
        setConfirmOpen(false);
    };

    return (
        <React.Fragment>
            <Button onClick={handleOpen}>Abrir modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title">Formulario</h2>
                    <form>
                        <TextField 
                            label="Nombre" 
                            variant="outlined" 
                            fullWidth 
                            sx={{mb: 2}} 
                        />
                        <TextField 
                            label="Apellido" 
                            variant="outlined" 
                            fullWidth 
                            sx={{mb: 2}} 
                        />
                        <TextField 
                            label="Correo" 
                            variant="outlined" 
                            fullWidth 
                            sx={{mb: 2}} 
                        />
                        <InputLabel id="rol-label">Rol</InputLabel>
                        <Select 
                            labelId="rol-label" 
                            fullWidth 
                            sx={{mb: 2}}
                        >
                            <MenuItem value="vendedor">Vendedor</MenuItem>
                            <MenuItem value="comprador">Comprador</MenuItem>
                            <MenuItem value="administrador">Administrador</MenuItem>
                        </Select>
                        <Button 
                            variant="contained" 
                            fullWidth 
                            onClick={handleConfirmOpen}
                            startIcon={<AiOutlineCheck />}
                        >
                            Aceptar
                        </Button>
                        <Button 
                            variant="outlined" 
                            fullWidth 
                            onClick={handleClose}
                            startIcon={<AiOutlineClose />}
                        >
                            Rechazar
                        </Button>
                    </form>
                </Box>
            </Modal>
            <Modal
                open={confirmOpen}
                onClose={handleConfirmClose}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="confirm-modal-title">Confirmación</h2>
                    <p id="confirm-modal-description">
                        ¿Quieres hacer este cambio?
                    </p>
                    <Button 
                        variant="contained" 
                        fullWidth 
                        onClick={handleConfirmClose}
                        startIcon={<AiOutlineCheck />}
                    >
                        Sí
                    </Button>
                    <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={handleConfirmClose}
                        startIcon={<AiOutlineClose />}
                    >
                        No
                    </Button>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default function NestedModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="parent-modal-title">Text in a modal</h2>
                    <p id="parent-modal-description">
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </p>
                    <ChildModal />
                </Box>
            </Modal>
        </div>
    );
}