import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import { AiFillEdit } from "react-icons/ai";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
  transition: "all 0.5s ease-in-out",
};

interface Props {
  setShow: (value: boolean) => void;
  stateName: string;
  setStateName: (value: string) => void;
  stateLast: string;
  setStateLast: (value: string) => void;
  image: any;
  handleFileChange: (event: any) => void;
  removeImage: () => void;
  handleSubmit: () => void;
}

export default function ModalEditProfile({
  stateName,
  setStateName,
  stateLast,
  setStateLast,
  image,
  handleFileChange,
  removeImage,
  handleSubmit,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [lastError, setLastError] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!stateName) {
      setNameError(true);
    } else if (!stateLast) {
      setLastError(true);
    } else {
      handleSubmit();
      setOpen(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleOpen}
        style={{ fontSize: '0.85rem' }}
      >
        Editar
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        onClick={(e) => {
          if (e.target.id === "modal-container") {
            handleClose();
          }
        }}
      >
        <Box sx={{ ...style, width: 400 }} id="modal-container">
          <h2 id="child-modal-title" className="form-title">
            Editar perfil
          </h2>
          <form onSubmit={handleFormSubmit}>
            <div className="p-3">
              <InputLabel id="name-label">Nombre</InputLabel>
              <TextField
                label="nombre-usario"
                fullWidth
                sx={{ mb: 2 }}
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                error={nameError}
                helperText={nameError ? "Por favor ingresa un nombre" : ""}
              />
            </div>
            <div className="p-3">
              <InputLabel id="last-label">Apellido</InputLabel>
              <TextField
                label="apellido-usuario"
                fullWidth
                sx={{ mb: 2 }}
                value={stateLast}
                onChange={(e) => setStateLast(e.target.value)}
                error={lastError}
                helperText={lastError ? "Por favor ingresa un apellido" : ""}
              />
            </div>
            <div className="sm:col-span-2 p-2">
              <div className="flex items-center justify-center w-full">
                {image === null ? (
                  <label
                    htmlFor="dropzone-file"
                    className={`flex flex-col items-center justify-center w-full h-64 
                    border-2 border-gray-600 border-dashed rounded-lg 
                                        cursor-pointer bg-gray-40`}
                  >
                    <svg
                      aria-hidden="true"
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1117 8h1a3 3 0 010 6h-1m-4 4v-4m0 0H9m4 0h2"
                      ></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">
                        Toca para actualizar
                      </span>{" "}
                      o arraste y sueltalo aca
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                    <input
                      id="dropzone-file"
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="flex flex-col items-center">
                    <img
                      src={image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-full mb-2"
                    />

                    <button
                      onClick={removeImage}
                      type="button"
                      className="w-full text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      Quitar Imagen
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-2">
              <button
                type="submit"
                className="w-full text-white bg-[#39A900] hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </Box>
      </Modal>
      {open && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50" />
      )}
    </div>
  );
}
