import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginRequest } from "../api/users";
import { useAuthStore } from "../hooks/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuth } = useAuthStore();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => loginRequest(email, password),
    onSuccess: (response) => {
      setToken(response.data.access, response.data.refresh);
      toast.success("Login exitoso!");
      navigate("/");
    },
    onError: () => {
      toast.error("Hubo un error, intenta devuelta");
    },
  });

  const carrouselData = [
    {
      foto: "https://periodismopublico.com/wp-content/uploads/2019/06/Sena-.jpg",
    },
    {
      foto: "https://www.elolfato.com/sites/default/files/styles/news_full_image/public/assets/news/foto-home-03022023.png?itok=OVxS2L5E",
    },
  ];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loginMutation.mutate();
  };

  if (loginMutation.isLoading) return <p>Cargando...</p>;
  if (isAuth) return <Navigate to="/" />;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen fondo-login">
      <div className="w-96 bg-slate-300 bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:bg-opacity-20 dark:backdrop-blur-md dark:border-gray-700 flex flex-row">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-full">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-100">
            Inicia sesión
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Correo electrónico
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200"
              >
                Contraseña
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-200"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-[#39A900] hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#39A900] dark:hover:bg-lime-700 dark:focus:ring-lime-800"
            >
              Ingresar
            </button>
            <p className="text-sm font-light text-gray-50 dark:text-gray-300">
              No tienes cuenta?{" "}
              <Link
                to={"/register"}
                className="font-medium text-lime-500 hover:underline dark:text-lime-400"
              >
                Registrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
