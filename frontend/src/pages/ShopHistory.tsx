import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HistorialDeCompras = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const DescargaRequest = (email: string, password: string) => {
    // Lógica para la solicitud de descarga
    return axios.post("/api/descargar", { email, password });
  };

  const DescargaMutation = useMutation({
    mutationFn: () => {
      return DescargaRequest("email@example.com", "password123");
    },
    onSuccess: (response: any) => {
      console.log("Descarga exitosa!", response);
      toast.success("Descarga exitosa!"); // Mensaje de éxito
    },
    onError: () => {
      toast.error("Hubo un error, intenta de nuevo");
    },
  });

  return (
    <div className="flex flex-col items-center px-4 mt-10">
      <div className="w-full max-w-5xl p-6 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Historial de Compras
        </h2>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar por producto, fecha, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-lime-500 transition-all duration-300 ease-in-out"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-600 text-white">
                  Imagen
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-white">
                  Producto
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-white">
                  Fecha
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-white">
                  Precio
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-white">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Ejemplo datos de compras */}
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
                  producto: "Producto 2",
                  fecha: "2024-08-19",
                  precio: "$50.00",
                },
                {
                  id: 3,
                  imagen: "../../..//media/213.jpg",
                  producto: "Producto 3",
                  fecha: "2024-08-19",
                  precio: "$50.00",
                },
                {
                  id: 4,
                  imagen: "https://via.placeholder.com/50",
                  producto: "Producto 4",
                  fecha: "2024-08-15",
                  precio: "$30.00",
                },
              ].map((compra) => (
                <tr key={compra.id}>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <img
                      src={compra.imagen}
                      alt={compra.producto}
                      className="w-12 h-12"
                    />
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600 text-white">
                    {compra.producto}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600 text-white">
                    {compra.fecha}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600 text-white">
                    {compra.precio}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-600">
                    <button
                      onClick={() => DescargaMutation.mutate()}
                      className=" bg-lime-600  text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 ease-in-out"
                    >
                     
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
