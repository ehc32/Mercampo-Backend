import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AiOutlineCheck, AiOutlineClose, AiOutlineShop } from 'react-icons/ai';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#FFFFFF',
    border: 'none',  // Eliminar el borde
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

interface ModalRequestSellerProps {
    userId: number | string;
    onRequestSubmit: (userId: number | string, reason: string) => void;
}

export default function ModalRequestSeller({ userId, onRequestSubmit }: ModalRequestSellerProps) {
    const [open, setOpen] = React.useState(false);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [reason, setReason] = React.useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setReason("");
    };

    const handleConfirmOpen = () => {
        if (!reason.trim()) {
            toast.error('Por favor, ingrese la razón de la solicitud.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            return;
        }
        setConfirmOpen(true);
    };

    const handleConfirmClose = () => {
        onRequestSubmit(userId, reason);
        setConfirmOpen(false);
        setOpen(false);
        setReason("");
        toast.info('En espera de aprobación.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div>
            <Button 
                onClick={handleOpen}
                variant="outlined"
                startIcon={<AiOutlineShop size={18} />}
                style={{ fontSize: '0.65rem', border: 'none' }}  // Eliminar el borde del botón
            >
                Solicitar Ser Vendedor
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="request-seller-modal-title"
                aria-describedby="request-seller-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="request-seller-modal-title" className='form-title'>Solicitar Ser Vendedor</h2>
                    <form>
                        <TextField
                            label="Razón de la solicitud"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required  // Hace que el campo sea obligatorio
                        />
                        <div className='flex flex-row gap-5'>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleConfirmOpen}
                                startIcon={<AiOutlineCheck />}
                            >
                                Enviar Solicitud
                            </Button>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={handleClose}
                                startIcon={<AiOutlineClose />}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Box>
            </Modal>
            <Modal
                open={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
            >
                <Box sx={{ ...style, width: 300, height: 200 }}>
                    <div className='flex flex-col justify-between h-full'>
                        <h2 id="confirm-modal-title" className='form-title'>Solicitud Enviada</h2>
                        <p id="confirm-modal-description" className='fs-18px'>
                            Su solicitud ha sido enviada. Por favor, espere la aprobación.
                        </p>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleConfirmClose}
                            startIcon={<AiOutlineCheck />}
                        >
                            Entendido
                        </Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
