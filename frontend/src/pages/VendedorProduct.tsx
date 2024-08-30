import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import AsideFilter from "../components/tienda/AsideFilter/AsideFilter";
// import jsPDF from "jspdf";

// const generarPDF = (order: { id: any; comprador: any; fecha: any; total: any; }) => {
//   const pdf = new jsPDF();
//   pdf.text(`Orden #${order.id}`, 10, 10);
//   pdf.text(`Comprador: ${order.comprador}`, 10, 20);
//   pdf.text(`Fecha: ${order.fecha}`, 10, 30);
//   pdf.text(`Total: ${order.total}`, 10, 40);
// //  pdf.saveAs(`orden-${order.id}.pdf`, { destination: "download" });
// };

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
    },
  ];
};

const SellerProduct = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["ordenes", searchTerm],
    queryFn: () => fetchOrders(searchTerm),
  });

  return (
    <div className="flex flex-col items-center w-full px-4 mt-10">
      <div className=" w-11/12  p-6 card-bordered dark:bg-slate-300 rounded-lg shadow-md h-svh">
        <h2 className="text-xl font-semibold mb-4 text-center text-black">
          Historial de Órdenes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-600 text-black bg-gray-100">
                  ID
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-black bg-gray-100">
                  Comprador
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-black bg-gray-100">
                  Fecha
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-black bg-gray-100">
                  Total
                </th>
                <th className="py-2 px-4 border-b border-gray-600 text-black bg-gray-100">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-white">
                    Cargando...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-2 px-4 border-b border-gray-600 text-black bg-gray-50">
                      {order.id}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600 text-black bg-gray-50">
                      {order.comprador}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600 text-black bg-gray-50">
                      {order.fecha}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600 text-black bg-gray-50">
                      {order.total}
                    </td>
                    <td className="py-2 px-4 border-b border-gray-600 text-black bg-gray-50">
                      <button
                        // onClick={() => generarPDF(order)}
                        className=" bg-[#39A900]  text-white px-4 py-2 rounded hover:bg-blue-600"
                      >

                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-white">
                    No hay órdenes
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <AsideFilter />
    </div>
  );
};

export default SellerProduct;
