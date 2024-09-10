import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FaEdit } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import toast from 'react-hot-toast';
import { delete_user, edit_user, get_users } from "../api/users";
import SearchIcon from '@mui/icons-material/Search';
import { IconButton as MUIIconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

// Styles for Modal
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360, // Reduced width for a more compact modal
  bgcolor: "#FFFFFF",
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  transition: "all 0.3s ease-in-out",
};

const Users = ({ results }: any) => {
  const [idLocal, setIdLocal] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stateName, setStateName] = useState("");
  const [stateEmail, setStateEmail] = useState("");
  const [statePhone, setStatePhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [image, setImage] = useState<any>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setImage(file); // Save the file for submission
    } else {
      alert("Only PNG, JPEG, or JPG files are allowed.");
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleModalOpen = (user: any) => {
    setIdLocal(user.id);
    setStateName(user.name);
    setStateEmail(user.email);
    setStatePhone(user.phone);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setImage(null);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setNameError(!stateName);
    setEmailError(!stateEmail);
    setPhoneError(!statePhone);
    setPasswordError(!password);
    setConfirmPasswordError(password !== confirmPassword);

    if (stateName && stateEmail && statePhone && password && password === confirmPassword) {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const data = {
      name: stateName,
      email: stateEmail,
      phone: statePhone,
      password: password,
      image: image,
    };
    try {
      await edit_user(data, idLocal);
      toast.success("Data updated successfully");
      handleModalClose();
    } catch (error) {
      toast.error("An error occurred while updating the data");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await delete_user(id);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (e) {
      toast.error("Unable to delete this user");
    }
  };

  const fetchUsers = async () => {
    const response = await get_users();
    setData(response);
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const formatDate = (fechaISO: any) => {
    const fecha = new Date(fechaISO);
    const meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const year = fecha.getFullYear();
    return `${dia} de ${mes} del ${year}`;
  };

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold my-3 text-center text-black">
        Lista de usuarios
      </h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-2 py-1 text-center">Nombre</th>
            <th scope="col" className="px-2 py-1 text-center">Correo</th>
            <th scope="col" className="px-2 py-1 text-center">Teléfono</th>
            <th scope="col" className="px-2 py-1 text-center">Rol</th>
            <th scope="col" className="px-2 py-1 text-center">P. Publicar</th>
            <th scope="col" className="px-2 py-1 text-center">Fecha de creación</th>
            <th scope="col" className="px-2 py-1 text-center">Opciones</th>
          </tr>
        </thead>
        {data && data.length > 0 ? (
          <tbody>
            {data.map((o: any) => (
              <tr key={o.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:dark:hover:bg-gray-600">
                <td className="px-2 py-1 ">{o.name}</td>
                <td className="px-2 py-1 ">{o.email}</td>
                <td className="px-2 py-1 ">{o.phone}</td>
                <td className="px-2 py-1 text-center">{o.role === "seller" ? "Vendedor" : o.role == "admin" ? "Administrador" : "Cliente"}</td>
                <td className="px-2 py-1 text-center">{o.can_publish ? "Puede" : "No puede"}</td>
                <td className="px-2 py-1 text-center">{formatDate(o.date_joined)}</td>
                <td className="px-2 py-1 text-center">
                  <MUIIconButton className="focus:outline-none" onClick={() => handleModalOpen(o)}>
                    <DriveFileRenameOutlineIcon className="text-blue-600 mx-1" />
                  </MUIIconButton>
                  <MUIIconButton className="focus:outline-none" onClick={() => handleDelete(o.id)}>
                    <DeleteIcon className="text-red-600 mx-1" />
                  </MUIIconButton>
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={7} className="px-6 py-1 text-center">No se encontraron usuarios</td>
            </tr>
          </tbody>
        )}
      </table>
      <div>
        <Pagination count={Math.ceil(data.length / 10)} page={page} onChange={(event, value) => setPage(value)} className="flex flex-row w-full justify-center" />
      </div>

      {/* ModalEditProfile */}
      <Modal open={modalOpen} onClose={handleModalClose} aria-labelledby="modal-title" aria-describedby="modal-description">
        <Box sx={style}>
          <h2 id="modal-title" className="text-lg font-semibold mb-2">Editar perfil</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-2">
              <InputLabel id="name-label">Nombre</InputLabel>
              <TextField
                label="Nombre"
                fullWidth
                size="small"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                error={nameError}
                helperText={nameError ? "Por favor ingresa un nombre" : ""}
              />
            </div>
            <div className="mb-2">
              <InputLabel id="phone-label">Teléfono</InputLabel>
              <TextField
                label="Teléfono"
                fullWidth
                size="small"
                value={statePhone}
                onChange={(e) => setStatePhone(e.target.value)}
                error={phoneError}
                helperText={phoneError ? "Por favor ingresa un teléfono" : ""}
              />
            </div>
            <div className="mb-2">
              <InputLabel id="email-label">Correo</InputLabel>
              <TextField
                label="Correo"
                fullWidth
                size="small"
                value={stateEmail}
                onChange={(e) => setStateEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Por favor ingresa un correo electrónico" : ""}
              />
            </div>
            <div className="mb-2">
              <InputLabel id="password-label">Contraseña</InputLabel>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Contraseña"
                fullWidth
                size="small"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                helperText={passwordError ? "Por favor ingresa una contraseña" : ""}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
            </div>
            <div className="mb-2">
              <InputLabel id="confirm-password-label">Confirmar contraseña</InputLabel>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Confirmar contraseña"
                fullWidth
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                helperText={confirmPasswordError ? "Las contraseñas no coinciden" : ""}
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
            </div>
            <div className="mb-2">
              <input
                accept="image/*"
                id="image-input"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <label htmlFor="image-input">
                <IconButton color="primary" component="span">
                  Subir imagen
                </IconButton>
              </label>
              {image && <p>{image.name}</p>}
              {image && (
                <IconButton color="secondary" onClick={removeImage}>
                  Eliminar imagen
                </IconButton>
              )}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
              <button type="button" className="px-4 py-2 ml-2 bg-gray-400 text-white rounded" onClick={handleModalClose}>Cancelar</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Users;
