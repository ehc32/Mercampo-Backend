import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/users";
import { useAuthStore } from "../hooks/auth";
import "./style.css";
import Footer from "../components/Footer";

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
    if (password !== re_password) {
      toast.warning("Las contraseñas deben coincidir");
    } else {
      registerMutation.mutate();
    }
  };

  if (registerMutation.isLoading) return <p>Cargando...</p>;
  if (isAuth) return <Navigate to="/" />;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex justify-center px-4 pt-24 pb-6 mx-auto fondo-login">
        <div className="w-full max-w-md bg-slate-300 bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow dark:border dark:bg-gray-800 dark:bg-opacity-20 dark:backdrop-blur-md dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-4 sm:p-8 w-full">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black md:text-2xl dark:text-gray-100">
              Crear nueva cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-bold text-black dark:text-gray-200"
                >
                  Correo electrónico
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  name="email"
                  id="email"
                  className="focus:outline-none border border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  placeholder="Correo electrónico"
                />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-bold text-black dark:text-gray-200"
                  >
                    Nombre
                  </label>
                  <input
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    name="name"
                    id="name"
                    className="focus:outline-none border border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                    placeholder="Nombre"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="phone"
                    className="block mb-2 text-sm font-bold text-black dark:text-gray-200"
                  >
                    Teléfono
                  </label>
                  <input
                    value={phone}
                    required
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    name="phone"
                    id="phone"
                    className="focus:outline-none border border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                    placeholder="Teléfono"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-black dark:text-gray-200"
                >
                  Contraseña
                </label>
                <input
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="border focus:outline-none border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>

              <div>
                <label
                  htmlFor="re-password"
                  className="block mb-2 text-sm font-bold text-black dark:text-gray-200"
                >
                  Repite la contraseña
                </label>
                <input
                  value={re_password}
                  required
                  onChange={(e) => setRePassword(e.target.value)}
                  type="password"
                  name="re-password"
                  id="re-password"
                  placeholder="••••••••"
                  className="border focus:outline-none border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#39A900] hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#39A900] dark:hover:bg-lime-700 dark:focus:ring-lime-800"
              >
                Registrarse
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer /> {/* Oculta el footer para que no haya espacio vacío debajo del formulario */}
    </div>
  );
};

export default RegisterPage;
