import Pagination from '@mui/material/Pagination';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { bringRequestSeller, deleteRequestSeller, approveRequestSeller } from "../api/users";
import { User } from "../Interfaces";
import Loader from './Loader';

interface Props {
  results: any;
}

const AprovSellerUser = ({ results }: Props) => {
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();
  let usersArray = [];
  // Utiliza react-query para manejar la data y el estado de carga
  const { data, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: bringRequestSeller,
    select: (data) => Array.isArray(data) ? data : data.users || [], // Asegúrate de que 'data' sea un array
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await bringRequestSeller();
        usersArray = [];
        console.log(response.data)
        if (response.data && typeof response.data === 'object') {
          if (Array.isArray(response.data)) {
            usersArray = response.data;
          } else {
            usersArray = Object.values(response.data); 
          }
        } else if (Array.isArray(response.data)) {
          usersArray = response.data;
        }

        queryClient.setQueryData(["users"], usersArray);
        console.log('Tipo de usersArray:', Array.isArray(usersArray) ? 'Array' : 'No es un Array');
        console.log('usersArray:', usersArray);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        toast.error('Error al obtener usuarios');
      }
    };

    fetchUsers();
  }, [page, queryClient]);

  const acceptUser = async (idUser: number, name: string) => {
    try {
      await approveRequestSeller(idUser);
      toast.dismiss();
      toast.success(`El usuario ${name} ha sido aceptado`);
      queryClient.invalidateQueries(["users"]);
    } catch (e) {
      toast.warning(`Ha ocurrido un problema al aceptar el usuario ${name}`);
    }
  };

  const rejectUser = async (idUser: number, name: string) => {
    try {
      await deleteRequestSeller(idUser);
      toast.dismiss();
      toast.error(`El usuario ${name} ha sido rechazado`);
      queryClient.invalidateQueries(["users"]); // Actualiza los datos después del rechazo
    } catch (e) {
      toast.warning(`Ha ocurrido un problema al rechazar el usuario ${name}`);
    }
  };

  if (isError) return <p>Error!</p>;
  if (isLoading) return <Loader />;

  const users = (results || data) || []; // Asegúrate de que sea un array

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold my-3 text-center text-black">
        Solicitudes Vendedor
      </h2>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 bg-slate-50 border-top">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 bg-slate-100">
          <tr>
            <th scope="col" className="px-4 py-3">Id</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Correo Electrónico</th>
            <th scope="col" className="px-4 py-3">Teléfono</th>
            <th scope="col" className="px-4 py-3 flex items-center justify-center gap-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usersArray.slice((page - 1) * 10, page * 10).map((user: User, index: number) => (
            <tr key={index} className="border-b dark:border-gray-700" key={user.id}>
              <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.user.id}</th>
              <td className="px-4 py-3">{user.user.name}</td>
              <td className="px-4 py-3">{user.date_requested}</td>
              <td className="px-4 py-3">{user.user.email}</td>
              <td className="px-4 py-3">{user.user.phone == null ? "Sin registrar" : user.phone}</td>
              <td className="px-4 py-3 flex items-center justify-center gap-4 h-full">
                <svg
                  onClick={() => acceptUser(user.user.id, user.name)}
                  className="w-6 h-6 text-green-500 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>

                <svg
                  onClick={() => rejectUser(user.id, user.name)}
                  className="w-6 h-6 text-red-800 cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <Pagination
          count={Math.ceil(users.length / 10)}
          page={page}
          onChange={(event, value) => setPage(value)}
          className="flex flex-row w-full justify-center"
        />
      </div>
    </div>
  );
};

export default AprovSellerUser;
