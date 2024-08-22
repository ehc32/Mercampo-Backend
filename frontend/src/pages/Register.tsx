import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { registerRequest } from "../api/users";
import { useAuthStore } from "../hooks/auth";
import MySwiper from "../components/shared/Swiper/swiper";

const RegisterPage = () => {

  const navigate = useNavigate();
  const { isAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [re_password, setRePassword] = useState("");

  const registerMutation = useMutation({
    mutationFn: () => registerRequest(email, name, last_name, password),
    onSuccess: () => {
      toast.success("Registro exitoso! logueate!")
      navigate("/login")
    },
    onError: () => {
      toast.error("Hubo un error, intenta nuevamente")
    }
  })

  const handleMatch = () => {
    if (password !== re_password) {
      return false
    } else {
      return true
    }
  }

  const carrouselData = [
    {
      foto: "https://periodismopublico.com/wp-content/uploads/2019/06/Sena-.jpg",
    },
    {
      foto: "https://www.elolfato.com/sites/default/files/styles/news_full_image/public/assets/news/foto-home-03022023.png?itok=OVxS2L5E",
    },
  ];


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== re_password) {
      toast.error("Las contraseñas deben coincidir")
    } else {
      registerMutation.mutate()
    }
  }

  if (registerMutation.isLoading) return <p>Loading...</p>
  if (isAuth) return (<Navigate to="/" />)

  return (
    <div className="flex flex-row items-center justify-center px-6 py-12 mx-auto md:h-[800px] lg:py-12">
    <div className="w-full md:w-[80%] lg:w-[80%] bg-slate-300 rounded-lg shadow dark:border md:mt-0 xl:p-0 dark:bg-gray-800 dark:border-gray-700 flex flex-row">
      {/* Comentario: El contenedor se expande para ocupar el 80% del ancho de la página */}
  
      <div className="w-[65%]">
        {/* Comentario: MySwiper ocupa el 65% del contenedor */}
  
        <MySwiper width="100%" height="60vh" datos={carrouselData} />
        {/* Comentario: Ajustamos la altura a `60vh` para que se adapte al nuevo tamaño */}
      </div>
  
      <div className="p-6 space-y-4 md:space-y-6 sm:p-8 w-[35%]">
        {/* Comentario: El formulario ocupa el 35% del contenedor */}
  
        {/* <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="/logo.png" alt="logo" />
          <span>¡Registrate!</span>
        </Link> */}
        <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Crear nueva cuenta
        </h1>
        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Correo electrónico
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              name="email"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
              placeholder="Correo electrónico"
            />
          </div>
  
          <div>
            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Nombre
            </label>
            <input
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              type="name"
              name="name"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
              placeholder="Nombre"
            />
          </div>
  
          <div>
            <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Apellido
            </label>
            <input
              value={last_name}
              required
              onChange={(e) => setLastName(e.target.value)}
              type="last_name"
              name="last_name"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
              placeholder="Apellido"
            />
          </div>
  
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
            />
          </div>
  
          <div>
            <label htmlFor="re-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
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
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-lime-600 focus:border-lime-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-lime-500 dark:focus:border-lime-500"
            />
          </div>
  
          {handleMatch() ? false : <p className="text-sm font-medium text-red-500">Contraseñas no coinciden</p>}
  
          <button
            type="submit"
            className="w-full text-white bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
          >
            Registrarse
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Ya tienes una cuenta? <Link to={'/login'} className="font-medium text-lime-500 hover:underline dark:text-lime-600">Ingresar</Link>
          </p>
        </form>
      </div>
    </div>
  </div>
  )  

}
export default RegisterPage;
