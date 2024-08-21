import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Función de ejemplo para simular la solicitud de órdenes
const fetchOrders = async (searchTerm: string) => {
    // Simula una solicitud a la API para obtener datos de órdenes
    return [
        {
            id: 1,
            comprador: "Juan Pérez",
            fecha: "2024-08-19",
            total: "$50.00",
        },
        {
            id: 2,
            comprador: "Ana Gómez",
            fecha: "2024-08-18",
            total: "$30.00",
        },
        {
            id: 3,
            comprador: "Carlos Fernández",
            fecha: "2024-08-17",
            total: "$70.00",
        },
        {
            id: 4,
            comprador: "Laura Martínez",
            fecha: "2024-08-16",
            total: "$20.00",
        }
    ];
};

const SellerProduct = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['ordenes', searchTerm],
        queryFn: () => fetchOrders(searchTerm),
    });

    return (
        <div className="flex flex-col items-center px-4 mt-10">
            <div className="w-full max-w-5xl p-6 bg-gray-800 rounded-lg shadow-md">
                <button
                    className="mb-4 text-white underline"
                    onClick={() => window.location.href = '/profile'}
                >
                    Volver al perfil
                </button>
                <h2 className="text-xl font-semibold mb-4 text-center text-white">
                    Historial de Órdenes
                </h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por ID, nombre del comprador o fecha"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 rounded border border-gray-600 bg-gray-700 text-white"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-gray-800">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b border-gray-600 text-white">ID</th>
                                <th className="py-2 px-4 border-b border-gray-600 text-white">Comprador</th>
                                <th className="py-2 px-4 border-b border-gray-600 text-white">Fecha</th>
                                <th className="py-2 px-4 border-b border-gray-600 text-white">Total</th>
                                <th className="py-2 px-4 border-b border-gray-600 text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-white">Cargando...</td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-2 px-4 border-b border-gray-600 text-white">
                                            {order.id}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-white">
                                            {order.comprador}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-white">
                                            {order.fecha}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600 text-white">
                                            {order.total}
                                        </td>
                                        <td className="py-2 px-4 border-b border-gray-600">
                                            <button
                                                onClick={() => {
                                                    toast.success("Descarga exitosa!");
                                                }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                            >
                                                PDF
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-4 text-center text-white">No hay órdenes</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SellerProduct;
