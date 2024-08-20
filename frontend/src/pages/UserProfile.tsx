import { useAuthStore } from "../store/auth";
import { Token } from "../Interfaces";
import jwt_decode from "jwt-decode";
import React, { useState, ChangeEvent, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { edit_user, get_solo_user } from "../api/users";
import { toast } from "react-hot-toast";
import { my_orders } from "../api/orders";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

const UserProfile = () => {
    const [show, setShow] = useState(true);
    const [stateName, setStateName] = useState<string>("");
    const [stateLast, setStateLast] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string>("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const token: string = useAuthStore.getState().access;
    const tokenDecoded: Token = jwt_decode(token);
    const id = tokenDecoded.user_id;

    const { data: user } = useQuery({
        queryKey: ['users', id],
        queryFn: () => get_solo_user(id)
    });

    useEffect(() => {
        if (user) {
            setStateName(user.name);
            setStateLast(user.last_name);
            setImage(user.avatar);
        }
    }, [user]);

    const queryClient = useQueryClient();

    const editProfileMut = useMutation({
        mutationFn: edit_user,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Profile updated!");
            setShow(true);
        },
        onError: () => {
            toast.error("Error!");
            setShow(true);
        },
    });

    const { data, isError, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: my_orders
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        editProfileMut.mutate({
            name: stateName,
            last_name: stateLast,
            avatar: image,
            email: user.email,
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

    return (
        <div className="flex justify-center pt-[100px]">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                {show ? (
                    <>
                        <div className="flex flex-col items-center pb-10">
                            {user && user.avatar !== undefined && (
                                <img
                                    className="w-24 h-24 mb-3 mt-3 rounded-full shadow-lg"
                                    src={`${import.meta.env.VITE_BACKEND_URL}${user.avatar}`}
                                    alt="User image"
                                />
                            )}
                            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                                {user.email}
                            </h5>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {user.name} {user.last_name}
                            </span>
                            <div className="flex mt-4 space-x-3 md:mt-6">
                                <button
                                    onClick={() => setShow(false)}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                >
                                    Editar perfil
                                </button>
                                {/* Nuevo botón para redirigir a "historial de compras" */}
                                <Link
                                    to="/purchase-history"
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                                >
                                    Historial de Compras
                                </Link>
                            </div>
                        </div>

                        {/* Comentado porque se creará una nueva página */}
                        {/* <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Order ID</th>
                                        <th scope="col" className="px-4 py-3">Ver</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.map((order: any) => (
                                        <tr className="border-b dark:border-gray-700">
                                            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {order.id}
                                            </th>
                                            <td className="px-4 py-3">
                                                <Link 
                                                    to={`/order/${order.id}/`}
                                                    className="p-2 cursor-pointer rounded-lg bg-gray-900 hover:bg-gray-700"
                                                >
                                                    See
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div> */}
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
                                    onChange={(e) =>
                                        setStateName(e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
                                    onChange={(e) =>
                                        setStateLast(e.target.value)
                                    }
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        cursor-pointer bg-gray-40 ${
            isHovered ? "bg-gray-600" : "hover:bg-gray-600"
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
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1117 8h1a3 3 0 010 6h-1m-4 4v-4m0 0H9m4 0h2"
                                                ></path>
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">
                                                    Click to upload
                                                </span>{" "}
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
                                    className="w-full text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                >
                                    Guardar cambios
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
