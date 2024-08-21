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
        <button
          className="mb-4 text-white underline"
          onClick={() => (window.location.href = "/profile")}
        >
          Volver
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center text-white">
          Historial de Compras
        </h2>
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Buscar por producto, fecha, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 pl-10 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          />
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 4a7 7 0 017 7 7 7 0 01-7 7 7 7 0 010-14zm0 0l7 7"
              />
            </svg>
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
                  Factura
                </th>
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
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all duration-300 ease-in-out"
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
