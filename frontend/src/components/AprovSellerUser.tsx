import Pagination from '@mui/material/Pagination';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { get_users } from "../api/users";
import { User } from "../Interfaces";
import Loader from './Loader';

interface Props {
  results: any;
}

const AprovSellerUser = ({ results }: Props) => {
  const [page, setPage] = React.useState(1);
  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: get_users,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await get_users();
      return response;
    };
    fetchUsers().then((data) => {
      queryClient.setQueryData(["users"], data);
    });
  }, [page, queryClient]);

  const acceptUser = (name: number) => {
    // Implementar la logica de esa aceptar al cerdo aqui
    toast.success(`el usuario ${name} ha sido acceptado`);
  };

  const rejectUser = (name: number) => {
    // lo mismo de arriba pero para rechazar
    toast.error(`El Usuario ${name} ha sido rechazado`);
  };

  if (isError) return toast.error("Error!");
  if (isLoading) return <Loader />;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold mb-5 mt-5 text-center text-black ">
          Solicitudes Vendedor
        </h2>
        <table className="w-full  text-sm text-left text-gray-500 dark:text-gray-400 bg-slate-50 border-top">
        <thead className="text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400 bg-slate-100">
          <tr>
            <th scope="col" className="px-4 py-3">Id</th>
            <th scope="col" className="px-4 py-3">Nombre</th>
            <th scope="col" className="px-4 py-3">Apellido</th>
            <th scope="col" className="px-4 py-3">Correo Electronico</th>
            <th scope="col" className="px-4 py-3">Telefono</th>
            <th scope="col" className="px-4 py-3">Rol</th>
            <th scope="col" className="px-4 py-3 flex items-center justify-center gap-4">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {(results?.users || data)?.slice((page - 1) * 10, page * 10).map((user: User, index: number) => (
            <tr className="border-b dark:border-gray-700" key={index}>
              <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{user.id}</th>
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.last_name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{"123124124"}</td>
              <td className="px-4 py-3">{user.role}</td>
              <td className="px-4 py-3 flex items-center justify-center gap-4 h-full">
                <svg
                  onClick={() => acceptUser(user.name)}
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
                  onClick={() => rejectUser(user.name)}
                  className="w-6 h-6 text-red-500 cursor-pointer"
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
          count={Math.ceil((results?.users || data || []).length / 10)} 
          page={page} 
          onChange={(event, value) => setPage(value)} 
          className="flex flex-row w-full justify-center" 
        />
      </div>
    </div>
  );
};

export default AprovSellerUser;