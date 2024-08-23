import {
    useInfiniteQuery,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { AiFillEdit, AiFillPlusSquare } from "react-icons/ai";
import { BsFillTrashFill } from "react-icons/bs";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import { delete_product, get_products } from "../api/products";
import { Product } from "../Interfaces";
import Loader from "./Loader";

interface Props {
    results: any;
}

const Products = ({ results }: Props) => {
    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    const {
        data,
        isLoading,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery(["products"], get_products, {
        getNextPageParam: (page: any) => page.meta.next,
    });

    const queryClient = useQueryClient();

    const deleteProdMutation = useMutation({
        mutationFn: delete_product,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
            toast.success("Product deleted!");
        },
        onError: () => {
            toast.error("Error!");
        },
    });

    if (deleteProdMutation.isLoading) return <Loader />;
    if (error instanceof Error) return <>{toast.error(error.message)}</>;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">
                            ID producto
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

                {results && results.products.length > 0 ? (
                    <>
                        {results &&
                            results.products.map((product: Product, index) => (
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
                                        <td className="px-4 py-3 flex items-center justify-center gap-4">
                    {/* Ícono de eliminar usuario */}
                    <svg
                      onClick={() => {
                        if (product.id) {
                            deleteProdMutation.mutate(product.id); // Elimina el usuario si tiene un ID
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
                    {/* Ícono de editar usuario */}
                    <svg
                      onClick={() => {
                        // Aquí puedes agregar la lógica para editar el usuario
                        console.log("Editar producto", product.id);
                      }}
                      className="w-6 h-6 text-blue-300 cursor-pointer" // Estilo de cursor y color del ícono
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </td>
                                        
                                    </tr>
                                </tbody>
                            ))}
                    </>
                ) : (
                    <>
                        {data?.pages.map((page: any) => (
                            <>
                                <tbody key={page.meta.next}>
                                    {page.data.map((product: Product) => (
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

                                            <td className="px-4 py-3">
                                                <div className="flex justify-center gap-4">
                                                    <BsFillTrashFill
                                                        onClick={() => {
                                                            if (
                                                                product.id !==
                                                                undefined
                                                            ) {
                                                                deleteProdMutation.mutate(
                                                                    product.id
                                                                );
                                                            }
                                                        }}
                                                        size={22}
                                                        className="text-red-300 cursor-pointer"
                                                    />

                                                    <Link
                                                        to={`edit/${product.id}`}
                                                    >
                                                        <AiFillEdit
                                                            size={22}
                                                            className="text-white cursor-pointer"
                                                        />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                                {!isLoading && data?.pages.length === 0 && (
                                    <p className="text-xl text-slate-800 dark:text-slate-200">
                                        No more results
                                    </p>
                                )}
                                {!isLoading &&
                                    data?.pages?.length !== undefined &&
                                    data.pages.length > 0 &&
                                    hasNextPage && (
                                        <div ref={ref}>
                                            {isLoading || isFetchingNextPage ? (
                                                <Loader />
                                            ) : null}
                                        </div>
                                    )}
                            </>
                        ))}
                    </>
                )}
            </table>
        </div>
    );
};
export default Products;
