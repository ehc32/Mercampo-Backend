import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FaEdit } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { edit_user } from "../../../api/users";
import toast from "react-hot-toast";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  transition: "all 0.3s ease-in-out",
};

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#39A900',
    },
    '&:hover fieldset': {
      borderColor: '#39A900',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#39A900',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#39A900',
  },
};

export default function ModalEditProfile({ id }) {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [stateName, setStateName] = useState("");
  const [stateEmail, setStateEmail] = useState("");
  const [statePhone, setStatePhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
<<<<<<< HEAD
  const [image, setImage] = useState<any>(null);
  const [nameError, setNameError] = useState("");
=======
  const [image, setImage] = useState<File | null>(null);
>>>>>>> fe7b0afa0ebc09d46a5018237f7420731eb12915

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setImage(file);
    } else {
      toast.error("Solo se permiten archivos PNG, JPEG o JPG.");
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  useEffect(() => {
    console.log(id)
  }, [])


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setSelectedOption(null);
    setOpen(false);
    setNameError("");
  };

<<<<<<< HEAD
  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return nameRegex.test(name);
  };
  
  const validateEmail = (email: string) => /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|soysena\.edu\.co|misena\.edu\.co)$/.test(email);
  const validatePhone = (phone: string) => /^\d+$/.test(phone);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setStateName(newName);
    if (newName && !validateName(newName)) {
      setNameError("El nombre solo puede contener letras y espacios");
    } else {
      setNameError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let data = {};
    let isValid = true;

    switch (selectedOption) {
      case "name":
        if (!validateName(stateName)) {
          setNameError("El nombre solo puede contener letras y espacios");
          isValid = false;
        } else {
          data = { name: stateName };
        }
        break;
      case "phone":
        if (!validatePhone(statePhone)) {
          toast.error("El teléfono solo puede contener números positivos");
          isValid = false;
        } else {
          data = { phone: statePhone };
        }
        break;
      case "email":
        if (!validateEmail(stateEmail)) {
          toast.error("Correo electrónico no válido. Use gmail.com, outlook.com, hotmail.com, soysena.edu.co o misena.edu.co");
          isValid = false;
        } else {
          data = { email: stateEmail };
        }
=======
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Evitar el comportamiento por defecto del formulario
    let formData = new FormData();

    switch (selectedOption) {
      case "name":
        formData.append("name", stateName);
        break;
      case "phone":
        formData.append("phone", statePhone);
        break;
      case "email":
        formData.append("email", stateEmail);
>>>>>>> fe7b0afa0ebc09d46a5018237f7420731eb12915
        break;
      case "password":
        if (password === confirmPassword) {
          formData.append("password", password);
        } else {
          toast.error("Las contraseñas no coinciden");
          isValid = false;
        }
        break;
      case "image":
        if (image) {
          formData.append("avatar", image);
        }
        break;
      default:
        toast.error("Selecciona una opción válida");
        isValid = false;
    }

<<<<<<< HEAD
    if (isValid) {
      try {
        await edit_user(data, id);
        toast.success("Datos actualizados con éxito");
        handleClose();
      } catch (error) {
        toast.error("Ha ocurrido un error al actualizar sus datos");
      }
=======
    try {
      await edit_user(formData, id);
      toast.success("Datos actualizados con éxito");
      handleClose();
    } catch (error) {
      toast.error("Ha ocurrido un error al actualizar sus datos");
>>>>>>> fe7b0afa0ebc09d46a5018237f7420731eb12915
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "name":
        return (
          <div className="mb-2">
            <InputLabel id="name-label">Nombre</InputLabel>
            <TextField
              label="Nombre"
              fullWidth
              size="small"
              value={stateName}
              onChange={handleNameChange}
              sx={inputStyle}
              error={!!nameError}
              helperText={nameError}
            />
          </div>
        );
      case "phone":
        return (
          <div className="mb-2">
            <InputLabel id="phone-label">Teléfono</InputLabel>
            <TextField
              label="Teléfono"
              fullWidth
              size="small"
              value={statePhone}
              onChange={(e) => setStatePhone(e.target.value)}
              sx={inputStyle}
              type="number"
              inputProps={{ min: 0 }}
            />
          </div>
        );
      case "email":
        return (
          <div className="mb-2">
            <InputLabel id="email-label">Correo</InputLabel>
            <TextField
              label="Correo"
              fullWidth
              size="small"
              value={stateEmail}
              onChange={(e) => setStateEmail(e.target.value)}
              sx={inputStyle}
            />
          </div>
        );
      case "password":
        return (
          <>
            <div className="mb-2">
              <InputLabel id="password-label">Contraseña</InputLabel>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={inputStyle}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
              />
            </div>
            <div className="mb-2">
              <InputLabel id="confirm-password-label">Confirmar Contraseña</InputLabel>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Confirmar Contraseña"
                fullWidth
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={inputStyle}
              />
            </div>
          </>
        );
      case "image":
        return (
          <div className="mb-2 flex flex-col items-center">
            {image === null ? (
              <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100">
                <p className="text-sm text-gray-500">Toca para actualizar o arrastra y suelta aquí</p>
                <input id="dropzone-file" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="flex flex-col items-center">
                <img src={URL.createObjectURL(image)} alt="Preview" className="h-24 w-24 object-cover rounded-full mb-2" />
                <button onClick={removeImage} type="button" className="mt-2 text-white bg-red-600 hover:bg-red-800 py-1 px-3 rounded">Eliminar Imagen</button>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2 className="bg-green-700 text-white border border-green-700 hover:bg-green-800 mx-2 my-1 p-3 rounded row align-center w-56 justify-center" onClick={handleOpen}>
        <FaEdit className="mr-2 fs-16px" />
        Editar
      </h2>

      <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={style}>
          {!selectedOption ? (
            <>
              <h2 id="modal-title" className="text-lg font-semibold mb-2">Selecciona qué quieres editar</h2>
              <div className="flex flex-col space-y-2">
                <button className="text-white bg-[#39A900] hover:bg-[#335622] rounded-lg text-sm px-4 py-2" onClick={() => setSelectedOption("name")}>Editar Nombre</button>
                <button className="text-white bg-[#39A900] hover:bg-[#335622] rounded-lg text-sm px-4 py-2" onClick={() => setSelectedOption("phone")}>Editar Teléfono</button>
                <button className="text-white bg-[#39A900] hover:bg-[#335622] rounded-lg text-sm px-4 py-2" onClick={() => setSelectedOption("email")}>Editar Correo</button>
                <button className="text-white bg-[#39A900] hover:bg-[#335622] rounded-lg text-sm px-4 py-2" onClick={() => setSelectedOption("password")}>Editar Contraseña</button>
                <button className="text-white bg-[#39A900] hover:bg-[#335622] rounded-lg text-sm px-4 py-2" onClick={() => setSelectedOption("image")}>Editar Foto</button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 id="modal-title" className="text-lg font-semibold mb-2">Editar {selectedOption}</h2>
              {renderContent()}
              <div className="flex justify-center mt-4">
                <button type="submit" className="text-white bg-[#39A900] hover:bg-[#335622] rounded-lg text-sm px-4 py-2">Guardar cambios</button>
              </div>
            </form>
          )}
        </Box>
      </Modal>
    </div>
  );
}