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
    <>
      <div className="flex flex-row items-center justify-center px-6 py-12 mx-auto md:h-[800px] lg:py-12 fondo-login mt-6">
        {/* Comentario: Fondo del formulario con desenfoque */}

        <div className="w-full md:w-[80%] lg:w-96 bg-slate-300 bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:bg-opacity-20 dark:backdrop-blur-md dark:border-gray-700 flex flex-row">
          {/* Comentario: El contenedor del formulario tiene el mismo efecto de desenfoque que en el login */}

          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
            {/* Comentario: Formulario de registro */}

            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-black md:text-2xl dark:text-gray-100">
              Crear nueva cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-bold text-black dark:text-gray-200">
                  Correo electrónico
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  name="email"
                  id="email"
                  className="focus:outline-none border border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  placeholder="Correo electrónico"
                />
              </div>

              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-bold text-black dark:text-gray-200"> Nombre </label>
                <input
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  type="name"
                  name="name"
                  id="name"
                  className="focus:outline-none border border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm  text-black font-bold dark:text-gray-200">
                  Teléfono de contacto
                </label>
                <input
                  value={phone}
                  required
                  onChange={(e) => setPhone(e.target.value)}
                  type="phone"
                  name="phone"
                  id="phone"
                  className="focus:outline-none border border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                  placeholder="Teléfono"
                />
              </div>

              <div>
                <label htmlFor="password" className="block  text-sm  text-black font-bold dark:text-gray-200">
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
                  className="border focus:outline-none border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>

              <div>
                <label htmlFor="re-password" className="block mb-2 text-sm  text-black font-bold dark:text-gray-200">
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
                  className="border focus:outline-none border-gray-300 text-black font-bold sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-[#39A900] hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300  rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#39A900] dark:hover:bg-lime-700 dark:focus:ring-lime-800"
              >
                Registrarse
              </button>

            </form>
          </div>
        </div>
      </div>
      <Footer />

    </>
  );
};
export default RegisterPage;
