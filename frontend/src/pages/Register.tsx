import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerRequest } from "../api/users";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { useAuthStore } from "../hooks/auth";
import {
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./style.css";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();

  // Estados de los campos del formulario
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");
  const [isSeller, setIsSeller] = useState(false);
  const [isCustomer, setIsCustomer] = useState(true); // Por defecto, es cliente
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  // Mutación para el registro de usuarios
  const registerMutation = useMutation({
    mutationFn: () =>
      registerRequest(email, name, phone, password, isSeller, isCustomer),
    onSuccess: () => {
      toast.success("Registro exitoso! Inicia sesión!");
      navigate("/login");
    },
    onError: () => {
      toast.error("Hubo un error, intenta nuevamente");
    },
  });

  // Validación y manejo del formulario al enviarlo
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación de datos
    if (!email || !name || !phone || !password || !re_password) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    if (password !== re_password) {
      toast.warning("Las contraseñas deben coincidir");
    } else if (!isSeller && !isCustomer) {
      toast.warning("Debes seleccionar al menos un rol (vendedor o cliente)");
    } else {
      registerMutation.mutate();
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.warning("El correo electrónico no es válido");
      return;
    }

    if (!/^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/.test(password)) {
      toast.warning("La contraseña debe tener al menos 6 caracteres y contener letras y números");
      return;
    }

    if (!name || !/\s/.test(name)) {
      toast.warning("El nombre debe contener al menos dos palabras");
      return;
    }

    registerMutation.mutate();
  };

  // Manejadores para los cambios de los roles (vendedor y cliente)
  const handleSellerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeller(event.target.checked);
    if (event.target.checked) {
      setIsCustomer(false); // Si se selecciona vendedor, se deselecciona cliente
      toast.info("Tendras que esperar que un admin apruebe la solicitud de vender.");
    }
  };

  const handleCustomerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCustomer(event.target.checked);
    if (event.target.checked) {
      setIsSeller(false); // Si se selecciona cliente, se deselecciona vendedor
    }
  };

  // Manejadores para la visibilidad de las contraseñas
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleRePasswordVisibility = () => {
    setShowRePassword(!showRePassword);
  };

  // Redirigir si ya está autenticado
  if (registerMutation.isLoading) return <p>Cargando...</p>;
  if (isAuth) return <Navigate to="/" />;

  return (
    <>
      <AsideFilter />
      <div className="flex flex-col justify-center items-center fondo-login min-h-screen">
        <div className="w-96 bg-slate-300 bg-opacity-20 backdrop-filter backdrop-blur-md my-2 rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:bg-opacity-20 dark:backdrop-blur-md dark:border-gray-700 flex flex-row">
          <div className="p-6 space-y-3 sm:p-8 w-full">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-100">
              Crear nueva cuenta
            </h1>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Campo de Correo Electrónico */}
              <div>
                <Typography
                  variant="subtitle2"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Correo electrónico
                </Typography>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="correo@email.com"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              {/* Campo de Nombre */}
              <div>
                <Typography
                  variant="subtitle2"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Nombre
                </Typography>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Nombre"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              {/* Campo de Teléfono */}
              <div>
                <Typography
                  variant="subtitle2"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Teléfono
                </Typography>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  type="tel"
                  inputMode="numeric"
                  placeholder="Teléfono"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  maxLength="10"
                />
              </div>

              {/* Campo de Contraseña */}
              <div>
                <Typography
                  variant="subtitle2"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Contraseña
                </Typography>
                <div className="relative">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                  <InputAdornment
                    position="end"
                    className="absolute inset-y-6 right-0 flex items-center pr-3"
                  >
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      className="focus:outline-none"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? (
                        <VisibilityOff style={{ color: "#39A900" }} />
                      ) : (
                        <Visibility style={{ color: "#39A900" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>

              {/* Campo de Repetir Contraseña */}
              <div>
                <Typography
                  variant="subtitle2"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Repite la contraseña
                </Typography>
                <div className="relative">
                  <input
                    value={re_password}
                    onChange={(e) => setRePassword(e.target.value)}
                    type={showRePassword ? "text" : "password"}
                    placeholder="Repite la contraseña"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                  />
                  <InputAdornment
                    position="end"
                    className="absolute inset-y-6 right-0 flex items-center pr-3"
                  >
                    <IconButton
                      onClick={handleToggleRePasswordVisibility}
                      edge="end"
                      className="focus:outline-none"
                      aria-label="toggle repeat password visibility"
                    >
                      {showRePassword ? (
                        <VisibilityOff style={{ color: "#39A900" }} />
                      ) : (
                        <Visibility style={{ color: "#39A900" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                </div>
              </div>

              {/* Checkbox para Ser Vendedor */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSeller}
                    onChange={handleSellerChange}
                    name="isSeller"
                    style={{ color: "#39A900"}}
                  />
                }
                label={
                  <Typography style={{ color: "black", fontWeight: "bold" }}>
                    ¡Quiero vender!
                  </Typography>
                }
              />

              {/* Botón de Registro */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{
                  backgroundColor: "#39A900",
                  color: "white",
                }}
                className="hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 dark:focus:ring-lime-800"
              >
                Registrarse
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
