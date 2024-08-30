import { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const style = {
  position: "absolute",
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

interface ModalRequestSellerProps {
  userId: number | string;
  onRequestSubmit: (userId: number | string) => void;
}

export default function ModalRequestSeller({
  userId,
  onRequestSubmit,
}: ModalRequestSellerProps) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleConfirmOpen = () => {
    setConfirmOpen(true);
    setOpen(false);
  };

  const handleConfirmClose = () => {
    onRequestSubmit(userId);
    setConfirmOpen(false);
    toast.info("En espera de aprobación.", {
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
        style={{ fontSize: "0.75rem", border: "none", marginLeft: "-20px" }}
      >
        ¡Se un Vendedor!    
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="request-seller-modal-title"
        aria-describedby="request-seller-modal-description"
      >
        <Box sx={{ ...style, width: 400 }}>
          <h2 id="request-seller-modal-title" className="form-title">
            Solicitud de ser Vendedor
          </h2>
          <p id="request-seller-modal-description" style={{ marginBottom: '20px' }}>
            ¿Quieres ser vendedor?
          </p>
          <div className="flex flex-row gap-5">
            <Button
              variant="contained"
              fullWidth
              startIcon={<AiOutlineCheck />}
              onClick={handleConfirmOpen}
            >
              Sí, quiero ser vendedor
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
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
      >
        <Box sx={{ ...style, width: 300, height: 200 }}>
          <div className="flex flex-col justify-between h-full">
            <h2 id="confirm-modal-title" className="form-title">
              Solicitud Enviada
            </h2>
            <p id="confirm-modal-description" className="fs-18px">
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