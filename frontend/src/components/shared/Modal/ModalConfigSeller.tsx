import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendRequestSellerPayPalConfig } from "../../../api/users";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#FFFFFF",
    border: "none",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

interface ModalSellerConfigProps {
    userId: number | string;
}

export default function ModalSellerConfig({
    userId,
}: ModalSellerConfigProps) {
    const [openModal, setOpenModal] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [secretKey, setSecretKey] = useState("");
    const [appName, setAppName] = useState("");
    const [clientId, setClientId] = useState("");
    const [showSecretKey, setShowSecretKey] = useState(false);

    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);

    const handleToggleSecretKeyVisibility = () => {
        setShowSecretKey(!showSecretKey);
    };

    const handleConfirmOpen = async () => {
        await sendRequest();
        setOpenModal(false);
    };

    const sendRequest = async () => {
        try {
            const formData = new FormData();
            formData.append("app_name", appName);
            formData.append("client_id", clientId);
            formData.append("secret_key", secretKey);
            await sendRequestSellerPayPalConfig(userId, formData);
            toast.success("Configuracion completada");
        } catch (e) {
            toast.warning(
                "No se ha podido configurar la información de pago"
            );
        }
    };
    

    return (
        <div>
            <h2
                className="fs-16px my-1 cursor-pointer text-green-700 mx-2"
                onClick={handleOpen}
            >
                Configuración de PayPal
            </h2>
            <Modal
                open={openModal}
                onClose={handleClose}
                className="border-none focus:outline-none"
                aria-labelledby="request-seller-modal-title"
                aria-describedby="request-seller-modal-description"
            >
                <Box sx={style}>
                    <p
                        style={{
                            marginBottom: "20px",
                            fontSize: "22px",
                            textAlign: "center",
                        }}
                    >
                        Configuración de PayPal
                    </p>

                    <TextField
                        fullWidth
                        label="App Name"
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Client ID"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Secret Key"
                        type={showSecretKey ? "text" : "password"}
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        margin="normal"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={handleToggleSecretKeyVisibility}
                                        edge="end"
                                    >
                                        {showSecretKey ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <div className="flex flex-row gap-5" style={{ marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={<AiOutlineCheck />}
                            onClick={handleConfirmOpen}
                        >
                            Confirmar
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
                </Box>
            </Modal>
        </div>
    );
}
