import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import * as React from "react";
import { FaEdit } from "react-icons/fa";

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

export default function ModalEditProfile({
  stateName,
  setStateName,
  stateEmail,
  setStateEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  handleSubmit,
  initialImage, // Imagen inicial que ya tiene el usuario (por ejemplo, el avatar actual)
}) {
  const [open, setOpen] = React.useState(false);
  const [nameError, setNameError] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = React.useState(false);
  
  // Estado para manejar la imagen
  const [image, setImage] = React.useState<any>(initialImage || null);

  // Función para manejar la carga de archivos (solo PNG, JPEG o JPG)
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl); // Previsualiza la imagen
    } else {
      alert("Solo se permiten archivos PNG, JPEG o JPG."); // Mensaje de error si el archivo no es válido
    }
  };

  // Función para eliminar la imagen cargada
  const removeImage = () => {
    setImage(null); // Elimina la previsualización
  };

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
    } else if (!stateEmail) {
      setEmailError(true);
    } else if (!password) {
      setPasswordError(true);
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      handleSubmit();
      setOpen(false);
    }
  };

  return (
    <div>
      <h2
        className="fs-16px my-1 cursor-pointer text-green-700 mx-2 inline-flex items-center"
        onClick={handleOpen}
      >
        <FaEdit className="mr-1" />
        Editar
      </h2>

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
            {/* Nombre */}
            <div className="px-3 py-1">
              <InputLabel id="name-label" className="mb-2">
                Nombre
              </InputLabel>
              <TextField
                label="Nombre"
                fullWidth
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                error={nameError}
                helperText={nameError ? "Por favor ingresa un nombre" : ""}
              />
            </div>

            {/* Correo */}
            <div className="px-3 py-1">
              <InputLabel id="email-label" className="mb-2">
                Correo
              </InputLabel>
              <TextField
                label="Correo"
                fullWidth
                value={stateEmail}
                onChange={(e) => setStateEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Por favor ingresa un correo válido" : ""}
              />
            </div>

            {/* Contraseña */}
            <div className="px-3 py-1">
              <InputLabel id="password-label" className="mb-2">
                Contraseña
              </InputLabel>
              <TextField
                type="password"
                label="Contraseña"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Por favor ingresa tu contraseña" : ""}
              />
            </div>

            {/* Confirmar Contraseña */}
            <div className="px-3 py-1">
              <InputLabel id="confirm-password-label" className="mb-2">
                Confirmar Contraseña
              </InputLabel>
              <TextField
                type="password"
                label="Confirmar Contraseña"
                fullWidth
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                helperText={
                  confirmPasswordError ? "Las contraseñas no coinciden" : ""
                }
              />
            </div>

            {/* Imagen */}
            <div className="sm:col-span-2 p-2">
              <div className="flex items-center justify-center w-full">
                {image === null ? (
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-40"
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
                      <span className="font-semibold">Toca para actualizar</span>{" "}
                      o arrastra y suelta aquí
                    </p>
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg" // Restricción de tipos
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
                      Eliminar Imagen
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Botón de guardar */}
            <div className="p-2">
              <button
                type="submit"
                className="w-full text-white bg-[#39A900] hover:bg-[#335622] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
