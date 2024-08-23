import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginRequest } from "../api/users";
import { useAuthStore } from "../hooks/auth";
import MySwiper from "../components/shared/Swiper/swiper";

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

  if (loginMutation.isLoading) return <p>Loading...</p>;
  if (isAuth) return <Navigate to="/" />;

  return (
    <div className="flex flex-row items-center justify-center px-6 py-12 mx-auto md:h-[600px] lg:py-12">
      <div className="w-full md:w-[80%] lg:w-[80%] bg-slate-300 rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-row">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-[35%]">
          <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
            Inicia sesión
          </h1>
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Correo electrónico
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                name="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
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
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
              />
            </div>

            <button
              type="submit"
              className="w-full text-white bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
            >
              Ingresar
            </button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              No tienes cuenta?{" "}
              <Link
                to={"/register"}
                className="font-medium text-lime-500 hover:underline dark:text-lime-600"
              >
                Registrate
              </Link>
            </p>
          </form>
        </div>

        <div className="w-[65%]">
          <MySwiper width="100%" height="60vh" datos={carrouselData} />
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
