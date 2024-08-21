import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HistorialDeCompras = () => {
    const DescargaRequest = (email: string, password: string) => {
        // Lógica para la solicitud de descarga
        return axios.post("/api/descargar", { email, password });
    };

    const DescargaMutation = useMutation({
        mutationFn: () => {
            return DescargaRequest('email@example.com', 'password123');
        },
        onSuccess: (response: any) => {
            console.log("Descarga exitosa!", response);
            toast.success("Descarga exitosa!");  // Mensaje de éxito
            // Aquí puedes agregar lógica adicional después de la descarga exitosa
        },
        onError: () => {
            toast.error("Hubo un error, intenta devuelta");
        },
    });

    return (
        <div className="flex justify-center px-4 mt-10">
            <div className="w-full max-w-5xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
                    Historial de Compras
                </h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white dark:bg-gray-800">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">Imagen</th>
                                <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">Producto</th>
                                <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">Fecha</th>
                                <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">Precio</th>
                                <th className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">Factura</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* Ejemplo de datos de compras */}
                            {[
                                {
                                    id: 1,
                                    imagen: "../../../media/213.jpg",
                                    producto: "Producto 1",
                                    fecha: "2024-08-19",
                                    precio: "$50.00",
                                },
                                {
                                    id: 2,
                                    imagen: "../../..//media/213.jpg",
                                    producto: "Producto 1",
                                    fecha: "2024-08-19",
                                    precio: "$50.00",
                                },
                                {
                                    id: 3,
                                    imagen: "../../..//media/213.jpg",
                                    producto: "Producto 1",
                                    fecha: "2024-08-19",
                                    precio: "$50.00",
                                },
                                {
                                    id: 4,
                                    imagen: "https://via.placeholder.com/50",
                                    producto: "Producto 2",
                                    fecha: "2024-08-15",
                                    precio: "$30.00",
                                },
                            ].map((compra) => (
                                <tr key={compra.id}>
                                    <td className="py-2 px-4 border-b dark:border-gray-700">
                                        <img src={compra.imagen} alt={compra.producto} className="w-12 h-12" />
                                    </td>
                                    <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">
                                        {compra.producto}
                                    </td>
                                    <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">
                                        {compra.fecha}
                                    </td>
                                    <td className="py-2 px-4 border-b dark:border-gray-700 text-gray-800 dark:text-white">
                                        {compra.precio}
                                    </td>
                                    <td className="py-2 px-4 border-b dark:border-gray-700">
                                        <button
                                            onClick={() => DescargaMutation.mutate()}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            PDF
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistorialDeCompras;
