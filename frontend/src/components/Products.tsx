import Pagination from '@mui/material/Pagination';
import {
    useQueryClient,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiFillPlusSquare } from "react-icons/ai";
import { Link } from "react-router-dom";
import { delete_product, get_all_products_paginated } from "../api/products";
import { Product } from "../Interfaces";
import ModalProducts from "./shared/Modal/ModalProducts";
import './style.css';

interface Props {
    results: any;
}

const Products = ({ results }: Props) => {
    const [page, setPage] = useState(1);
    const [dataLenght, setDataLenght] = useState(0);
    const [productos, setProductos] = useState([]);
    const [idLocal, setIdLocal] = React.useState(0);
    const queryClient = useQueryClient();

    const fetchProductos = async (page: number) => {
        try {
            console.log("trayendo productos de la pagina: " + page)
            const productosAPI = await get_all_products_paginated(page);
            setProductos(productosAPI.data);
            setDataLenght(productosAPI.meta.count)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {

        fetchProductos(page);

    }, [page])

    const updateProduct = async (id: number) => {
        try {
            await updateProduct(id)
            toast.success('Producto actualizado con éxito!');
        } catch (e) {
            toast.error('Error al actualizar el producto');
        }
    }

    const deleteProduct = async (id: number) => {
        try {
            await delete_product(id);
            toast.success('Producto eliminado con éxito!');
            queryClient.invalidateQueries(["products"]);
            fetchProductos(page);
        } catch (e: any) {
            toast.error('Error al eliminar el producto');
        }
    };

    return (
        <div className="overflow-x-auto scroll-tablas">
            <h2 className="text-xl font-semibold  my-3 text-center text-black ">
                Lista de Productos
            </h2>
            <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400 bg-slate-50 border-top">
                <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 bg-slate-100">
                    <tr>
                        <th scope="col" className="px-4 py-3">
                            Id producto
                        </th>
                        <th scope="col" className="px-4 py-3">
                            Nombre
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Precio
                        </th>

                        <th scope="col" className="px-4 py-3">
                            Cantidad en stock
                        </th>

                        <th
                            scope="col"
                            className="px-4 py-3 flex justify-center gap-4"
                        >
                            Acciones
                            <Link to="add">
                                <AiFillPlusSquare
                                    size={22}
                                    className="text-green-300 cursor-pointer"
                                />
                            </Link>
                        </th>
                    </tr>
                </thead>

                {productos?.map((product: Product, index: number) => (
                    <tbody key={index}>
                        <tr className="border-b dark:border-gray-700">
                            <th
                                scope="row"
                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                            >
                                {product.id}
                            </th>

                            <td className="px-4 py-3">
                                {product.name}
                            </td>

                            <td className="px-4 py-3">
                                $ {product.price}
                            </td>

                            <td className="px-4 py-3">
                                {product.count_in_stock}
                            </td>
                            <td className="px-4 py-3 flex items-center justify-center gap-4 h-full">

                                <svg
                                    onClick={() => {
                                        if (product.id) {
                                            deleteProduct(product.id);
                                        }
                                    }}
                                    className="w-6 h-6 text-red-300 cursor-pointer" // Estilo de cursor y color del ícono
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>

                                <ModalProducts idLocal={idLocal} updateProduct={updateProduct} />
                            </td>
                        </tr>
                    </tbody>
                ))}
            </table>
            <div>
                <Pagination
                    count={Math.ceil(dataLenght / 10)}
                    page={page}
                    onChange={(event, value) => setPage(value)}
                    className="flex flex-row w-full justify-center my-6"
                />
            </div>
        </div>
    );

};

export default Products;

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
