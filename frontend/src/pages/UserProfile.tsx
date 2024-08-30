import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jwt_decode from "jwt-decode";
import React, { ChangeEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { my_orders } from "../api/orders";
import { edit_user, get_solo_user } from "../api/users";
import Loader from "../components/Loader";
import { useAuthStore } from "../hooks/auth";
import { Token } from "../Interfaces";
import ShopHistory from "./ShopHistory";
import ModalEditProfile from "../components/shared/Modal/ModalEditUser";
import VendedorProduct from "./VendedorProduct";
import ModalRequestSeller from "../components/shared/Modal/ModalARequestSeller";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";

const UserProfile = () => {
  const [show, setShow] = useState<string>("purchase-history");
  const [stateName, setStateName] = useState<string>("");
  const [stateLast, setStateLast] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [search] = useState<string>("");

  const token: string = useAuthStore.getState().access;
  const tokenDecoded: Token = jwt_decode(token);
  const id = tokenDecoded.user_id;

  const { data: user } = useQuery({
    queryKey: ["users", id],
    queryFn: () => get_solo_user(id),
  });

  useEffect(() => {
    if (user) {
      setStateName(user.name);
      setImage(user.avatar);
    }
  }, [user]);

  const queryClient = useQueryClient();

  const editProfileMut = useMutation({
    mutationFn: edit_user,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Profile updated!");
      setShow(true);
    },
    onError: () => {
      toast.error("Error, u not added nothing!");
      setShow(true);
    },
  });

  const { isError, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: my_orders,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    editProfileMut.mutate({
      name: stateName,
      avatar: image,
      email: user.email,
      role: "",
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsHovered(false);
  };

  const removeImage = () => {
    setImage(null);
    setIsHovered(false);
  };

  if (user === undefined) return <p>No user here!</p>;

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

  function setSearch(_value: string) {
    throw new Error("Function not implemented.");
  }

  return (
    <>
      <div className="flex justify-between flex-col mt-24 mx-auto lg:flex-row gap-6 w-11/12  px-4">
        <div className="flex justify-between w-full    ">

          <div className="  h-40  mb-8 lg:mb-0 shadow dark:bg-gray-800 dark:border-gray-700 border rounded-lg">
            {show ? (
              <>
                {/* Contenedor de la información principal */}
                <div className="flex flex-col items-start w-full h-40 justify-between  w-min-350px">
                  <div className="flex items-center justify-around w-full  p-2 rounded-lg pl-10" >
                    {user && user.avatar !== undefined && (
                      <div className="flex flex-col ">
                        <img
                          className="w-24 h-24 rounded-full shadow"
                          src={`${import.meta.env.VITE_BACKEND_URL}${user.avatar}`}
                          alt="User image"
                        />

                      </div>
                    )}
                    <div className="flex flex-col w-6/12">
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
                        {user.email}
                      </span>
                      <span className="text-sm text-gray-700 font-italic opacity-75 dark:text-gray-400 mt-1.5">
                        {user.role}
                      </span>
                      <span className="text-sm text-gray-700 font-italic opacity-75 dark:text-gray-400 mt-1.5">
                        {user.phone}
                      </span>

                    </div>

                  </div>
                  <div className="flex flex-row w-full justify-between px-2">

                    <ModalEditProfile
                      stateName={stateName}
                      setStateName={setStateName}
                      stateLast={stateLast}
                      setStateLast={setStateLast}
                      image={image}
                      handleFileChange={handleFileChange}
                      removeImage={removeImage}
                      setShow={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                      handleSubmit={function (): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                    <ModalRequestSeller userId={""} requestSellerStatus={function (): void {
                      throw new Error("Function not implemented.");
                    } }                     
                    
                    
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="p-11">
                <form onSubmit={handleSubmit}>
                  <div className="p-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                      className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Nombre"
                    />
                  </div>

                  <div className="p-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Apellido
                    </label>
                    <input
                      type="text"
                      value={stateLast}
                      onChange={(e) => setStateLast(e.target.value)}
                      className="border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Apellido"
                    />
                  </div>

                  <div className="sm:col-span-2 p-2">
                    <div className="flex items-center justify-center w-full">
                      {image === null ? (
                        <label
                          htmlFor="dropzone-file"
                          className={`flex flex-col items-center justify-center w-full h-64 
                          border-2 border-gray-600 border-dashed rounded-lg 
                          cursor-pointer bg-gray-40 ${isHovered ? "bg-gray-600" : "hover:bg-gray-600"
                            }`}
                          onDragEnter={handleDragEnter}
                          onDragLeave={handleDragLeave}
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
                            <span className="font-semibold">Click to upload</span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or GIF (MAX. 800x400px)
                          </p>
                          <input
                            id="dropzone-file"
                            ref={inputRef}
                            onChange={handleFileChange}
                            type="file"
                            className="hidden"
                          />
                        </label>
                      ) : (
                        <div className="flex flex-col items-center">
                          <img
                            src={filePreview}
                            alt="Preview"
                            className="h-32 w-32 object-cover rounded-full mb-2"
                          />
                          <button
                            onClick={removeImage}
                            type="button"
                            className="w-full text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                          >
                            Quitar Imagen
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      type="submit"
                      className="w-full text-white bg-[#39A900] hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-lime-600 dark:hover:bg-lime-700 dark:focus:ring-lime-800"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          {/* aqui es la otra columna */}
          <div className="w-full lg:w-2/3  ">
            <div className="bg-white dark:bg-gray-800 relative  h-40 card-bordered shadow-md sm:rounded-lg overflow-hidden">
              <div className="flex flex-col h-full md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                  <form className="flex items-center">
                    <label htmlFor="simple-search" className="sr-only">
                      Buscar
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </div>
                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        type="text"
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="Buscar"
                      />
                    </div>
                  </form>
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                  <button
                    onClick={() => setShow("purchase-history")}
                    type="button"
                    className="flex items-center justify-center text-white  bg-[#39A900] hover:bg-lime-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-lime-600 dark:hover:bg-lime-700 focus:outline-none dark:focus:ring-lime-800"
                  >
                    Historial de Compras
                  </button>
                  <button
                    onClick={() => setShow("vendedor-order")}
                    type="button"
                    className="flex items-center justify-center text-white  bg-[#39A900] hover:bg-lime-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-lime-600 dark:hover:bg-lime-700 focus:outline-none dark:focus:ring-lime-800"
                  >
                    Órdenes del Vendedor
                  </button>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>
      {show === "purchase-history" && <ShopHistory search={search} />}
      {show === "vendedor-order" && <VendedorProduct search={search} />}
      
      <AsideFilter />
    </>);
};
export default UserProfile;
