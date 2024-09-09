import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { registerRequest } from "../api/users";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
import { Button, Typography } from "@mui/material";
import "./style.css";
import { useAuthStore } from "../hooks/auth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: () => registerRequest(email, name, phone, password),
    onSuccess: () => {
      toast.success("Registro exitoso! Inicia sesión!");
      navigate("/login");
    },
    onError: () => {
      toast.error("Hubo un error, intenta nuevamente");
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validación de datos
    if (!email || !name || !phone || !password || !re_password) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    if (password !== re_password) {
      toast.warning("Las contraseñas deben coincidir");
      return;
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

  if (isAuth) return <Navigate to="/" />;

  return (
    <>
      <AsideFilter />
      <div className="flex flex-col justify-center items-center fondo-login min-h-screen ">
        <div className="w-96 bg-slate-300 bg-opacity-20 backdrop-filter backdrop-blur-md my-5 rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:bg-opacity-20 dark:backdrop-blur-md dark:border-gray-700 flex flex-row">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-100">
              Crear nueva cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <Typography
                  variant="subtitle1"
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

              <div>
                <Typography
                  variant="subtitle1"
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

              <div>
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Teléfono
                </Typography>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="Teléfono"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Contraseña
                </Typography>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Contraseña"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

              <div>
                <Typography
                  variant="subtitle1"
                  component="div"
                  className="font-bold text-black dark:text-gray-200 mb-1"
                >
                  Repite la contraseña
                </Typography>
                <input
                  value={re_password}
                  onChange={(e) => setRePassword(e.target.value)}
                  type="password"
                  placeholder="Repite la contraseña"
                  className="w-full p-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                />
              </div>

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
              <p className="text-sm font-light text-black dark:text-gray-300">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  to={"/login"}
                  className="font-medium text-white hover:underline dark:text-lime-400"
                >
                  Inicia sesión
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
